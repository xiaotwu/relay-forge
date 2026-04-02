export default function StoragePage() {
  return (
    <div>
      <h1>Object Storage</h1>
      <p>
        RelayForge stores all user-uploaded files (attachments, avatars, emoji) in S3-compatible
        object storage. The media service provides an abstraction layer that works with any
        S3-compatible backend, making it easy to switch between providers or run locally with MinIO.
      </p>

      <h2>S3-Compatible Abstraction</h2>
      <p>
        The media service uses the AWS SDK for Go v2 with a configurable endpoint. By changing the{' '}
        <code>S3_ENDPOINT</code> environment variable, you can point to any S3-compatible service
        without code changes. The SDK handles authentication, request signing (SigV4), multipart
        uploads, and presigned URL generation.
      </p>

      <h2>Supported Providers</h2>
      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Service</th>
            <th>Path Style</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>MinIO</td>
            <td>Self-hosted</td>
            <td>Yes</td>
            <td>Default for development. Production-ready in distributed mode.</td>
          </tr>
          <tr>
            <td>AWS</td>
            <td>Amazon S3</td>
            <td>No</td>
            <td>
              Set <code>S3_USE_PATH_STYLE=false</code>. Use IAM roles for authentication on ECS/EKS.
            </td>
          </tr>
          <tr>
            <td>Tencent Cloud</td>
            <td>COS</td>
            <td>No</td>
            <td>
              Endpoint: <code>https://cos.{'{region}'}.myqcloud.com</code>
            </td>
          </tr>
          <tr>
            <td>Alibaba Cloud</td>
            <td>OSS</td>
            <td>No</td>
            <td>
              Endpoint: <code>https://oss-{'{region}'}.aliyuncs.com</code>
            </td>
          </tr>
          <tr>
            <td>Huawei Cloud</td>
            <td>OBS</td>
            <td>No</td>
            <td>
              Endpoint: <code>https://obs.{'{region}'}.myhuaweicloud.com</code>
            </td>
          </tr>
          <tr>
            <td>Cloudflare</td>
            <td>R2</td>
            <td>Yes</td>
            <td>
              Endpoint: <code>https://{'{account_id}'}.r2.cloudflarestorage.com</code>
            </td>
          </tr>
          <tr>
            <td>Backblaze</td>
            <td>B2</td>
            <td>Yes</td>
            <td>
              Endpoint: <code>https://s3.{'{region}'}.backblazeb2.com</code>
            </td>
          </tr>
          <tr>
            <td>DigitalOcean</td>
            <td>Spaces</td>
            <td>No</td>
            <td>
              Endpoint: <code>https://{'{region}'}.digitaloceanspaces.com</code>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Bucket Structure</h2>
      <p>
        RelayForge uses three separate buckets for different content types. This allows independent
        access policies, lifecycle rules, and CDN configurations:
      </p>
      <table>
        <thead>
          <tr>
            <th>Bucket</th>
            <th>Variable</th>
            <th>Content</th>
            <th>Access Pattern</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>relay-uploads</code>
            </td>
            <td>
              <code>S3_BUCKET_UPLOADS</code>
            </td>
            <td>Message attachments: images, videos, audio, documents</td>
            <td>Authenticated download via presigned URLs. No public access.</td>
          </tr>
          <tr>
            <td>
              <code>relay-avatars</code>
            </td>
            <td>
              <code>S3_BUCKET_AVATARS</code>
            </td>
            <td>User profile pictures and guild icons/banners</td>
            <td>Public read access. Served through CDN for low latency.</td>
          </tr>
          <tr>
            <td>
              <code>relay-emoji</code>
            </td>
            <td>
              <code>S3_BUCKET_EMOJI</code>
            </td>
            <td>Custom guild emoji (PNG, GIF, APNG, WebP)</td>
            <td>Public read access. Served through CDN.</td>
          </tr>
        </tbody>
      </table>

      <h3>Object Key Format</h3>
      <p>Objects are stored with structured keys for easy management and to avoid collisions:</p>
      <pre>
        <code>{`# Uploads
relay-uploads/{guild_id}/{channel_id}/{message_id}/{filename}
relay-uploads/{guild_id}/{channel_id}/{message_id}/{filename}.thumb.webp

# Avatars
relay-avatars/users/{user_id}/{hash}.webp
relay-avatars/guilds/{guild_id}/icon/{hash}.webp
relay-avatars/guilds/{guild_id}/banner/{hash}.webp

# Emoji
relay-emoji/{guild_id}/{emoji_id}.{ext}`}</code>
      </pre>

      <h2>Upload Flow</h2>
      <p>
        Uploads use presigned URLs to allow clients to upload directly to the storage backend,
        avoiding funneling large files through the API service:
      </p>
      <ol>
        <li>
          <strong>Client requests an upload URL:</strong> <code>POST /api/media/upload-url</code>{' '}
          with the filename, MIME type, and file size.
        </li>
        <li>
          <strong>Server validates the request:</strong> Checks MIME type allowlist, file size
          limit, and user's upload quota.
        </li>
        <li>
          <strong>Server generates a presigned PUT URL:</strong> The URL allows the client to upload
          directly to S3 for a limited time (default: 1 hour).
        </li>
        <li>
          <strong>Server returns the presigned URL and the final object key.</strong>
        </li>
        <li>
          <strong>Client uploads the file:</strong> The client sends a PUT request directly to the
          presigned URL with the file content.
        </li>
        <li>
          <strong>Client confirms the upload:</strong> <code>POST /api/media/upload-complete</code>{' '}
          with the object key. The server verifies the object exists and records it in the database.
        </li>
        <li>
          <strong>Server processes the upload:</strong> For images, the media service generates
          thumbnails (WebP, 400px max dimension). For all files, it optionally runs antivirus
          scanning.
        </li>
      </ol>

      <h3>Download Flow</h3>
      <p>Downloading attachments also uses presigned URLs:</p>
      <ol>
        <li>
          The client requests a download URL from{' '}
          <code>GET /api/media/download-url/{'{attachment_id}'}</code>.
        </li>
        <li>
          The server checks the user has <code>VIEW_CHANNEL</code> permission on the channel
          containing the attachment.
        </li>
        <li>A presigned GET URL is generated with a configurable expiry (default: 1 hour).</li>
        <li>The client fetches the file directly from the storage backend.</li>
      </ol>
      <p>
        Avatar and emoji downloads do not require presigned URLs because their buckets are
        configured for public read access.
      </p>

      <h2>MIME Type Validation</h2>
      <p>The media service validates file types at multiple stages:</p>
      <ol>
        <li>
          <strong>Extension check:</strong> The filename extension is checked against the allowed
          MIME types list.
        </li>
        <li>
          <strong>Content-Type header:</strong> The MIME type declared in the upload request is
          validated.
        </li>
        <li>
          <strong>Magic bytes:</strong> After upload, the server reads the first 512 bytes of the
          file and uses <code>http.DetectContentType</code> (Go stdlib) to detect the actual MIME
          type. If it does not match the declared type, the upload is rejected.
        </li>
      </ol>
      <p>Default allowed MIME types:</p>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>MIME Types</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Images</td>
            <td>
              <code>image/png</code>, <code>image/jpeg</code>, <code>image/gif</code>,{' '}
              <code>image/webp</code>, <code>image/apng</code>
            </td>
          </tr>
          <tr>
            <td>Video</td>
            <td>
              <code>video/mp4</code>, <code>video/webm</code>
            </td>
          </tr>
          <tr>
            <td>Audio</td>
            <td>
              <code>audio/mpeg</code>, <code>audio/ogg</code>, <code>audio/webm</code>
            </td>
          </tr>
          <tr>
            <td>Documents</td>
            <td>
              <code>application/pdf</code>, <code>text/plain</code>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        This list is configurable via the <code>UPLOAD_ALLOWED_MIME_TYPES</code> environment
        variable. Add types as needed, but be cautious with executable formats.
      </p>

      <h2>Antivirus Integration (ClamAV)</h2>
      <p>
        When <code>ANTIVIRUS_ENABLED=true</code>, the media service scans every uploaded file with
        ClamAV before making it available for download:
      </p>
      <ol>
        <li>
          After the file is uploaded to S3, the media service downloads it to a temporary buffer.
        </li>
        <li>
          The buffer is sent to the ClamAV daemon via the <code>clamd</code> TCP protocol (
          <code>INSTREAM</code> command).
        </li>
        <li>
          ClamAV returns a scan result: either <code>OK</code> or the name of the detected threat.
        </li>
        <li>
          If a threat is detected, the file is deleted from S3 and the upload is marked as rejected.
          The user is notified.
        </li>
        <li>If the scan passes, the file is marked as available.</li>
      </ol>
      <p>
        ClamAV adds ~1-3 seconds of latency per upload, depending on file size. For high-volume
        deployments, run multiple ClamAV instances and load-balance across them.
      </p>

      <h3>Running ClamAV</h3>
      <pre>
        <code>{`# Add to your docker-compose.prod.yml
clamav:
  image: clamav/clamav:1.3
  ports:
    - "3310:3310"
  volumes:
    - clamav-data:/var/lib/clamav
  restart: unless-stopped

# Then enable in .env
ANTIVIRUS_ENABLED=true
ANTIVIRUS_HOST=clamav
ANTIVIRUS_PORT=3310`}</code>
      </pre>
      <p>
        ClamAV needs ~1 GB of RAM for its virus signature database. The first startup takes several
        minutes while it downloads the latest signatures.
      </p>

      <h2>File Size Limits</h2>
      <table>
        <thead>
          <tr>
            <th>Setting</th>
            <th>Default</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Maximum file size</td>
            <td>50 MB</td>
            <td>
              Configurable via <code>UPLOAD_MAX_FILE_SIZE</code> (in bytes). Affects all file types.
            </td>
          </tr>
          <tr>
            <td>Maximum avatar size</td>
            <td>8 MB</td>
            <td>Hardcoded. Avatars are resized server-side to 256x256 WebP.</td>
          </tr>
          <tr>
            <td>Maximum emoji size</td>
            <td>256 KB</td>
            <td>Hardcoded. Emoji must be square, max 128x128 pixels.</td>
          </tr>
          <tr>
            <td>Chunk size</td>
            <td>5 MB</td>
            <td>
              For multipart uploads. Configurable via <code>UPLOAD_CHUNK_SIZE</code>.
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Ensure your reverse proxy's <code>client_max_body_size</code> (Nginx) or equivalent matches
        or exceeds <code>UPLOAD_MAX_FILE_SIZE</code>, otherwise the proxy will reject large uploads
        before they reach the media service.
      </p>

      <h2>Image Processing</h2>
      <p>The media service performs server-side image processing for thumbnails and avatars:</p>
      <ul>
        <li>
          <strong>Thumbnails:</strong> Generated for all image attachments. Resized to fit within
          400x400 pixels while maintaining aspect ratio. Output format is WebP for smaller file
          size.
        </li>
        <li>
          <strong>Avatars:</strong> Resized to 256x256 pixels, center-cropped, and converted to
          WebP.
        </li>
        <li>
          <strong>Emoji:</strong> Validated for dimensions (max 128x128) but not resized. Original
          format is preserved to support animated GIF and APNG.
        </li>
        <li>
          <strong>EXIF stripping:</strong> EXIF metadata (including GPS coordinates) is stripped
          from all uploaded images for privacy.
        </li>
      </ul>

      <h2>CDN Integration</h2>
      <p>
        For production deployments, place a CDN (CloudFront, Cloudflare, etc.) in front of the
        avatar and emoji buckets. Configure the CDN to:
      </p>
      <ul>
        <li>
          Cache objects with long TTLs (avatars and emoji are immutable; a new hash is generated on
          change).
        </li>
        <li>
          Set <code>Cache-Control: public, max-age=31536000, immutable</code> on cached objects.
        </li>
        <li>Compress responses with gzip or Brotli.</li>
        <li>
          Use the CDN's URL as the <code>avatarUrl</code> base in the API response.
        </li>
      </ul>
    </div>
  );
}
