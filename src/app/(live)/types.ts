export interface Madrasa {
  id: string
  name: string
  score: number
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

export enum ViewType {
  INTRO = 'INTRO',
  SCOREBOARD = 'SCOREBOARD',
  TABLE = 'TABLE',
  FLASH_NEWS = 'FLASH_NEWS',
}

export interface GeneralData {
  flashNews: string
  scrollNews: string[]
  programStatus: 'Live' | 'Upcoming' | 'Completed'
  adImageUrl: string
}

export interface AppState {
  currentViewIndex: number
  madrasas: Madrasa[]
  flashNews: string | null // Dedicated page content
  tickerNews: string[] // Bottom scrolling text
  tables: PivotTableData[]
}
