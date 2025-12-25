import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getParticipantTotalPoints } from '@/utilities/calculatePoints'
import './cell-styles.scss'

interface TotalPointsCellProps {
  cellData?: string | number
  rowData?: {
    id: string
  }
}

/**
 * Server Component - Calculates participant points using Payload Local API
 * This is much more efficient than client-side fetching
 */
export const TotalPointsCell: React.FC<TotalPointsCellProps> = async ({ rowData }) => {
  // If no participant ID, show 0
  if (!rowData?.id) {
    return (
      <div className="total-points-cell">
        <span className="total-points-cell__value">0</span>
        <span className="total-points-cell__label">pts</span>
      </div>
    )
  }

  // Get Payload instance
  const payload = await getPayload({ config })

  // Calculate points server-side
  const totalPoints = await getParticipantTotalPoints(payload, rowData.id)

  return (
    <div className="total-points-cell">
      <span className="total-points-cell__value">{totalPoints}</span>
      <span className="total-points-cell__label">pts</span>
    </div>
  )
}
