import * as AWS from 'aws-sdk'

AWS.config.update({ region: 'sa-east-1' })

const BUCKET_NAME : string = process.env.BUCKET_NAME as string
const IAM_USER_KEY : string = process.env.USER_KEY as string
const IAM_USER_SECRET : string = process.env.USER_SECRET_KEY as string

const s3bucket = new AWS.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET
})

export function getLink () : string {
  return ''
}

export async function uploadToS3 (fileName: string, fileBody: any) {
  const params : AWS.S3.PutObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileBody
  }

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err: any, data: any) => {
      if (err) {
        return reject(err)
      }

      return resolve(data)
    })
  })
}

export async function listFromS3 (prefix: string) {
  const options: AWS.S3.ListObjectsRequest = {
    Bucket: BUCKET_NAME,
    Delimiter: '',
    Prefix: prefix
  }
  return s3bucket.listObjects(options).promise()
}

export async function headObjectS3 (fileName: string) {
  const options : AWS.S3.HeadObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: fileName
  }
  return s3bucket.headObject(options).promise()
}

export function getSignedUrl (fileName: string) {
  const options : AWS.S3.HeadObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: fileName
  }
  return s3bucket.getSignedUrl('getObject', options)
}

export async function uploadImageToS3 (fileName: string, fileBody: String) {
  const params : AWS.S3.PutObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileBody,
    ContentType: 'image/png'
  }

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err: Error, data: any) => {
      if (err) {
        return reject(err)
      }

      return resolve(data)
    })
  })
}

export async function downloadFromS3 (fileName: string) {
  const options : AWS.S3.GetObjectRequest = {
    Bucket: BUCKET_NAME,
    Key: fileName
  }
  return s3bucket.getObject(options).promise()
}

export function encode (data: any) {
  const buf = Buffer.from(data)
  const base64 = buf.toString('base64')
  return base64
}

export function decode (data: any) {
  const buff = Buffer.from(data, 'base64')
  return buff
}

interface Part {
  ETag: string
  PartNumber: number
}

export async function initiateMultipartUpload (fileName: string) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName
  }
  const res = await s3bucket.createMultipartUpload(params).promise()
  return res.UploadId
}

export async function abortMultipartUpload (fileName: string, uploadId: string) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    UploadId: uploadId
  }
  const res = await s3bucket.abortMultipartUpload(params).promise()
  return res
}

export async function generatePresignedUrlsParts (fileName: string, uploadId: string, parts: number) {
  const baseParams = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    UploadId: uploadId
  }

  const promises = []

  for (let index = 0; index < parts; index++) {
    promises.push(
      s3bucket.getSignedUrlPromise('uploadPart', {
        ...baseParams,
        PartNumber: index + 1
      }))
  }

  const res = await Promise.all(promises)

  const partsUrl = res.reduce((map, part, index) => {
    map[index] = part
    return map
  }, {} as Record<number, string>)

  const abortUrl = await s3bucket.getSignedUrlPromise('abortMultipartUpload', {
    ...baseParams
  })

  return {
    partsUrl,
    abortUrl
  }
}

export async function completeMultipartUpload (fileName: string, uploadId: string, parts: Part[]) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts }
  }

  await s3bucket.completeMultipartUpload(params).promise()
}