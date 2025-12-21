import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * GET /api/live
 *
 * Returns all data needed for the live scoreboard display:
 * - Scoreboard with participant rankings
 * - Flash news
 * - Ticker news
 * - Event status
 * - Other display settings
 */
export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Get settings
    const settings = await payload.findGlobal({
      slug: 'settings',
      depth: 1,
    })

    // Get point values from settings (with defaults)
    const pointsSystem = settings.pointsSystem || {}
    const firstPlacePoints = {
      group: pointsSystem.firstPlace?.groupItem || 10,
      individual: pointsSystem.firstPlace?.individualItem || 5,
    }
    const secondPlacePoints = {
      group: pointsSystem.secondPlace?.groupItem || 5,
      individual: pointsSystem.secondPlace?.individualItem || 2,
    }
    const thirdPlacePoints = {
      group: pointsSystem.thirdPlace?.groupItem || 1,
      individual: pointsSystem.thirdPlace?.individualItem || 1,
    }

    // Get all active participants
    const { docs: participants } = await payload.find({
      collection: 'participants',
      where: {
        active: { equals: true },
      },
      limit: 1000,
      depth: 0,
    })

    // Get all competition items with results
    const { docs: competitionItems } = await payload.find({
      collection: 'competitionItems',
      where: {
        active: { equals: true },
      },
      limit: 10000,
      depth: 0,
    })

    // Calculate points for each participant
    const scoreboardData = participants.map((participant) => {
      let firstPlaceCount = { group: 0, individual: 0, total: 0 }
      let secondPlaceCount = { group: 0, individual: 0, total: 0 }
      let thirdPlaceCount = { group: 0, individual: 0, total: 0 }
      let totalPoints = 0

      competitionItems.forEach((item) => {
        const results = item.results as any
        const itemType = item.type // 'group' or 'individual'

        if (results?.First == participant.id) {
          firstPlaceCount.total++
          if (itemType === 'group') {
            firstPlaceCount.group++
            totalPoints += firstPlacePoints.group
          } else {
            firstPlaceCount.individual++
            totalPoints += firstPlacePoints.individual
          }
        }

        if (results?.Second == participant.id) {
          secondPlaceCount.total++
          if (itemType === 'group') {
            secondPlaceCount.group++
            totalPoints += secondPlacePoints.group
          } else {
            secondPlaceCount.individual++
            totalPoints += secondPlacePoints.individual
          }
        }

        if (results?.Third == participant.id) {
          thirdPlaceCount.total++
          if (itemType === 'group') {
            thirdPlaceCount.group++
            totalPoints += thirdPlacePoints.group
          } else {
            thirdPlaceCount.individual++
            totalPoints += thirdPlacePoints.individual
          }
        }
      })

      return {
        id: participant.id,
        name: participant.name,
        shortCode: participant.shortCode,
        score: totalPoints,
        breakdown: {
          first: firstPlaceCount.total,
          second: secondPlaceCount.total,
          third: thirdPlaceCount.total,
        },
      }
    })

    // Sort by score (descending)
    scoreboardData.sort((a, b) => b.score - a.score)

    // Extract ticker news
    const tickerNews = settings.tickerNews?.map((item: any) => item.text).filter(Boolean) || []

    return NextResponse.json({
      scoreboard: scoreboardData,
      flashNews: settings.flashNews || null,
      tickerNews,
      eventStatus: settings.eventStatus || 'upcoming',
      eventName: settings.eventName || 'Madrasa Arts Fest',
      autoRotateEnabled: settings.autoRotateEnabled !== false,
      rotationInterval: settings.rotationInterval || 10,
      pointsSystem: {
        firstPlace: firstPlacePoints,
        secondPlace: secondPlacePoints,
        thirdPlace: thirdPlacePoints,
      },
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching live data:', error)
    return NextResponse.json({ error: 'Failed to fetch live data' }, { status: 500 })
  }
}
