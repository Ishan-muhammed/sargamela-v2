import 'dotenv/config'
import configPromise from '@payload-config'
import { getPayload, createLocalReq } from 'payload'
import { seed } from '@/endpoints/seed'

const seedScript = async () => {
  const payload = await getPayload({ config: configPromise })

  payload.logger.info('Seeding database...')

  try {
    const req = await createLocalReq({}, payload)
    req.context = {
      disableRevalidate: true,
    }
    await seed({ payload, req })
    payload.logger.info('Seeded successfully')
    process.exit(0)
  } catch (err) {
    payload.logger.error(err)
    process.exit(1)
  }
}

seedScript()
