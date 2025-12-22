'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to show countdown until next refetch, synced with actual query data updates
 * @param refetchInterval - Interval in milliseconds
 * @param dataUpdatedAt - Timestamp of last data update from React Query
 * @param isEnabled - Whether the countdown is active
 * @returns seconds remaining until next refetch
 */
export function useRefetchCountdown(
  refetchInterval: number,
  dataUpdatedAt?: number,
  isEnabled: boolean = true,
) {
  const [secondsRemaining, setSecondsRemaining] = useState(Math.floor(refetchInterval / 1000))

  useEffect(() => {
    if (!isEnabled) return

    const updateCountdown = () => {
      if (!dataUpdatedAt) {
        setSecondsRemaining(Math.floor(refetchInterval / 1000))
        return
      }

      const now = Date.now()
      const timeSinceLastUpdate = now - dataUpdatedAt
      const timeUntilNextUpdate = refetchInterval - timeSinceLastUpdate

      if (timeUntilNextUpdate <= 0) {
        setSecondsRemaining(0)
      } else {
        setSecondsRemaining(Math.ceil(timeUntilNextUpdate / 1000))
      }
    }

    // Initial update
    updateCountdown()

    // Update every second
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [refetchInterval, dataUpdatedAt, isEnabled])

  return secondsRemaining
}
