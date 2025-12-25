import { Payload } from 'payload'
import type { CompetitionItem } from '@/payload-types'

/**
 * Points breakdown by position
 */
export interface PositionBreakdown {
  count: number
  byType: {
    group: number
    individual: number
  }
  points: {
    group: number
    individual: number
    total: number
  }
}

/**
 * Grade breakdown
 */
export interface GradeBreakdown {
  grade: string // Grade key (a, b, c)
  gradeLabel: string // Display label (A, B, C)
  count: number
  byType: {
    group: number
    individual: number
  }
  points: {
    group: number
    individual: number
    total: number
  }
}

/**
 * Complete points breakdown for a participant
 */
export interface ParticipantPointsBreakdown {
  participantId: string | number
  totalPoints: number

  // Position-based points
  positions: {
    first: PositionBreakdown
    second: PositionBreakdown
    third: PositionBreakdown
    totalPositionPoints: number
  }

  // Grade-based points
  grades: {
    breakdown: GradeBreakdown[]
    totalGradePoints: number
  }

  // Summary counts
  summary: {
    totalCompetitions: number
    totalPositions: number
    totalGrades: number
  }

  // Point system used for calculation
  pointSystem: {
    positions: {
      first: { group: number; individual: number }
      second: { group: number; individual: number }
      third: { group: number; individual: number }
    }
    grades: Array<{
      key: string
      grade: string
      groupPoints: number
      individualPoints: number
    }>
  }
}

/**
 * Calculate comprehensive points breakdown for a participant
 * Includes both position-based and grade-based points
 */
export async function calculateParticipantPoints(
  payload: Payload,
  participantId: string | number,
): Promise<ParticipantPointsBreakdown> {
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

    // Get grade system
    const gradeSystem = settings.gradeSystem || []

    // Find all competition items where this participant placed OR received a grade
    const { docs: competitionItems } = await payload.find({
      collection: 'competitionItems',
      where: {
        or: [
          { 'results.First': { equals: participantId } },
          { 'results.Second': { equals: participantId } },
          { 'results.Third': { equals: participantId } },
          { 'grade.participant': { equals: participantId } },
        ],
      },
      depth: 0,
      limit: 10000,
    })

    // Initialize counters for positions
    const firstPlace: PositionBreakdown = {
      count: 0,
      byType: { group: 0, individual: 0 },
      points: { group: 0, individual: 0, total: 0 },
    }
    const secondPlace: PositionBreakdown = {
      count: 0,
      byType: { group: 0, individual: 0 },
      points: { group: 0, individual: 0, total: 0 },
    }
    const thirdPlace: PositionBreakdown = {
      count: 0,
      byType: { group: 0, individual: 0 },
      points: { group: 0, individual: 0, total: 0 },
    }

    // Initialize grade tracking
    const gradeMap = new Map<string, GradeBreakdown>()

    let totalPositionPoints = 0
    let totalGradePoints = 0

    // Process each competition item
    competitionItems.forEach((item) => {
      const results = item.results as any
      const itemType = item.type as 'group' | 'individual'

      const firstId = results?.First
      const secondId = results?.Second
      const thirdId = results?.Third

      // Check positions
      if (firstId && (firstId == participantId || firstId == participantIdNum)) {
        firstPlace.count++
        firstPlace.byType[itemType]++

        const points = firstPlacePoints[itemType]
        firstPlace.points[itemType] += points
        firstPlace.points.total += points
        totalPositionPoints += points
      } else if (secondId && (secondId == participantId || secondId == participantIdNum)) {
        secondPlace.count++
        secondPlace.byType[itemType]++

        const points = secondPlacePoints[itemType]
        secondPlace.points[itemType] += points
        secondPlace.points.total += points
        totalPositionPoints += points
      } else if (thirdId && (thirdId == participantId || thirdId == participantIdNum)) {
        thirdPlace.count++
        thirdPlace.byType[itemType]++

        const points = thirdPlacePoints[itemType]
        thirdPlace.points[itemType] += points
        thirdPlace.points.total += points
        totalPositionPoints += points
      }

      // Check grades
      const grades = (item as any).grade
      if (Array.isArray(grades)) {
        grades.forEach((gradeEntry: any) => {
          const gradeParticipantId = gradeEntry.participant
          const gradeKey = gradeEntry.grade

          if (
            gradeKey &&
            gradeParticipantId &&
            (gradeParticipantId == participantId || gradeParticipantId == participantIdNum)
          ) {
            // Find the grade config
            const gradeConfig = gradeSystem.find((g: any) => g.key === gradeKey)
            if (gradeConfig) {
              // Get or create grade breakdown
              if (!gradeMap.has(gradeKey)) {
                gradeMap.set(gradeKey, {
                  grade: gradeKey,
                  gradeLabel: gradeConfig.grade,
                  count: 0,
                  byType: { group: 0, individual: 0 },
                  points: { group: 0, individual: 0, total: 0 },
                })
              }

              const gradeBreakdown = gradeMap.get(gradeKey)!
              gradeBreakdown.count++
              gradeBreakdown.byType[itemType]++

              const points =
                itemType === 'group' ? gradeConfig.groupPoints : gradeConfig.individualPoints
              gradeBreakdown.points[itemType] += points
              gradeBreakdown.points.total += points
              totalGradePoints += points
            }
          }
        })
      }
    })

    // Convert grade map to array and sort by grade
    const gradeBreakdowns = Array.from(gradeMap.values()).sort((a, b) =>
      a.grade.localeCompare(b.grade),
    )

    return {
      participantId,
      totalPoints: totalPositionPoints + totalGradePoints,
      positions: {
        first: firstPlace,
        second: secondPlace,
        third: thirdPlace,
        totalPositionPoints,
      },
      grades: {
        breakdown: gradeBreakdowns,
        totalGradePoints,
      },
      summary: {
        totalCompetitions: competitionItems.length,
        totalPositions: firstPlace.count + secondPlace.count + thirdPlace.count,
        totalGrades: gradeBreakdowns.reduce((sum, g) => sum + g.count, 0),
      },
      pointSystem: {
        positions: {
          first: firstPlacePoints,
          second: secondPlacePoints,
          third: thirdPlacePoints,
        },
        grades: gradeSystem.map((g: any) => ({
          key: g.key,
          grade: g.grade,
          groupPoints: g.groupPoints,
          individualPoints: g.individualPoints,
        })),
      },
    }
  } catch (error) {
    console.error('Error calculating participant points:', error)
    // Return empty breakdown on error
    return {
      participantId,
      totalPoints: 0,
      positions: {
        first: {
          count: 0,
          byType: { group: 0, individual: 0 },
          points: { group: 0, individual: 0, total: 0 },
        },
        second: {
          count: 0,
          byType: { group: 0, individual: 0 },
          points: { group: 0, individual: 0, total: 0 },
        },
        third: {
          count: 0,
          byType: { group: 0, individual: 0 },
          points: { group: 0, individual: 0, total: 0 },
        },
        totalPositionPoints: 0,
      },
      grades: {
        breakdown: [],
        totalGradePoints: 0,
      },
      summary: {
        totalCompetitions: 0,
        totalPositions: 0,
        totalGrades: 0,
      },
      pointSystem: {
        positions: {
          first: { group: 10, individual: 5 },
          second: { group: 5, individual: 2 },
          third: { group: 1, individual: 1 },
        },
        grades: [],
      },
    }
  }
}

/**
 * Simple helper to get just the total points
 */
export async function getParticipantTotalPoints(
  payload: Payload,
  participantId: string | number,
): Promise<number> {
  const breakdown = await calculateParticipantPoints(payload, participantId)
  return breakdown.totalPoints
}
