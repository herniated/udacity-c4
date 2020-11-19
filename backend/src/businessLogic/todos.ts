import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('http')

const todoAccess = new TodoAccess()

const imagesBucket = process.env.IMAGES_S3_BUCKET

export async function getTodosByUser(userId: string): Promise<TodoItem[]> {

    logger.info("Logic: get todos for user: " + userId)
    return todoAccess.getTodosByUser(userId)

}

export async function createTodo(createTodo: CreateTodoRequest, userId: string): Promise<TodoItem> {

    logger.info("Logic: creating todo: " + createTodo + " for user " + userId)

    const itemId = uuid.v4()
    const createdAt = new Date().toISOString()
    const attachmentUrl = 'https://'+imagesBucket+'.s3.amazonaws.com/' + itemId
    logger.info("Logic: prepare attachment URL " + attachmentUrl)

    const newTodoItem: TodoItem = {
        todoId: itemId,
        userId, 
        createdAt,
        done: false,
        attachmentUrl,
        ...createTodo
      }

    return todoAccess.createTodo(newTodoItem)

}

export async function deleteTodo(todoId: string): Promise<void> {

    logger.info("Logic: delete todo id: " + todoId)
    return todoAccess.deleteTodo(todoId)

}

export async function updateTodo(todoId: string, updateTodoRequest: UpdateTodoRequest): Promise<void> {

    logger.info("Logic: updating todo: " + todoId + " with update " + updateTodoRequest)

    const updateTodo: TodoUpdate = {
        ...updateTodoRequest
      }

    return todoAccess.updateTodo(todoId, updateTodo)

}