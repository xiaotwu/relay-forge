variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "relayforge"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for ECS tasks"
  type        = list(string)
}

variable "public_subnet_ids" {
  description = "Public subnet IDs for the load balancer"
  type        = list(string)
}

variable "alb_security_group_id" {
  description = "Security group ID for the ALB"
  type        = string
}

variable "app_security_group_id" {
  description = "Security group ID for application containers"
  type        = string
}

variable "s3_access_policy_arn" {
  description = "ARN of the S3 access IAM policy"
  type        = string
}

variable "image_tag" {
  description = "Docker image tag to deploy"
  type        = string
  default     = "latest"
}

variable "image_registry" {
  description = "Docker image registry"
  type        = string
  default     = "ghcr.io/relayforge"
}

variable "services" {
  description = "Map of services with their configurations"
  type = map(object({
    cpu    = number
    memory = number
    port   = number
    count  = number
    health_check_path = string
  }))
  default = {
    api = {
      cpu               = 512
      memory            = 1024
      port              = 8080
      count             = 2
      health_check_path = "/healthz"
    }
    realtime = {
      cpu               = 512
      memory            = 1024
      port              = 8081
      count             = 2
      health_check_path = "/healthz"
    }
    media = {
      cpu               = 1024
      memory            = 2048
      port              = 8082
      count             = 2
      health_check_path = "/healthz"
    }
    worker = {
      cpu               = 512
      memory            = 1024
      port              = 0
      count             = 2
      health_check_path = ""
    }
    web = {
      cpu               = 256
      memory            = 512
      port              = 80
      count             = 2
      health_check_path = "/healthz"
    }
  }
}

locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
  # Services that need ALB target groups (have ports)
  lb_services = { for k, v in var.services : k => v if v.port > 0 && k != "worker" }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = local.common_tags
}

resource "aws_ecs_cluster_capacity_providers" "main" {
  cluster_name = aws_ecs_cluster.main.name

  capacity_providers = ["FARGATE", "FARGATE_SPOT"]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 1
    capacity_provider = "FARGATE"
  }
}

# Task Execution Role
resource "aws_iam_role" "ecs_execution" {
  name = "${var.project_name}-${var.environment}-ecs-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Task Role (for application-level permissions)
resource "aws_iam_role" "ecs_task" {
  name = "${var.project_name}-${var.environment}-ecs-task"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "ecs_task_s3" {
  role       = aws_iam_role.ecs_task.name
  policy_arn = var.s3_access_policy_arn
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "services" {
  for_each = var.services

  name              = "/ecs/${var.project_name}-${var.environment}/${each.key}"
  retention_in_days = 30

  tags = local.common_tags
}

# Task Definitions
resource "aws_ecs_task_definition" "services" {
  for_each = var.services

  family                   = "${var.project_name}-${var.environment}-${each.key}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = each.value.cpu
  memory                   = each.value.memory
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([{
    name  = each.key
    image = "${var.image_registry}/${each.key}:${var.image_tag}"

    portMappings = each.value.port > 0 ? [{
      containerPort = each.value.port
      protocol      = "tcp"
    }] : []

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.services[each.key].name
        "awslogs-region"        = data.aws_region.current.name
        "awslogs-stream-prefix" = each.key
      }
    }

    essential = true
  }])

  tags = local.common_tags
}

data "aws_region" "current" {}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.project_name}-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.public_subnet_ids

  tags = local.common_tags
}

# ALB Target Groups
resource "aws_lb_target_group" "services" {
  for_each = local.lb_services

  name        = "${var.project_name}-${var.environment}-${each.key}"
  port        = each.value.port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    path                = each.value.health_check_path
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }

  tags = local.common_tags
}

# ALB Listener (HTTPS)
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.main.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.services["web"].arn
  }
}

# ALB Listener (HTTP redirect)
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# Listener Rules
resource "aws_lb_listener_rule" "api" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.services["api"].arn
  }

  condition {
    path_pattern {
      values = ["/api/v1/*", "/healthz"]
    }
  }
}

resource "aws_lb_listener_rule" "realtime" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 90

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.services["realtime"].arn
  }

  condition {
    path_pattern {
      values = ["/ws", "/ws/*"]
    }
  }
}

resource "aws_lb_listener_rule" "media" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 95

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.services["media"].arn
  }

  condition {
    path_pattern {
      values = ["/api/v1/media/*", "/api/v1/voice/*"]
    }
  }
}

# ACM Certificate
resource "aws_acm_certificate" "main" {
  domain_name       = "${var.project_name}.example.com"
  validation_method = "DNS"

  tags = local.common_tags

  lifecycle {
    create_before_destroy = true
  }
}

# ECS Services
resource "aws_ecs_service" "services" {
  for_each = var.services

  name            = each.key
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.services[each.key].arn
  desired_count   = each.value.count
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [var.app_security_group_id]
  }

  dynamic "load_balancer" {
    for_each = contains(keys(local.lb_services), each.key) ? [1] : []
    content {
      target_group_arn = aws_lb_target_group.services[each.key].arn
      container_name   = each.key
      container_port   = each.value.port
    }
  }

  tags = local.common_tags
}

output "cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "alb_zone_id" {
  value = aws_lb.main.zone_id
}
