import { useQuery } from '@tanstack/react-query'
import { gSheetService } from '../services/g-sheet'
import { PivotTableData, Madrasa, GeneralData } from '../types'

// Query keys
export const sheetQueryKeys = {
  all: ['sheets'] as const,
  kids: () => [...sheetQueryKeys.all, 'kids'] as const,
  children: () => [...sheetQueryKeys.all, 'children'] as const,
  subJuniors: () => [...sheetQueryKeys.all, 'subJuniors'] as const,
  juniors: () => [...sheetQueryKeys.all, 'juniors'] as const,
  seniors: () => [...sheetQueryKeys.all, 'seniors'] as const,
  scoreboard: () => [...sheetQueryKeys.all, 'scoreboard'] as const,
  general: () => [...sheetQueryKeys.all, 'general'] as const,
}

// Hook for fetching Kids data
export const useKidsData = () => {
  return useQuery<PivotTableData>({
    queryKey: sheetQueryKeys.kids(),
    queryFn: () => gSheetService.getKidsData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

// Hook for fetching Children data
export const useChildrenData = () => {
  return useQuery<PivotTableData>({
    queryKey: sheetQueryKeys.children(),
    queryFn: () => gSheetService.getChildrenData(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
  })
}

// Hook for fetching Sub Juniors data
export const useSubJuniorsData = () => {
  return useQuery<PivotTableData>({
    queryKey: sheetQueryKeys.subJuniors(),
    queryFn: () => gSheetService.getSubJuniorsData(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
  })
}

// Hook for fetching Juniors data
export const useJuniorsData = () => {
  return useQuery<PivotTableData>({
    queryKey: sheetQueryKeys.juniors(),
    queryFn: () => gSheetService.getJuniorsData(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
  })
}

// Hook for fetching Seniors data
export const useSeniorsData = () => {
  return useQuery<PivotTableData>({
    queryKey: sheetQueryKeys.seniors(),
    queryFn: () => gSheetService.getSeniorsData(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
  })
}

// Hook for fetching Scoreboard data
export const useScoreboardData = () => {
  return useQuery<PivotTableData>({
    queryKey: sheetQueryKeys.scoreboard(),
    queryFn: () => gSheetService.getScoreboardData(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000,
  })
}

// Hook for fetching General data (Flash News and Scroll News)
// Refetches every 60 seconds minimum (or when Flash News completes)
export const useGeneralData = (refetchInterval?: number) => {
  return useQuery<GeneralData>({
    queryKey: sheetQueryKeys.general(),
    queryFn: () => gSheetService.getGeneralData(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: refetchInterval || 60 * 1000, // Default 60 seconds
  })
}

// Hook for fetching all category data at once
export const useAllCategoriesData = () => {
  const kidsQuery = useKidsData()
  const childrenQuery = useChildrenData()
  const subJuniorsQuery = useSubJuniorsData()
  const juniorsQuery = useJuniorsData()
  const seniorsQuery = useSeniorsData()

  return {
    kids: kidsQuery,
    children: childrenQuery,
    subJuniors: subJuniorsQuery,
    juniors: juniorsQuery,
    seniors: seniorsQuery,
    isLoading:
      kidsQuery.isLoading ||
      childrenQuery.isLoading ||
      subJuniorsQuery.isLoading ||
      juniorsQuery.isLoading ||
      seniorsQuery.isLoading,
    isError:
      kidsQuery.isError ||
      childrenQuery.isError ||
      subJuniorsQuery.isError ||
      juniorsQuery.isError ||
      seniorsQuery.isError,
  }
}

// Hook to get scoreboard as Madrasa array
export const useScoreboardMadrasas = () => {
  const scoreboardQuery = useScoreboardData()

  const madrasas: Madrasa[] | undefined = scoreboardQuery.data?.rows.map((row, index) => ({
    id: `m${index + 1}`,
    name: row.category.toUpperCase(),
    score: row.total,
  }))

  return {
    madrasas: madrasas || [],
    isLoading: scoreboardQuery.isLoading,
    isError: scoreboardQuery.isError,
    error: scoreboardQuery.error,
  }
}

