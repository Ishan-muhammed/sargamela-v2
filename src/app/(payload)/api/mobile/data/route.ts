import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { PivotTableData, CategoryData } from '@/types/mobile'

/**
 * GET /api/mobile/data
 *
 * Returns aggregated data for mobile app:
 * - Scoreboard with all participants
 * - Category-wise pivot tables
 * - General settings (flash news, scroll news, program status)
 */
export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Get settings
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
      depth: 1,
    })

    // Calculate points for each participant
    const participantPoints = new Map<
      string,
      {
        totalPoints: number
        firstPlaces: number
        secondPlaces: number
        thirdPlaces: number
      }
    >()

    participants.forEach((p) => {
      participantPoints.set(p.id, {
        totalPoints: 0,
        firstPlaces: 0,
        secondPlaces: 0,
        thirdPlaces: 0,
      })
    })

    // Process competition items
    competitionItems.forEach((item) => {
      const isGroupItem = item.type === 'group'
      const firstPoints = isGroupItem ? firstPlacePoints.group : firstPlacePoints.individual
      const secondPoints = isGroupItem ? secondPlacePoints.group : secondPlacePoints.individual
      const thirdPoints = isGroupItem ? thirdPlacePoints.group : thirdPlacePoints.individual

      if (item.results && Array.isArray(item.results)) {
        item.results.forEach((result: any) => {
          const participantId =
            typeof result.participant === 'string' ? result.participant : result.participant?.id

          if (participantId && participantPoints.has(participantId)) {
            const stats = participantPoints.get(participantId)!

            if (result.position === 'first') {
              stats.totalPoints += firstPoints
              stats.firstPlaces += 1
            } else if (result.position === 'second') {
              stats.totalPoints += secondPoints
              stats.secondPlaces += 1
            } else if (result.position === 'third') {
              stats.totalPoints += thirdPoints
              stats.thirdPlaces += 1
            }
          }
        })
      }
    })

    // Build scoreboard
    const scoreboard = participants
      .map((p) => {
        const stats = participantPoints.get(p.id)!
        return {
          id: p.id,
          name: p.name,
          totalPoints: stats.totalPoints,
          firstPlaces: stats.firstPlaces,
          secondPlaces: stats.secondPlaces,
          thirdPlaces: stats.thirdPlaces,
        }
      })
      .sort((a, b) => b.totalPoints - a.totalPoints)

    // Build category-wise pivot tables
    const categories = ['kids', 'children', 'subJuniors', 'juniors', 'seniors']
    const categoryLabels: Record<string, string> = {
      kids: 'Kids',
      children: 'Children',
      subJuniors: 'Sub Juniors',
      juniors: 'Juniors',
      seniors: 'Seniors',
    }

    const categoryData: CategoryData[] = []

    for (const category of categories) {
      // Get competition items for this category
      const categoryItems = competitionItems.filter((item) => item.category === category)

      if (categoryItems.length === 0) {
        categoryData.push({
          title: categoryLabels[category],
          data: null,
        })
        continue
      }

      // Build pivot table
      const rows = participants.map((participant) => {
        const values = categoryItems.map((item) => {
          if (!item.results || !Array.isArray(item.results)) return 0

          const result = item.results.find((r: any) => {
            const participantId =
              typeof r.participant === 'string' ? r.participant : r.participant?.id
            return participantId === participant.id
          })

          if (!result) return 0

          const isGroupItem = item.type === 'group'
          const firstPoints = isGroupItem ? firstPlacePoints.group : firstPlacePoints.individual
          const secondPoints = isGroupItem ? secondPlacePoints.group : secondPlacePoints.individual
          const thirdPoints = isGroupItem ? thirdPlacePoints.group : thirdPlacePoints.individual

          if (result.position === 'first') return firstPoints
          if (result.position === 'second') return secondPoints
          if (result.position === 'third') return thirdPoints
          return 0
        })

        const total = values.reduce((sum, val) => sum + val, 0)

        return {
          category: participant.name,
          values,
          total,
        }
      })

      const pivotTable: PivotTableData = {
        title: categoryLabels[category],
        headers: categoryItems.map((item) => item.title || 'Untitled'),
        rows,
      }

      categoryData.push({
        title: categoryLabels[category],
        data: pivotTable,
      })
    }

    // Get scroll news from posts
    const { docs: posts } = await payload.find({
      collection: 'posts',
      where: {
        _status: { equals: 'published' },
      },
      sort: '-publishedAt',
      limit: 10,
      depth: 0,
    })

    const scrollNews = posts.map((post) => post.title || 'Untitled')

    // Build response
    const response = {
      scoreboard,
      categories: categoryData,
      general: {
        flashNews: settings.flashNews || null,
        scrollNews,
        programStatus: settings.programStatus || 'Completed',
        adImageUrl:
          typeof settings.adImage === 'object' && settings.adImage?.url
            ? settings.adImage.url
            : '',
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching mobile data:', error)
    return NextResponse.json({ error: 'Failed to fetch mobile data' }, { status: 500 })
  }
}

