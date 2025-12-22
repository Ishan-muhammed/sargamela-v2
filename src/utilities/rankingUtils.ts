/**
 * Utility functions for calculating rankings with tie support
 */

export interface RankedItem<T> {
  item: T
  rank: number // Actual rank (1, 2, 3, etc.)
  displayRank: string // Display string like "1st", "T-2nd" (for ties)
  isTied: boolean // Whether this rank is shared with others
}

/**
 * Calculate rankings with tie support
 * Items with the same score get the same rank
 *
 * Example:
 * Scores: [100, 100, 90, 80, 80, 70]
 * Ranks:  [1, 1, 3, 4, 4, 6]
 * Display: ["T-1st", "T-1st", "3rd", "T-4th", "T-4th", "6th"]
 */
export function calculateRanks<T>(items: T[], getScore: (item: T) => number): RankedItem<T>[] {
  // Sort by score descending
  const sorted = [...items].sort((a, b) => getScore(b) - getScore(a))

  const rankedItems: RankedItem<T>[] = []
  let currentRank = 1

  for (let i = 0; i < sorted.length; i++) {
    const currentScore = getScore(sorted[i])

    // If not the first item, check if score is different from previous
    if (i > 0) {
      const prevScore = getScore(sorted[i - 1])
      if (currentScore < prevScore) {
        // Score changed, update rank to current position
        currentRank = i + 1
      }
    }

    // Check if this rank is tied (same score as next item)
    const isTied =
      (i > 0 && getScore(sorted[i - 1]) === currentScore) ||
      (i < sorted.length - 1 && getScore(sorted[i + 1]) === currentScore)

    rankedItems.push({
      item: sorted[i],
      rank: currentRank,
      displayRank: formatRank(currentRank, isTied),
      isTied,
    })
  }

  return rankedItems
}

/**
 * Format rank number to display string
 */
export function formatRank(rank: number, isTied: boolean = false): string {
  const suffix = getRankSuffix(rank)
  const prefix = isTied ? 'T-' : ''
  return `${prefix}${rank}${suffix}`
}

/**
 * Get ordinal suffix for rank number (st, nd, rd, th)
 */
export function getRankSuffix(rank: number): string {
  if (rank % 100 >= 11 && rank % 100 <= 13) {
    return 'th'
  }
  switch (rank % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

/**
 * Get position-based styling considering ties
 * Top 3 positions get special styling, even if tied
 */
export function getPositionStyleClass(
  rank: number,
  isTied: boolean,
): {
  isFirst: boolean
  isSecond: boolean
  isThird: boolean
  isTop3: boolean
} {
  return {
    isFirst: rank === 1,
    isSecond: rank === 2,
    isThird: rank === 3,
    isTop3: rank <= 3,
  }
}

/**
 * Get all items in a specific rank (for handling ties)
 */
export function getItemsInRank<T>(rankedItems: RankedItem<T>[], rank: number): RankedItem<T>[] {
  return rankedItems.filter((item) => item.rank === rank)
}

/**
 * Check if a rank has multiple items (is tied)
 */
export function isRankTied<T>(rankedItems: RankedItem<T>[], rank: number): boolean {
  return getItemsInRank(rankedItems, rank).length > 1
}
