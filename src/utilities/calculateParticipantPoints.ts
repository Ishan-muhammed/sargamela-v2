import { Payload } from 'payload'

/**
 * Calculate total points for a participant using Payload Local API
 * This is a server-side utility function
 */
export async function calculateParticipantPoints(
  payload: Payload,
  participantId: string | number,
): Promise<number> {
  try {
    // Convert to number for comparison (if it's a numeric ID)
    const participantIdNum =
      typeof participantId === 'string' ? parseInt(participantId, 10) : participantId

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

    // Calculate points
    let totalPoints = 0

    competitionItems.forEach((item) => {
      const results = item.results as any
      const itemType = item.type // 'group' or 'individual'

      const firstId = results?.First
      const secondId = results?.Second
      const thirdId = results?.Third

      if (firstId && (firstId == participantId || firstId == participantIdNum)) {
        totalPoints += itemType === 'group' ? firstPlacePoints.group : firstPlacePoints.individual
      }

      if (secondId && (secondId == participantId || secondId == participantIdNum)) {
        totalPoints += itemType === 'group' ? secondPlacePoints.group : secondPlacePoints.individual
      }

      if (thirdId && (thirdId == participantId || thirdId == participantIdNum)) {
        totalPoints += itemType === 'group' ? thirdPlacePoints.group : thirdPlacePoints.individual
      }
    })

    return totalPoints
  } catch (error) {
    console.error('Error calculating participant points:', error)
    return 0
  }
}
