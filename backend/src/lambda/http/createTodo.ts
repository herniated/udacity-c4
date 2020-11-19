import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
//import { loggers } from 'winston'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const AWS = require('aws-sdk')
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const uuid = require('uuid')

const logger = createLogger('http')

const docClient = new XAWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

const imagesBucket = process.env.IMAGES_S3_BUCKET

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  logger.info("requesting to create" + newTodo)

  const itemId = uuid.v4()

  const userId = getUserId(event)

  const createdAt = new Date().toISOString()

  const attachmentUrl = 'https://'+imagesBucket+'.s3.amazonaws.com/' + itemId

  logger.info("attachment URL " + attachmentUrl)

  const newItem = {
    todoId: itemId,
    userId, 
    createdAt,
    done: false,
    attachmentUrl,
    ...newTodo
  }

  logger.info("attempting to create" + newItem)

  await docClient.put({
    TableName: todosTable,
    Item: newItem
  }).promise()

  logger.info("item created")

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
