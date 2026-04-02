terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # Uncomment and configure for remote state
  # backend "s3" {
  #   bucket         = "relayforge-terraform-state"
  #   key            = "production/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "relayforge-terraform-locks"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "relayforge"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "image_tag" {
  description = "Docker image tag to deploy"
  type        = string
  default     = "latest"
}

# Networking
module "networking" {
  source = "../../modules/networking"

  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr           = "10.0.0.0/16"
  availability_zones = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
}

# Database
module "database" {
  source = "../../modules/database"

  project_name      = var.project_name
  environment       = var.environment
  vpc_id            = module.networking.vpc_id
  subnet_ids        = module.networking.private_subnet_ids
  security_group_id = module.networking.database_security_group_id
  instance_class    = "db.t3.medium"
  multi_az          = true
}

# Cache
module "cache" {
  source = "../../modules/cache"

  project_name      = var.project_name
  environment       = var.environment
  subnet_ids        = module.networking.private_subnet_ids
  security_group_id = module.networking.cache_security_group_id
  node_type         = "cache.t3.medium"
  num_cache_nodes   = 2
}

# Storage
module "storage" {
  source = "../../modules/storage"

  project_name = var.project_name
  environment  = var.environment
  bucket_names = ["uploads", "avatars", "emoji"]
}

# Compute (ECS Fargate)
module "compute" {
  source = "../../modules/compute"

  project_name          = var.project_name
  environment           = var.environment
  vpc_id                = module.networking.vpc_id
  private_subnet_ids    = module.networking.private_subnet_ids
  public_subnet_ids     = module.networking.public_subnet_ids
  alb_security_group_id = module.networking.alb_security_group_id
  app_security_group_id = module.networking.app_security_group_id
  s3_access_policy_arn  = module.storage.s3_access_policy_arn
  image_tag             = var.image_tag
}

# Outputs
output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = module.compute.alb_dns_name
}

output "database_endpoint" {
  description = "Database endpoint"
  value       = module.database.endpoint
}

output "cache_endpoint" {
  description = "Cache endpoint"
  value       = module.cache.primary_endpoint
}

output "s3_buckets" {
  description = "S3 bucket names"
  value       = module.storage.bucket_ids
}
