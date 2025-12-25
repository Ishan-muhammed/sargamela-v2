import { useQuery } from '@tanstack/react-query'
import type { FullDetailsResponse, ApiParticipantWithScore } from '@/types/api'
import type { Participant, PivotTableData, GeneralData } from '@/types/common'

// Query keys
export const festQueryKeys = {
  all: ['fest-live'] as const,
  fullDetails: () => [...festQueryKeys.all, 'details'] as const,
}

/**
 * Fetch full fest data from the API
 */
const fetchFestData = async (): Promise<FullDetailsResponse> => {
  const response = await fetch('/api/fest/detailed')
  if (!response.ok) {
    throw new Error(`Failed to fetch fest data: ${response.statusText}`)
  }
  return response.json()
}

/**
 * Hook to fetch all fest data with auto-refresh
 */
export const useFullFestData = (refetchInterval: number = 30 * 1000) => {
  return useQuery({
    queryKey: festQueryKeys.fullDetails(),
    queryFn: fetchFestData,
    staleTime: refetchInterval,
    refetchInterval: refetchInterval,
    refetchOnWindowFocus: true,
    retry: 3,
  })
}

/**
 * Transform participant data to Participant format
 */
export const transformToParticipants = (
  participants: ApiParticipantWithScore[] | undefined,
): Participant[] => {
  if (!participants) return []
  return participants.map((p) => ({
    id: String(p.id),
    name: p.name,
    score: p.score,
  }))
}

/**
 * Transform detailed scoreboard to pivot tables
 */
export const transformToPivotTables = (data: PivotTableData[] | undefined): PivotTableData[] => {
  if (!data) return []
  return data.map((item) => ({
    title: item.title,
    headers: item.headers,
    rows: item.rows.map((row) => ({
      category: row.category,
      values: row.values,
      total: row.total,
    })),
  }))
}

/**
 * Transform settings to GeneralData format
 */
export const transformToGeneralData = (settings: any | undefined): GeneralData => {
  if (!settings) {
    return {
      flashNews: '',
      scrollNews: [],
      programStatus: 'Completed',
      adImageUrl: '',
      introSlide: {
        topLabel: 'ഫറോക്ക് മണ്ഡലം',
        titleLine1: 'മദ്രസ',
        titleLine2: 'സർഗ്ഗമേള',
        titleLine3: '2025',
        bottomText: 'Live Updates',
      },
      participantLabel: 'മദ്രസ',
    }
  }

  // Transform festStatus to programStatus format
  const statusMap: Record<string, 'Live' | 'Upcoming' | 'Completed'> = {
    live: 'Live',
    upcoming: 'Upcoming',
    completed: 'Completed',
  }

  // Extract flash news - handle both old richText format and new plain text
  let flashNews = ''
  if (settings.flashNews) {
    if (typeof settings.flashNews === 'string') {
      // New format: plain text
      flashNews = settings.flashNews
    } else if (typeof settings.flashNews === 'object' && settings.flashNews.root) {
      // Old format: Lexical richText - extract text
      const extractText = (node: any): string => {
        if (!node) return ''
        if (node.text) return node.text
        if (Array.isArray(node.children)) {
          return node.children.map(extractText).join(' ')
        }
        return ''
      }
      flashNews = extractText(settings.flashNews.root).trim()
    }
  }

  // Extract scroll news from settings.tickerNews
  const scrollNews =
    Array.isArray(settings.tickerNews) && settings.tickerNews.length > 0
      ? settings.tickerNews.map((item: any) => item.text || '').filter(Boolean)
      : []

  // Extract ad image URL - handle both string and media object
  let adImageUrl = ''
  if (settings.adImageUrl) {
    if (typeof settings.adImageUrl === 'string') {
      adImageUrl = settings.adImageUrl
    } else if (typeof settings.adImageUrl === 'object' && settings.adImageUrl.url) {
      adImageUrl = settings.adImageUrl.url
    }
  }

  // Extract intro slide data
  const introSlide = settings.introSlide
    ? {
        topLabel: settings.introSlide.topLabel || 'ഫറോക്ക് മണ്ഡലം',
        titleLine1: settings.introSlide.titleLine1 || 'മദ്രസ',
        titleLine2: settings.introSlide.titleLine2 || 'സർഗ്ഗമേള',
        titleLine3: settings.introSlide.titleLine3 || '2025',
        bottomText: settings.introSlide.bottomText || 'Live Updates',
      }
    : {
        topLabel: 'ഫറോക്ക് മണ്ഡലം',
        titleLine1: 'മദ്രസ',
        titleLine2: 'സർഗ്ഗമേള',
        titleLine3: '2025',
        bottomText: 'Live Updates',
      }

  // Extract participant label (Malayalam singular)
  const participantLabel = settings.participantLabel?.singular?.ml || 'മദ്രസ'

  return {
    flashNews: flashNews,
    scrollNews: scrollNews,
    programStatus: statusMap[settings.festStatus] || 'Completed',
    adImageUrl: adImageUrl,
    introSlide,
    participantLabel,
  }
}

/**
 * Hook to get participants with scores
 */
export const useScoreboardParticipants = (refetchInterval?: number) => {
  const { data, isLoading, error } = useFullFestData(refetchInterval)

  return {
    participants: transformToParticipants(data?.participants),
    isLoading,
    error,
  }
}

/**
 * Hook to get general data (flash news, scroll news, status, ad)
 */
export const useGeneralData = (refetchInterval?: number) => {
  const { data, isLoading, error } = useFullFestData(refetchInterval)

  return {
    data: transformToGeneralData(data?.settings),
    isLoading,
    error,
  }
}

/**
 * Hook to get all category pivot tables (dynamic)
 */
export const useAllCategoriesData = (refetchInterval?: number) => {
  const { data, isLoading, error } = useFullFestData(refetchInterval)

  const pivotTables = transformToPivotTables(data?.detailedScoreboardData)

  return {
    categories: pivotTables,
    isLoading,
    isError: !!error,
  }
}
