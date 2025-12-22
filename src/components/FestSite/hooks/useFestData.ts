'use client'

import { useQuery } from '@tanstack/react-query'
import { festService } from '../services/festService'
import type { ScoreboardResponse, DetailedResponse, PivotTableData } from '../types'

// Query keys for cache management
export const festQueryKeys = {
  all: ['fest'] as const,
  scoreboard: () => [...festQueryKeys.all, 'scoreboard'] as const,
  detailedScoreboard: () => [...festQueryKeys.all, 'detailed-scoreboard'] as const,
  fullDetails: () => [...festQueryKeys.all, 'full-details'] as const,
}

/**
 * Hook to fetch scoreboard data
 * - Auto-refetches every 30 seconds
 * - Cached for 30 seconds (stale after)
 */
export function useScoreboard() {
  return useQuery<ScoreboardResponse>({
    queryKey: festQueryKeys.scoreboard(),
    queryFn: festService.getScoreboard,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
    retry: 3,
  })
}

/**
 * Hook to fetch detailed scoreboard (pivot tables by category)
 * - Auto-refetches every 30 seconds
 * - Cached for 30 seconds (stale after)
 */
export function useDetailedScoreboard() {
  return useQuery<PivotTableData[]>({
    queryKey: festQueryKeys.detailedScoreboard(),
    queryFn: festService.getDetailedScoreboard,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
    retry: 3,
  })
}

/**
 * Hook to fetch full detailed data
 * - Auto-refetches every 30 seconds
 * - Cached for 30 seconds (stale after)
 * - Includes settings, competition items, participants, and detailed scoreboard
 */
export function useFullDetails() {
  return useQuery<DetailedResponse>({
    queryKey: festQueryKeys.fullDetails(),
    queryFn: festService.getFullDetails,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
    retry: 3,
  })
}
