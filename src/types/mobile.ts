// Types for mobile app data structures
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export interface Participant {
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

export interface MobileGeneralData {
  flashNews: DefaultTypedEditorState | null
  scrollNews: string[]
  programStatus: 'upcoming' | 'live' | 'completed'
  adImageUrl: string
}

export interface CategoryData {
  title: string
  data: PivotTableData | null
}

export interface ScoreboardParticipant {
  id: string
  name: string
  totalPoints: number
  firstPlaces: number
  secondPlaces: number
  thirdPlaces: number
}
