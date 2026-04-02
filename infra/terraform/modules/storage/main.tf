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

variable "bucket_names" {
  description = "List of S3 bucket suffixes to create"
  type        = list(string)
  default     = ["uploads", "avatars", "emoji"]
}

variable "force_destroy" {
  description = "Allow bucket deletion even when non-empty (use false in production)"
  type        = bool
  default     = false
}

locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# S3 Buckets
resource "aws_s3_bucket" "buckets" {
  for_each = toset(var.bucket_names)

  bucket        = "${var.project_name}-${var.environment}-${each.key}"
  force_destroy = var.force_destroy

  tags = merge(local.common_tags, {
    Name = "${var.project_name}-${var.environment}-${each.key}"
  })
}

# Block public access by default
resource "aws_s3_bucket_public_access_block" "buckets" {
  for_each = aws_s3_bucket.buckets

  bucket = each.value.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Versioning
resource "aws_s3_bucket_versioning" "buckets" {
  for_each = aws_s3_bucket.buckets

  bucket = each.value.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "buckets" {
  for_each = aws_s3_bucket.buckets

  bucket = each.value.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Lifecycle rules for uploads bucket
resource "aws_s3_bucket_lifecycle_configuration" "uploads" {
  bucket = aws_s3_bucket.buckets["uploads"].id

  rule {
    id     = "transition-to-ia"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}

# CORS configuration for avatar and emoji buckets (public read)
resource "aws_s3_bucket_cors_configuration" "public_read" {
  for_each = toset(["avatars", "emoji"])

  bucket = aws_s3_bucket.buckets[each.key].id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    max_age_seconds = 86400
  }
}

# IAM policy for application access
resource "aws_iam_policy" "s3_access" {
  name        = "${var.project_name}-${var.environment}-s3-access"
  description = "Policy for ${var.project_name} S3 bucket access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ListBuckets"
        Effect = "Allow"
        Action = [
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ]
        Resource = [for b in aws_s3_bucket.buckets : b.arn]
      },
      {
        Sid    = "ObjectAccess"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:GetObjectAcl",
          "s3:PutObjectAcl"
        ]
        Resource = [for b in aws_s3_bucket.buckets : "${b.arn}/*"]
      }
    ]
  })

  tags = local.common_tags
}

output "bucket_ids" {
  value = { for k, v in aws_s3_bucket.buckets : k => v.id }
}

output "bucket_arns" {
  value = { for k, v in aws_s3_bucket.buckets : k => v.arn }
}

output "s3_access_policy_arn" {
  value = aws_iam_policy.s3_access.arn
}
