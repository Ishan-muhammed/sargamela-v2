/**
 * API Response Types
 *
 * Types for API responses from Fest endpoints.
 * These represent the raw data structure from the backend.
 */

import type { ParticipantBreakdown, PivotTableData, PointsSystem } from './common'

/**
 * Base Participant from API (without score)
 */
export interface ApiParticipant {
  id: number | string
  name: string
  shortCode: string
  active: boolean
  updatedAt: string
  createdAt: string
}

/**
 * Participant with score and breakdown from API
 */
export interface ApiParticipantWithScore extends ApiParticipant {
  score: number
  breakdown: ParticipantBreakdown
}

/**
 * Scoreboard API response
 */
export interface ScoreboardResponse {
  participants: ApiParticipantWithScore[]
  pointsSystem: PointsSystem
  lastUpdated: string
}

/**
 * Detailed/Full API response
 */
export interface DetailedResponse {
  settings: any // From Payload Settings global
  competitionItems: any[] // Competition items with depth: 2
  participants: ApiParticipantWithScore[]
  pointsSystem: PointsSystem
  detailedScoreboardData: PivotTableData[]
}

/**
 * Alias for clarity
 */
export type FullDetailsResponse = DetailedResponse
