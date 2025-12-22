import type {
  ScoreboardResponse,
  DetailedResponse,
  FullDetailsResponse,
  PivotTableData,
} from '../types'

const API_BASE = '/api/fest'

/**
 * Fest API Service
 * Handles all API calls to the fest endpoints
 */
export const festService = {
  /**
   * Get scoreboard data with participant scores and breakdown
   * Endpoint: GET /api/fest/scoreboard
   */
  async getScoreboard(): Promise<ScoreboardResponse> {
    const response = await fetch(`${API_BASE}/scoreboard`)
    if (!response.ok) {
      throw new Error(`Failed to fetch scoreboard: ${response.statusText}`)
    }
    return response.json()
  },

  /**
   * Get detailed pivot table data grouped by categories
   * Endpoint: GET /api/fest/detailed-scoreboard
   */
  async getDetailedScoreboard(): Promise<PivotTableData[]> {
    const response = await fetch(`${API_BASE}/detailed-scoreboard`)
    if (!response.ok) {
      throw new Error(`Failed to fetch detailed scoreboard: ${response.statusText}`)
    }
    return response.json()
  },

  /**
   * Get full detailed data including settings, items, and scoreboard
   * Endpoint: GET /api/fest/detailed
   *
   * Returns:
   * - settings: Global settings from Payload
   * - competitionItems: All competition items with depth: 2
   * - participants: Participants with calculated scores
   * - pointsSystem: Points configuration
   * - detailedScoreboardData: Pivot table data grouped by categories
   */
  async getFullDetails(): Promise<FullDetailsResponse> {
    const response = await fetch(`${API_BASE}/detailed`)
    if (!response.ok) {
      throw new Error(`Failed to fetch full details: ${response.statusText}`)
    }
    return response.json()
  },
}
