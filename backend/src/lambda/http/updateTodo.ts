import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import { createLogger } from '../../utils/logger'

const AWS = require('aws-sdk')

const logger = createLogger('http')

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const todoId = event.pathParameters.todoId
  logger.info(todoId)

  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)  
  logger.info(updatedTodo)
  
  await docClient.update({
    TableName: todosTable,
    Key: { todoId },
    UpdateExpression: "set #name=:todoName, dueDate=:dueDate, done=:done",
    ExpressionAttributeValues:{
        ":todoName":updatedTodo.name,
        ":dueDate":updatedTodo.dueDate,
        ":done":updatedTodo.done
    },
    ExpressionAttributeNames:{
      "#name": "name"
    }
  }).promise()

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body:""
  }
}
