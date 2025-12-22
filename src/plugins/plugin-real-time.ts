import { CompetitionItem } from '@/payload-types'
import { payloadRealTime } from '@alejotoro-o/payload-real-time'

const realTime = payloadRealTime({
  collections: {
    competitionItems: {
      room: (doc: CompetitionItem) => {
        return `competitionItems`
      },
      events: ['create', 'update'],
    },
  },
  requireAuth: false,
})

export default realTime
