import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * GET /api/participants/:id/points
 *
 * Calculates total points for a participant based on competition placements.
 * Points are configured in Settings > Scoring Settings.
 *
 * Returns:
 * - total: Total points earned
 * - first: Number of 1st place wins
 * - second: Number of 2nd place wins
 * - third: Number of 3rd place wins
 * - breakdown: Detailed breakdown by item type
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await getPayload({ config })
    const participantId = params.id

    // Convert to number for comparison (if it's a numeric ID)
    const participantIdNum = parseInt(participantId, 10)

    // Get settings for point system
    const settings = await payload.findGlobal({
      slug: 'settings',
      depth: 0,
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

    // Find all competition items where this participant placed
    const { docs: competitionItems } = await payload.find({
      collection: 'competitionItems',
      where: {
        or: [
          { 'results.First': { equals: participantId } },
          { 'results.Second': { equals: participantId } },
          { 'results.Third': { equals: participantId } },
        ],
      },
      depth: 0,
    })

    // Calculate points by position and type
    let firstPlaceCount = { group: 0, individual: 0, total: 0 }
    let secondPlaceCount = { group: 0, individual: 0, total: 0 }
    let thirdPlaceCount = { group: 0, individual: 0, total: 0 }
    let totalPoints = 0

    competitionItems.forEach((item) => {
      const results = item.results as any
      const itemType = item.type // 'group' or 'individual'

      // Compare both as strings and numbers to handle different formats
      const firstId = results?.First
      const secondId = results?.Second
      const thirdId = results?.Third

      if (firstId && (firstId == participantId || firstId == participantIdNum)) {
        firstPlaceCount.total++
        if (itemType === 'group') {
          firstPlaceCount.group++
          totalPoints += firstPlacePoints.group
        } else {
          firstPlaceCount.individual++
          totalPoints += firstPlacePoints.individual
        }
      }

      if (secondId && (secondId == participantId || secondId == participantIdNum)) {
        secondPlaceCount.total++
        if (itemType === 'group') {
          secondPlaceCount.group++
          totalPoints += secondPlacePoints.group
        } else {
          secondPlaceCount.individual++
          totalPoints += secondPlacePoints.individual
        }
      }

      if (thirdId && (thirdId == participantId || thirdId == participantIdNum)) {
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

    return NextResponse.json({
      total: totalPoints,
      first: firstPlaceCount.total,
      second: secondPlaceCount.total,
      third: thirdPlaceCount.total,
      breakdown: {
        firstPlace: {
          group: firstPlaceCount.group,
          individual: firstPlaceCount.individual,
          points:
            firstPlaceCount.group * firstPlacePoints.group +
            firstPlaceCount.individual * firstPlacePoints.individual,
        },
        secondPlace: {
          group: secondPlaceCount.group,
          individual: secondPlaceCount.individual,
          points:
            secondPlaceCount.group * secondPlacePoints.group +
            secondPlaceCount.individual * secondPlacePoints.individual,
        },
        thirdPlace: {
          group: thirdPlaceCount.group,
          individual: thirdPlaceCount.individual,
          points:
            thirdPlaceCount.group * thirdPlacePoints.group +
            thirdPlaceCount.individual * thirdPlacePoints.individual,
        },
      },
      pointsSystem: {
        firstPlace: firstPlacePoints,
        secondPlace: secondPlacePoints,
        thirdPlace: thirdPlacePoints,
      },
    })
  } catch (error) {
    console.error('Error calculating participant points:', error)
    return NextResponse.json({ error: 'Failed to calculate points' }, { status: 500 })
  }
}
