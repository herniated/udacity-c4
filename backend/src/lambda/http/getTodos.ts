import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'

const AWS = require('aws-sdk')

const logger = createLogger('http')

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userId = getUserId(event)

  logger.info("get items for user " + userId)

  const result = await docClient.query({
    TableName: todosTable,
    IndexName: 'userIndex',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()
 
  const items = result.Items

  logger.info("items retrieved")

  //const result = await docClient.scan({TableName: todosTable}).promise()
  //const items = result.Items

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*' // Required for CORS support to work
    },
    body: JSON.stringify({
      items: items
    }, null, 2),
  };

}
