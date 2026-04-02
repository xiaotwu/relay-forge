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

variable "subnet_ids" {
  description = "List of subnet IDs for the cache subnet group"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group ID for the cache"
  type        = string
}

variable "node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.medium"
}

variable "num_cache_nodes" {
  description = "Number of cache nodes (for cluster mode disabled)"
  type        = number
  default     = 2
}

variable "engine_version" {
  description = "Valkey/Redis engine version"
  type        = string
  default     = "7.1"
}

locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# Generate auth token
resource "random_password" "auth_token" {
  length           = 64
  special          = true
  override_special = "!&#$^<>-"
}

# Store auth token in Secrets Manager
resource "aws_secretsmanager_secret" "cache_auth" {
  name        = "${var.project_name}-${var.environment}-cache-auth"
  description = "ElastiCache auth token for ${var.project_name}"

  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "cache_auth" {
  secret_id     = aws_secretsmanager_secret.cache_auth.id
  secret_string = random_password.auth_token.result
}

# Subnet Group
resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}"
  subnet_ids = var.subnet_ids

  tags = local.common_tags
}

# Parameter Group
resource "aws_elasticache_parameter_group" "main" {
  name   = "${var.project_name}-${var.environment}"
  family = "redis7"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }

  tags = local.common_tags
}

# ElastiCache Replication Group (Redis/Valkey compatible)
resource "aws_elasticache_replication_group" "main" {
  replication_group_id = "${var.project_name}-${var.environment}"
  description          = "Valkey/Redis cache for ${var.project_name} ${var.environment}"

  engine         = "redis"
  engine_version = var.engine_version
  node_type      = var.node_type

  num_cache_clusters = var.num_cache_nodes

  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [var.security_group_id]
  parameter_group_name = aws_elasticache_parameter_group.main.name

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                 = random_password.auth_token.result

  automatic_failover_enabled = var.num_cache_nodes > 1
  multi_az_enabled           = var.num_cache_nodes > 1

  snapshot_retention_limit = 7
  snapshot_window          = "03:00-05:00"
  maintenance_window       = "sun:05:00-sun:06:00"

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-cache"
  })
}

output "primary_endpoint" {
  value = aws_elasticache_replication_group.main.primary_endpoint_address
}

output "port" {
  value = 6379
}

output "auth_token_secret_arn" {
  value = aws_secretsmanager_secret.cache_auth.arn
}
