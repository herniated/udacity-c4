import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'

const logger = createLogger('http')

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE) {
    }

    async getTodosByUser(userId): Promise<TodoItem[]> {

        logger.info('Access: Getting todos for user: ' + userId + ' from table: ' + this.todosTable)

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: 'userIndex',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
              ':userId': userId
            }
          }).promise()
         
          const items = result.Items
          return items as TodoItem[]
    }

    async createTodo(newTodoItem: TodoItem): Promise<TodoItem> {

        logger.info("Access: creating new item: " + newTodoItem + ' in table: ' + this.todosTable)

        await this.docClient.put({
            TableName: this.todosTable,
            Item: newTodoItem
          }).promise()

        logger.info("Access: item created")

        return newTodoItem
    }

    async deleteTodo(todoId: string): Promise<void> {

        logger.info("Access: deleting todo: " + todoId + " from " + this.todosTable)

        await this.docClient.delete({
            TableName: this.todosTable,
            Key: { todoId }
          }).promise()

        logger.info("item deleted")
    }

    async updateTodo(todoId: string, updatedTodo: TodoUpdate): Promise<void> {

        logger.info("Access: update todoId: " + todoId + " with update: " + updatedTodo + ' in table: ' + this.todosTable)

        await this.docClient.update({
            TableName: this.todosTable,
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
        
        logger.info("item updated")
    }
}