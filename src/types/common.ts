/**
 * Common Types
 *
 * Shared types used across frontend, live page, and components.
 * These represent the core domain models of the application.
 */

/**
 * Participant (Team/Organization)
 * Base participant information with optional breakdown
 */
export interface Participant {
  id: string
  name: string
  score: number
  breakdown?: ParticipantBreakdown
}

/**
 * Detailed breakdown of participant's performance
 */
export interface ParticipantBreakdown {
  // Position-based breakdown (legacy support)
  first: number
  second: number
  third: number
  firstByType: PlacementByType
  secondByType: PlacementByType
  thirdByType: PlacementByType

  // Grade-based breakdown
  grades?: GradeBreakdownEntry[]
  totalGradePoints?: number
}

/**
 * Placement counts by competition type
 */
export interface PlacementByType {
  group: number
  individual: number
}

/**
 * Grade breakdown entry
 */
export interface GradeBreakdownEntry {
  grade: string // Grade key (a, b, c)
  gradeLabel: string // Display label (Grade A, Grade B, etc.)
  count: number
  byType: PlacementByType
  points: {
    group: number
    individual: number
    total: number
  }
}

/**
 * Pivot table data structure for category-wise results
 */
export interface PivotTableData {
  title: string // Category name (Kids, Children, etc.)
  headers: string[] // Competition item names
  rows: PivotRow[]
}

/**
 * Row in a pivot table
 */
export interface PivotRow {
  category: string // Participant name
  values: number[] // Points per competition item
  total: number
}

/**
 * General data (settings, news, status)
 */
export interface GeneralData {
  flashNews: string
  scrollNews: string[]
  programStatus: ProgramStatus
  adImageUrl: string
  introSlide?: IntroSlideData
  participantLabel?: string
}

/**
 * Intro slide configuration
 */
export interface IntroSlideData {
  topLabel: string
  titleLine1: string
  titleLine2: string
  titleLine3: string
  bottomText: string
}

/**
 * Program status enum
 */
export type ProgramStatus = 'Live' | 'Upcoming' | 'Completed'

/**
 * Points system configuration
 */
export interface PointsSystem {
  firstPlace: PlacementPoints
  secondPlace: PlacementPoints
  thirdPlace: PlacementPoints
  grades?: GradePointsConfig[]
}

/**
 * Points awarded for a placement
 */
export interface PlacementPoints {
  group: number
  individual: number
}

/**
 * Grade points configuration
 */
export interface GradePointsConfig {
  key: string
  label: string
  groupPoints: number
  individualPoints: number
}
