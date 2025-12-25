import React from 'react'
import type { UIFieldServerComponent } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'
import { calculateParticipantPoints } from '@/utilities/calculatePoints'
import './styles.scss'

/**
 * Server Component - Calculates participant points using Payload Local API
 * Shows comprehensive breakdown including positions AND grades
 */
export const TotalPointsField: UIFieldServerComponent = async (props) => {
  const { data } = props
  const participantId = data?.id

  // If no participant ID, show empty state
  if (!participantId) {
    return (
      <div className="total-points-field">
        <div className="total-points-field__header">
          <h3>Competition Points</h3>
          <p className="total-points-field__description">
            Points will be calculated after saving this participant
          </p>
        </div>
      </div>
    )
  }

  // Get Payload instance and calculate points server-side
  const payload = await getPayload({ config })
  const breakdown = await calculateParticipantPoints(payload, participantId)

  return (
    <div className="total-points-field">
      <div className="total-points-field__header">
        <h3>Competition Points</h3>
        <p className="total-points-field__description">
          Complete breakdown of points from positions and grades
        </p>
      </div>

      {/* Position-based Points */}
      <div className="total-points-field__section">
        <h4 className="total-points-field__section-title">Position Points</h4>
        <div className="total-points-field__grid">
          <div className="total-points-field__stat total-points-field__stat--first">
            <div className="total-points-field__stat-icon">🥇</div>
            <div className="total-points-field__stat-content">
              <div className="total-points-field__stat-label">1st Place</div>
              <div className="total-points-field__stat-value">
                {breakdown.positions.first.count}
              </div>
              <div className="total-points-field__stat-points">
                {breakdown.positions.first.points.total} pts
              </div>
            </div>
          </div>

          <div className="total-points-field__stat total-points-field__stat--second">
            <div className="total-points-field__stat-icon">🥈</div>
            <div className="total-points-field__stat-content">
              <div className="total-points-field__stat-label">2nd Place</div>
              <div className="total-points-field__stat-value">
                {breakdown.positions.second.count}
              </div>
              <div className="total-points-field__stat-points">
                {breakdown.positions.second.points.total} pts
              </div>
            </div>
          </div>

          <div className="total-points-field__stat total-points-field__stat--third">
            <div className="total-points-field__stat-icon">🥉</div>
            <div className="total-points-field__stat-content">
              <div className="total-points-field__stat-label">3rd Place</div>
              <div className="total-points-field__stat-value">
                {breakdown.positions.third.count}
              </div>
              <div className="total-points-field__stat-points">
                {breakdown.positions.third.points.total} pts
              </div>
            </div>
          </div>
        </div>
        <div className="total-points-field__subtotal">
          <span>Position Subtotal:</span>
          <strong>{breakdown.positions.totalPositionPoints} pts</strong>
        </div>
      </div>

      {/* Grade-based Points */}
      {breakdown.grades.breakdown.length > 0 && (
        <div className="total-points-field__section">
          <h4 className="total-points-field__section-title">Grade Points</h4>
          <div className="total-points-field__grades">
            {breakdown.grades.breakdown.map((grade) => (
              <React.Fragment key={grade.grade}>
                {/* Group grades */}
                {grade.byType.group > 0 && (
                  <div className="total-points-field__grade">
                    <span className="total-points-field__grade-type">Group</span>
                    <span className="total-points-field__grade-separator">-</span>
                    <div className="total-points-field__grade-badge">Grade {grade.gradeLabel}</div>
                    <span className="total-points-field__grade-count">×{grade.byType.group}</span>
                    <span className="total-points-field__grade-points">
                      {grade.points.group} pts
                    </span>
                  </div>
                )}
                {/* Individual grades */}
                {grade.byType.individual > 0 && (
                  <div className="total-points-field__grade">
                    <span className="total-points-field__grade-type">Individual</span>
                    <span className="total-points-field__grade-separator">-</span>
                    <div className="total-points-field__grade-badge">Grade {grade.gradeLabel}</div>
                    <span className="total-points-field__grade-count">
                      ×{grade.byType.individual}
                    </span>
                    <span className="total-points-field__grade-points">
                      {grade.points.individual} pts
                    </span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="total-points-field__subtotal">
            <span>Grade Subtotal:</span>
            <strong>{breakdown.grades.totalGradePoints} pts</strong>
          </div>
        </div>
      )}

      {/* Total */}
      <div className="total-points-field__total">
        <div className="total-points-field__total-label">Total Points</div>
        <div className="total-points-field__total-value">{breakdown.totalPoints}</div>
      </div>

      {/* Summary */}
      <div className="total-points-field__summary">
        <div className="total-points-field__summary-item">
          <span>Competitions:</span>
          <strong>{breakdown.summary.totalCompetitions}</strong>
        </div>
        <div className="total-points-field__summary-item">
          <span>Positions:</span>
          <strong>{breakdown.summary.totalPositions}</strong>
        </div>
        <div className="total-points-field__summary-item">
          <span>Grades:</span>
          <strong>{breakdown.summary.totalGrades}</strong>
        </div>
      </div>
    </div>
  )
}
