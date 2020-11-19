import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)
import { createLogger } from '../utils/logger'

const logger = createLogger('http')

export class ImagesAccess {

    constructor(
        private readonly s3Client = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly imagesBucket = process.env.IMAGES_S3_BUCKET) {
    }

    async generatePresignedUrl(todoId: string): Promise<string> {

        logger.info('Access: Generating signed URL for todoId: ' + todoId + ' from bucket: ' + this.imagesBucket)

        const presignedUrl = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.imagesBucket,
            Key: todoId,
            Expires: '300'
          })

        logger.info("Access: created url " + presignedUrl)

        return presignedUrl;

    }
}