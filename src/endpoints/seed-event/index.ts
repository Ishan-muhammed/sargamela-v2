import { Payload, PayloadRequest } from 'payload'
import competitionCategories from './competition-categories'

export const seedEvent = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding event...')
  for (const competitionCategory of competitionCategories) {
    await payload.create({
      collection: 'competitionCategories',
      data: competitionCategory,
    })
  }
}
