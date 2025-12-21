import { Payload, PayloadRequest } from 'payload'
import eventCategories from './event-categories'

export const seedEvent = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding event...')
  for (const eventCategory of eventCategories) {
    await payload.create({
      collection: 'eventCategories',
      data: eventCategory,
    })
  }
}
