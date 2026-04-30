import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID!
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!
export const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'kalvex-uploads'

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})

export async function uploadToR2(fileBuffer: Buffer, fileName: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  })

  await r2.send(command)
  return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${fileName}`
}

export async function getSignedDownloadUrl(fileName: string, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  })

  return await getSignedUrl(r2, command, { expiresIn })
}
