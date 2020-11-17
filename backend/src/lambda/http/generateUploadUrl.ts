import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const AWS = require('aws-sdk')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const todoId = event.pathParameters.todoId

  const imagesBucket = process.env.IMAGES_S3_BUCKET

  const s3 = new AWS.S3({
    signatureVersion: 'v4' // Use Sigv4 algorithm
  })

  const presignedUrl = s3.getSignedUrl('putObject', {
    Bucket: imagesBucket,
    Key: todoId,
    Expires: '300'
  })

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: presignedUrl
    })
  }
}
