import { ImagesAccess } from '../dataLayer/imagesAccess'
import { createLogger } from '../utils/logger'

const logger = createLogger('http')

const imagesAccess = new ImagesAccess()

export async function generatePresignedUrl(todoId: string): Promise<string> {

    logger.info("Logic: generate signed URL for todo: " + todoId)
    return imagesAccess.generatePresignedUrl(todoId)

}