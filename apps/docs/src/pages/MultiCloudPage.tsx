export default function MultiCloudPage() {
  return (
    <div>
      <h1>Multi-Cloud Compatibility</h1>
      <p>
        RelayForge is designed for cloud portability. Every infrastructure dependency uses a
        standard, vendor-neutral protocol: PostgreSQL for relational data, S3-compatible APIs for
        object storage, and the Redis protocol (Valkey) for caching and pub/sub. This means you can
        deploy on any major cloud provider &mdash; or on bare metal &mdash; without modifying
        application code.
      </p>

      <h2>Architecture for Portability</h2>
      <p>
        The following table shows each infrastructure dependency and the abstraction that enables
        portability:
      </p>
      <table>
        <thead>
          <tr>
            <th>Dependency</th>
            <th>Protocol / API</th>
            <th>Abstraction Layer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Relational Database</td>
            <td>PostgreSQL wire protocol</td>
            <td>
              <code>database/sql</code> with <code>pgx</code> driver
            </td>
          </tr>
          <tr>
            <td>Cache / Pub-Sub</td>
            <td>Redis protocol (RESP3)</td>
            <td>
              <code>go-redis/redis</code> client library
            </td>
          </tr>
          <tr>
            <td>Object Storage</td>
            <td>S3 API</td>
            <td>AWS SDK for Go v2 with custom endpoint</td>
          </tr>
          <tr>
            <td>WebRTC SFU</td>
            <td>LiveKit protocol</td>
            <td>LiveKit Go SDK</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>SMTP</td>
            <td>
              Standard <code>net/smtp</code>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>AWS Deployment</h2>
      <p>AWS is the most common deployment target. Use these managed services:</p>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>AWS Service</th>
            <th>Configuration Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Database</td>
            <td>Amazon RDS for PostgreSQL</td>
            <td>
              Use version 16+. Enable Multi-AZ for HA. Set <code>DB_SSL_MODE=require</code>.
            </td>
          </tr>
          <tr>
            <td>Cache</td>
            <td>Amazon ElastiCache (Valkey mode)</td>
            <td>
              ElastiCache supports Valkey natively since late 2024. Use cluster mode disabled for
              simplicity, or cluster mode enabled for &gt;10K connections.
            </td>
          </tr>
          <tr>
            <td>Object Storage</td>
            <td>Amazon S3</td>
            <td>
              Set <code>S3_USE_PATH_STYLE=false</code> (S3 uses virtual-hosted style). Create three
              buckets matching the <code>S3_BUCKET_*</code> variables.
            </td>
          </tr>
          <tr>
            <td>Compute</td>
            <td>ECS Fargate or EKS</td>
            <td>
              Fargate is simpler for small teams. EKS provides more control and uses the Helm chart.
              Graviton (ARM64) instances reduce costs by ~20%.
            </td>
          </tr>
          <tr>
            <td>CDN</td>
            <td>CloudFront</td>
            <td>Place in front of the web client and S3 buckets for global latency reduction.</td>
          </tr>
          <tr>
            <td>DNS</td>
            <td>Route 53</td>
            <td>Use alias records pointing to ALB or CloudFront distributions.</td>
          </tr>
          <tr>
            <td>TLS</td>
            <td>ACM (Certificate Manager)</td>
            <td>Free TLS certificates that auto-renew when used with ALB or CloudFront.</td>
          </tr>
        </tbody>
      </table>
      <pre>
        <code>{`# AWS-specific environment variables
DB_HOST=relayforge.xxx.us-east-1.rds.amazonaws.com
DB_SSL_MODE=require

VALKEY_HOST=relayforge.xxx.cache.amazonaws.com
VALKEY_PORT=6379

S3_ENDPOINT=https://s3.us-east-1.amazonaws.com
S3_REGION=us-east-1
S3_USE_PATH_STYLE=false`}</code>
      </pre>

      <h2>Tencent Cloud Deployment</h2>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Tencent Cloud Service</th>
            <th>Configuration Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Database</td>
            <td>TencentDB for PostgreSQL</td>
            <td>Supports PostgreSQL 16. Enable automatic backup. Use the VPC internal endpoint.</td>
          </tr>
          <tr>
            <td>Cache</td>
            <td>TencentDB for Redis</td>
            <td>
              Standard or cluster architecture. Fully compatible with the Redis protocol used by
              Valkey clients.
            </td>
          </tr>
          <tr>
            <td>Object Storage</td>
            <td>Cloud Object Storage (COS)</td>
            <td>
              COS provides an S3-compatible API. Set{' '}
              <code>S3_ENDPOINT=https://cos.ap-region.myqcloud.com</code>. Use{' '}
              <code>S3_USE_PATH_STYLE=false</code>.
            </td>
          </tr>
          <tr>
            <td>Compute</td>
            <td>TKE (Tencent Kubernetes Engine)</td>
            <td>Deploy using the Helm chart. TKE supports both x86 and ARM nodes.</td>
          </tr>
          <tr>
            <td>CDN</td>
            <td>Tencent CDN</td>
            <td>Configure origin pull from COS for static assets and uploaded media.</td>
          </tr>
        </tbody>
      </table>
      <pre>
        <code>{`# Tencent Cloud-specific environment variables
DB_HOST=10.0.1.100  # VPC internal address
DB_SSL_MODE=require

VALKEY_HOST=10.0.1.200
VALKEY_PASSWORD=your-redis-password

S3_ENDPOINT=https://cos.ap-guangzhou.myqcloud.com
S3_REGION=ap-guangzhou
S3_USE_PATH_STYLE=false
S3_ACCESS_KEY=your-cos-secret-id
S3_SECRET_KEY=your-cos-secret-key`}</code>
      </pre>

      <h2>Alibaba Cloud Deployment</h2>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Alibaba Cloud Service</th>
            <th>Configuration Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Database</td>
            <td>ApsaraDB RDS for PostgreSQL</td>
            <td>
              Use the high-availability edition. Enable SSL and set <code>DB_SSL_MODE=require</code>
              .
            </td>
          </tr>
          <tr>
            <td>Cache</td>
            <td>ApsaraDB for Redis</td>
            <td>Community or enhanced edition. Both are Redis-protocol compatible.</td>
          </tr>
          <tr>
            <td>Object Storage</td>
            <td>OSS (Object Storage Service)</td>
            <td>
              OSS provides an S3-compatible API. Set{' '}
              <code>S3_ENDPOINT=https://oss-region.aliyuncs.com</code>.
            </td>
          </tr>
          <tr>
            <td>Compute</td>
            <td>ACK (Container Service for Kubernetes)</td>
            <td>
              Managed Kubernetes with the Helm chart. ACK supports ARM-based ECS instances (Yitian
              710).
            </td>
          </tr>
        </tbody>
      </table>
      <pre>
        <code>{`# Alibaba Cloud-specific environment variables
DB_HOST=pgm-xxx.pg.rds.aliyuncs.com
DB_SSL_MODE=require

VALKEY_HOST=r-xxx.redis.rds.aliyuncs.com
VALKEY_PASSWORD=your-redis-password

S3_ENDPOINT=https://oss-cn-hangzhou.aliyuncs.com
S3_REGION=cn-hangzhou
S3_USE_PATH_STYLE=false
S3_ACCESS_KEY=your-access-key-id
S3_SECRET_KEY=your-access-key-secret`}</code>
      </pre>

      <h2>Huawei Cloud Deployment</h2>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Huawei Cloud Service</th>
            <th>Configuration Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Database</td>
            <td>GaussDB for PostgreSQL</td>
            <td>
              Distributed PostgreSQL-compatible database. Use the primary/standby deployment mode
              for HA.
            </td>
          </tr>
          <tr>
            <td>Cache</td>
            <td>DCS (Distributed Cache Service)</td>
            <td>Redis-compatible cache service. Select Valkey or Redis 7.0 engine.</td>
          </tr>
          <tr>
            <td>Object Storage</td>
            <td>OBS (Object Storage Service)</td>
            <td>
              OBS provides an S3-compatible API. Set{' '}
              <code>S3_ENDPOINT=https://obs.region.myhuaweicloud.com</code>.
            </td>
          </tr>
          <tr>
            <td>Compute</td>
            <td>CCE (Cloud Container Engine)</td>
            <td>Managed Kubernetes. Deploy with the Helm chart. Supports Kunpeng (ARM64) nodes.</td>
          </tr>
        </tbody>
      </table>
      <pre>
        <code>{`# Huawei Cloud-specific environment variables
DB_HOST=gaussdb-xxx.gaussdb.myhuaweicloud.com
DB_SSL_MODE=require

VALKEY_HOST=dcs-xxx.dcs.myhuaweicloud.com
VALKEY_PASSWORD=your-dcs-password

S3_ENDPOINT=https://obs.cn-east-3.myhuaweicloud.com
S3_REGION=cn-east-3
S3_USE_PATH_STYLE=false
S3_ACCESS_KEY=your-ak
S3_SECRET_KEY=your-sk`}</code>
      </pre>

      <h2>Self-Hosted (Bare Metal / VMs)</h2>
      <p>
        For self-hosted deployments without any cloud provider, use the Docker Compose production
        stack with local infrastructure:
      </p>
      <ul>
        <li>
          <strong>Database:</strong> Install PostgreSQL 16 directly on the host or use the
          containerised version in the Compose file.
        </li>
        <li>
          <strong>Cache:</strong> The Compose file includes Valkey. For HA, run a Valkey Sentinel
          setup.
        </li>
        <li>
          <strong>Object Storage:</strong> MinIO is included in the Compose file and is
          production-ready for self-hosting. For HA, deploy MinIO in distributed mode across
          multiple drives/nodes.
        </li>
        <li>
          <strong>LiveKit:</strong> The Compose file includes LiveKit. For production, consult the{' '}
          <a href="https://docs.livekit.io/deploy/" target="_blank" rel="noopener noreferrer">
            LiveKit deployment docs
          </a>
          .
        </li>
        <li>
          <strong>TLS:</strong> Use Caddy (automatic Let's Encrypt) or Nginx with certbot.
        </li>
      </ul>

      <h2>Terraform Modules</h2>
      <p>
        The <code>infra/terraform/</code> directory contains reusable Terraform modules for
        provisioning cloud infrastructure:
      </p>
      <table>
        <thead>
          <tr>
            <th>Module</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>modules/database</code>
            </td>
            <td>
              Provisions a managed PostgreSQL instance with security groups, parameter groups, and
              automated backups.
            </td>
          </tr>
          <tr>
            <td>
              <code>modules/cache</code>
            </td>
            <td>
              Provisions a managed Redis/Valkey cluster with appropriate node types and subnet
              groups.
            </td>
          </tr>
          <tr>
            <td>
              <code>modules/storage</code>
            </td>
            <td>Creates S3 buckets with CORS rules, lifecycle policies, and access credentials.</td>
          </tr>
          <tr>
            <td>
              <code>modules/kubernetes</code>
            </td>
            <td>
              Provisions a managed Kubernetes cluster with node pools, networking, and IAM/RBAC
              configuration.
            </td>
          </tr>
          <tr>
            <td>
              <code>modules/networking</code>
            </td>
            <td>Creates VPC, subnets, security groups, and NAT gateways.</td>
          </tr>
        </tbody>
      </table>
      <pre>
        <code>{`# Example: AWS deployment
cd infra/terraform/aws
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your settings

terraform init
terraform plan
terraform apply`}</code>
      </pre>
      <p>
        Each cloud provider has its own root configuration under{' '}
        <code>infra/terraform/{'{provider}'}/</code> that composes the shared modules with
        provider-specific resources.
      </p>

      <h2>Provider Feature Matrix</h2>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>AWS</th>
            <th>Tencent</th>
            <th>Alibaba</th>
            <th>Huawei</th>
            <th>Self-Hosted</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Managed PostgreSQL</td>
            <td>RDS</td>
            <td>TencentDB</td>
            <td>ApsaraDB</td>
            <td>GaussDB</td>
            <td>Manual</td>
          </tr>
          <tr>
            <td>Managed Redis/Valkey</td>
            <td>ElastiCache</td>
            <td>TencentDB Redis</td>
            <td>ApsaraDB Redis</td>
            <td>DCS</td>
            <td>Manual</td>
          </tr>
          <tr>
            <td>S3-Compatible Storage</td>
            <td>S3</td>
            <td>COS</td>
            <td>OSS</td>
            <td>OBS</td>
            <td>MinIO</td>
          </tr>
          <tr>
            <td>Managed Kubernetes</td>
            <td>EKS</td>
            <td>TKE</td>
            <td>ACK</td>
            <td>CCE</td>
            <td>K3s/kubeadm</td>
          </tr>
          <tr>
            <td>ARM64 Support</td>
            <td>Graviton</td>
            <td>Yes</td>
            <td>Yitian</td>
            <td>Kunpeng</td>
            <td>Varies</td>
          </tr>
          <tr>
            <td>Terraform Module</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>Yes</td>
            <td>N/A</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
