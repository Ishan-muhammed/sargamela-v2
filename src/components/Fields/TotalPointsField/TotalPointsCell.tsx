'use client'

import React, { useEffect, useState } from 'react'
import './cell-styles.scss'

interface TotalPointsCellProps {
  cellData?: string | number
  rowData?: {
    id: string
  }
}

export const TotalPointsCell: React.FC<TotalPointsCellProps> = ({ rowData }) => {
  const [totalPoints, setTotalPoints] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!rowData?.id) {
      setLoading(false)
      return
    }

    const fetchPoints = async () => {
      try {
        const response = await fetch(`/api/participants/${rowData.id}/points`)

        if (!response.ok) {
          throw new Error('Failed to fetch points')
        }

        const data = await response.json()
        setTotalPoints(data.total || 0)
      } catch (error) {
        console.error('Error fetching points:', error)
        setTotalPoints(0)
      } finally {
        setLoading(false)
      }
    }

    fetchPoints()
  }, [rowData?.id])

  if (loading) {
    return (
      <div className="total-points-cell">
        <div className="total-points-cell__spinner" />
      </div>
    )
  }

  return (
    <div className="total-points-cell">
      <span className="total-points-cell__value">{totalPoints ?? 0}</span>
      <span className="total-points-cell__label">pts</span>
    </div>
  )
}
