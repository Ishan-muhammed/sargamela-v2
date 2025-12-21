'use client'

import React, { useEffect, useState } from 'react'
import type { UIFieldClientComponent } from 'payload'
import { useDocumentInfo } from '@payloadcms/ui'
import './styles.scss'

export const TotalPointsField: UIFieldClientComponent = () => {
  const { id } = useDocumentInfo()
  const [points, setPoints] = useState<{
    total: number
    first: number
    second: number
    third: number
    loading: boolean
    error: string | null
  }>({
    total: 0,
    first: 0,
    second: 0,
    third: 0,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!id) {
      setPoints({ total: 0, first: 0, second: 0, third: 0, loading: false, error: null })
      return
    }

    const fetchPoints = async () => {
      try {
        const response = await fetch(`/api/participants/${id}/points`)

        if (!response.ok) {
          throw new Error('Failed to fetch points')
        }

        const data = await response.json()
        setPoints({
          total: data.total || 0,
          first: data.first || 0,
          second: data.second || 0,
          third: data.third || 0,
          loading: false,
          error: null,
        })
      } catch (error) {
        console.error('Error fetching points:', error)
        setPoints({
          total: 0,
          first: 0,
          second: 0,
          third: 0,
          loading: false,
          error: 'Failed to load points',
        })
      }
    }

    fetchPoints()
  }, [id])

  if (points.loading) {
    return (
      <div className="total-points-field">
        <div className="total-points-field__loading">
          <div className="total-points-field__spinner" />
          <span>Calculating points...</span>
        </div>
      </div>
    )
  }

  if (points.error) {
    return (
      <div className="total-points-field">
        <div className="total-points-field__error">
          <span>⚠️ {points.error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="total-points-field">
      <div className="total-points-field__header">
        <h3>Competition Points</h3>
        <p className="total-points-field__description">Points earned from competition placements</p>
      </div>

      <div className="total-points-field__grid">
        <div className="total-points-field__stat total-points-field__stat--first">
          <div className="total-points-field__stat-icon">🥇</div>
          <div className="total-points-field__stat-content">
            <div className="total-points-field__stat-label">1st Place</div>
            <div className="total-points-field__stat-value">{points.first}</div>
          </div>
        </div>

        <div className="total-points-field__stat total-points-field__stat--second">
          <div className="total-points-field__stat-icon">🥈</div>
          <div className="total-points-field__stat-content">
            <div className="total-points-field__stat-label">2nd Place</div>
            <div className="total-points-field__stat-value">{points.second}</div>
          </div>
        </div>

        <div className="total-points-field__stat total-points-field__stat--third">
          <div className="total-points-field__stat-icon">🥉</div>
          <div className="total-points-field__stat-content">
            <div className="total-points-field__stat-label">3rd Place</div>
            <div className="total-points-field__stat-value">{points.third}</div>
          </div>
        </div>
      </div>

      <div className="total-points-field__total">
        <div className="total-points-field__total-label">Total Points</div>
        <div className="total-points-field__total-value">{points.total}</div>
      </div>
    </div>
  )
}
