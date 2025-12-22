/**
 * UI Component Types
 *
 * Types specific to UI components and views.
 */

import type { Participant, PivotTableData } from './common'

/**
 * View types for live page rotation
 */
export enum ViewType {
  INTRO = 'INTRO',
  SCOREBOARD = 'SCOREBOARD',
  TABLE = 'TABLE',
  FLASH_NEWS = 'FLASH_NEWS',
}

/**
 * App state (deprecated - kept for backward compatibility)
 */
export interface AppState {
  currentViewIndex: number
  participants: Participant[]
  flashNews: string | null
  tickerNews: string[]
  tables: PivotTableData[]
}

/**
 * Category data for organized display
 */
export interface CategoryData {
  title: string
  data: PivotTableData | null
}

/**
 * Ranked item wrapper (used by ranking utility)
 */
export interface RankedItem<T> {
  item: T
  rank: number
  displayRank: string
  isTied: boolean
}
