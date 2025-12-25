import { Participant } from '@/payload-types'
import { Endpoint, Payload } from 'payload'

type LeaderboardParticipant = Participant & {
  score: number
  breakdown: {
    first: number
    second: number
    third: number
    firstByType: { group: number; individual: number }
    secondByType: { group: number; individual: number }
    thirdByType: { group: number; individual: number }
  }
}

export interface PivotRow {
  category: string
  values: number[] // Columns data
  total: number
}

export interface PivotTableData {
  title: string
  headers: string[]
  rows: PivotRow[]
}

/**
 * Calculate scoreboard data with points based on Settings
 */
const getScoreboardData = async (payload: Payload) => {
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

  // Get grade system from settings (it's an array)
  const gradesConfig = (settings.gradeSystem || []).map((gradeItem: any) => ({
    key: gradeItem.key,
    label: gradeItem.grade,
    groupPoints: gradeItem.groupPoints || 0,
    individualPoints: gradeItem.individualPoints || 0,
  }))

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
    limit: 10000,
    depth: 0,
    where: {
      active: { equals: true },
    },
  })

  // Calculate points for each participant
  const scoreboardData: LeaderboardParticipant[] = participants.map((participant) => {
    const firstPlaceCount = { group: 0, individual: 0, total: 0 }
    const secondPlaceCount = { group: 0, individual: 0, total: 0 }
    const thirdPlaceCount = { group: 0, individual: 0, total: 0 }

    // Grade tracking - dynamically initialize based on gradesConfig
    const gradeTracking: Record<string, { group: number; individual: number }> = {}
    gradesConfig.forEach((gradeConfig) => {
      gradeTracking[gradeConfig.key] = { group: 0, individual: 0 }
    })

    let totalPositionPoints = 0
    let totalGradePoints = 0

    competitionItems.forEach((item) => {
      const results = item.results as any
      const itemType = item.type // 'group' or 'individual'
      const isGroup = itemType === 'group'

      // Position-based points
      if (results?.First == participant.id) {
        firstPlaceCount.total++
        if (isGroup) {
          firstPlaceCount.group++
          totalPositionPoints += firstPlacePoints.group
        } else {
          firstPlaceCount.individual++
          totalPositionPoints += firstPlacePoints.individual
        }
      }

      if (results?.Second == participant.id) {
        secondPlaceCount.total++
        if (isGroup) {
          secondPlaceCount.group++
          totalPositionPoints += secondPlacePoints.group
        } else {
          secondPlaceCount.individual++
          totalPositionPoints += secondPlacePoints.individual
        }
      }

      if (results?.Third == participant.id) {
        thirdPlaceCount.total++
        if (isGroup) {
          thirdPlaceCount.group++
          totalPositionPoints += thirdPlacePoints.group
        } else {
          thirdPlaceCount.individual++
          totalPositionPoints += thirdPlacePoints.individual
        }
      }

      // Grade-based points (grade field is at item level, not in results)
      const grades = (item as any).grade as any
      if (grades && Array.isArray(grades)) {
        grades.forEach((gradeEntry: any) => {
          if (gradeEntry.participant == participant.id) {
            const gradeKey = gradeEntry.grade
            if (gradeKey && gradeTracking[gradeKey] !== undefined) {
              if (isGroup) {
                gradeTracking[gradeKey].group++
              } else {
                gradeTracking[gradeKey].individual++
              }

              // Add points
              const gradeConfig = gradesConfig.find((g) => g.key === gradeKey)
              if (gradeConfig) {
                totalGradePoints += isGroup ? gradeConfig.groupPoints : gradeConfig.individualPoints
              }
            }
          }
        })
      }
    })

    // Build grade breakdown array
    const gradeBreakdown = gradesConfig
      .map((gradeConfig) => {
        const tracking = gradeTracking[gradeConfig.key]
        const count = tracking.group + tracking.individual

        if (count === 0) return null

        return {
          grade: gradeConfig.key,
          gradeLabel: gradeConfig.label,
          count,
          byType: {
            group: tracking.group,
            individual: tracking.individual,
          },
          points: {
            group: tracking.group * gradeConfig.groupPoints,
            individual: tracking.individual * gradeConfig.individualPoints,
            total:
              tracking.group * gradeConfig.groupPoints +
              tracking.individual * gradeConfig.individualPoints,
          },
        }
      })
      .filter(Boolean) as any[]

    const totalPoints = totalPositionPoints + totalGradePoints

    return {
      ...participant,
      score: totalPoints,
      breakdown: {
        first: firstPlaceCount.total,
        second: secondPlaceCount.total,
        third: thirdPlaceCount.total,
        firstByType: { group: firstPlaceCount.group, individual: firstPlaceCount.individual },
        secondByType: { group: secondPlaceCount.group, individual: secondPlaceCount.individual },
        thirdByType: { group: thirdPlaceCount.group, individual: thirdPlaceCount.individual },
        grades: gradeBreakdown,
        totalGradePoints,
      },
    }
  })

  // Sort by score (descending)
  scoreboardData.sort((a, b) => b.score - a.score)

  return {
    participants: scoreboardData,
    pointsSystem: {
      firstPlace: firstPlacePoints,
      secondPlace: secondPlacePoints,
      thirdPlace: thirdPlacePoints,
      grades: gradesConfig,
    },
    lastUpdated: new Date().toISOString(),
  }
}

const getDetailedScoreboardData = async (payload: Payload): Promise<PivotTableData[]> => {
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

  // Get grade system from settings (it's an array)
  const gradesConfig = (settings.gradeSystem || []).map((gradeItem: any) => ({
    key: gradeItem.key,
    label: gradeItem.grade,
    groupPoints: gradeItem.groupPoints || 0,
    individualPoints: gradeItem.individualPoints || 0,
  }))

  // Get all competition categories sorted by order
  const { docs: categories } = await payload.find({
    collection: 'competitionCategories',
    limit: 100,
    depth: 0,
    sort: 'order',
  })

  // Get all active competition items with category populated
  const { docs: competitionItems } = await payload.find({
    collection: 'competitionItems',
    limit: 10000,
    depth: 1, // Populate category to get category ID
    where: {
      active: { equals: true },
    },
    sort: 'order',
  })

  // Get all active participants
  const { docs: participants } = await payload.find({
    collection: 'participants',
    where: {
      active: { equals: true },
    },
    limit: 1000,
    depth: 0,
  })

  // Build pivot tables for each category
  const pivotTables: PivotTableData[] = categories.map((category) => {
    // Get all competition items for this category
    const categoryItems = competitionItems.filter((item) => {
      const categoryId = typeof item.category === 'object' ? item.category.id : item.category
      return categoryId == category.id // Use loose equality
    })

    // Build headers (competition item titles)
    const headers = categoryItems.map((item) => item.title)

    // Build rows for each participant
    const rows: PivotRow[] = participants.map((participant) => {
      const values: number[] = []
      let totalPoints = 0

      // For each competition item, calculate points for this participant
      categoryItems.forEach((item) => {
        const results = item.results as any
        const itemType = item.type
        let itemPoints = 0

        // Handle results that might be objects or IDs
        const firstId = typeof results?.First === 'object' ? results?.First?.id : results?.First
        const secondId = typeof results?.Second === 'object' ? results?.Second?.id : results?.Second
        const thirdId = typeof results?.Third === 'object' ? results?.Third?.id : results?.Third

        // Calculate position points
        if (firstId == participant.id) {
          itemPoints = itemType === 'group' ? firstPlacePoints.group : firstPlacePoints.individual
        } else if (secondId == participant.id) {
          itemPoints = itemType === 'group' ? secondPlacePoints.group : secondPlacePoints.individual
        } else if (thirdId == participant.id) {
          itemPoints = itemType === 'group' ? thirdPlacePoints.group : thirdPlacePoints.individual
        }

        // Calculate grade points
        const grades = (item as any).grade
        if (Array.isArray(grades)) {
          grades.forEach((gradeEntry: any) => {
            const gradeParticipantId =
              typeof gradeEntry.participant === 'object'
                ? gradeEntry.participant?.id
                : gradeEntry.participant

            if (gradeParticipantId == participant.id) {
              const gradeKey = gradeEntry.grade
              const gradeConfig = gradesConfig.find((g) => g.key === gradeKey)
              if (gradeConfig) {
                itemPoints +=
                  itemType === 'group' ? gradeConfig.groupPoints : gradeConfig.individualPoints
              }
            }
          })
        }

        values.push(itemPoints)
        totalPoints += itemPoints
      })

      return {
        category: participant.name,
        values,
        total: totalPoints,
      }
    })

    // Sort rows by total (descending)
    rows.sort((a, b) => b.total - a.total)

    return {
      title: category.name,
      headers,
      rows,
    }
  })

  return pivotTables
}

/**
 * Get full data with settings, participants, and competition items
 */
const getFullData = async (payload: Payload) => {
  const settings = await payload.findGlobal({
    slug: 'settings',
    depth: 2,
  })

  const { docs: competitionItems } = await payload.find({
    collection: 'competitionItems',
    limit: 10000,
    depth: 2,
    where: {
      active: { equals: true },
    },
  })

  // Get scoreboard data with calculated scores
  const scoreboardData = await getScoreboardData(payload)

  const detailedScoreboardData = await getDetailedScoreboardData(payload)

  return {
    settings,
    competitionItems,
    participants: scoreboardData.participants,
    pointsSystem: scoreboardData.pointsSystem,
    detailedScoreboardData,
  }
}

const endpoints: Endpoint[] = [
  {
    path: '/fest/detailed',
    method: 'get',
    handler: async (req) => {
      return Response.json(await getFullData(req.payload))
    },
  },
  {
    path: '/fest/scoreboard',
    method: 'get',
    handler: async (req) => {
      return Response.json(await getScoreboardData(req.payload))
    },
  },
  {
    path: '/fest/detailed-scoreboard',
    method: 'get',
    handler: async (req) => {
      return Response.json(await getDetailedScoreboardData(req.payload))
    },
  },
]

export default endpoints
