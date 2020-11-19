import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('http')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const todoId = event.pathParameters.todoId
  logger.info("requesting update of todoId: " + todoId)

  const updatedTodoRequest: UpdateTodoRequest = JSON.parse(event.body)  
  logger.info("requestiong update with " + updatedTodoRequest)

  await updateTodo(todoId, updatedTodoRequest)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body:""
  }
}
