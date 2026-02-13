import 'dotenv/config'
import configPromise from '@payload-config'
import { getPayload, createLocalReq } from 'payload'
import { seedEvent } from '@/endpoints/seed-event'

const seedEventScript = async () => {
  const payload = await getPayload({ config: configPromise })

  payload.logger.info('Seeding event data...')

  try {
    const req = await createLocalReq({}, payload)
    // No pages involved, so revalidation shouldn't be an issue, but safe to pass req
    await seedEvent({ payload, req })
    payload.logger.info('Event seeded successfully')
    process.exit(0)
  } catch (err) {
    payload.logger.error(err)
    process.exit(1)
  }
}

seedEventScript()
