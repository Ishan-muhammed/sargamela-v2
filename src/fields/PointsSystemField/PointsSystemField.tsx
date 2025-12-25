'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import type { GroupFieldClientComponent } from 'payload'
import './styles.scss'

export const PointsSystemField: GroupFieldClientComponent = (props) => {
  const { path } = props

  // Get field values using useField hook
  const { value: firstGroupValue, setValue: setFirstGroupValue } = useField<number>({
    path: `${path}.firstPlace.groupItem`,
  })
  const { value: firstIndividualValue, setValue: setFirstIndividualValue } = useField<number>({
    path: `${path}.firstPlace.individualItem`,
  })

  const { value: secondGroupValue, setValue: setSecondGroupValue } = useField<number>({
    path: `${path}.secondPlace.groupItem`,
  })
  const { value: secondIndividualValue, setValue: setSecondIndividualValue } = useField<number>({
    path: `${path}.secondPlace.individualItem`,
  })

  const { value: thirdGroupValue, setValue: setThirdGroupValue } = useField<number>({
    path: `${path}.thirdPlace.groupItem`,
  })
  const { value: thirdIndividualValue, setValue: setThirdIndividualValue } = useField<number>({
    path: `${path}.thirdPlace.individualItem`,
  })

  return (
    <div className="points-system-field">
      <div className="points-system-field__header">
        <h3>Points System</h3>
        <p className="points-system-field__description">
          Configure points awarded for each position type
        </p>
      </div>

      <div className="points-system-field__table">
        <div className="points-system-field__table-header">
          <div className="points-system-field__cell points-system-field__cell--position">
            Position
          </div>
          <div className="points-system-field__cell points-system-field__cell--type">
            <span className="points-system-field__icon">👥</span>
            Group Item
          </div>
          <div className="points-system-field__cell points-system-field__cell--type">
            <span className="points-system-field__icon">👤</span>
            Individual Item
          </div>
        </div>

        <div className="points-system-field__table-body">
          {/* First Place */}
          <div className="points-system-field__row points-system-field__row--first">
            <div className="points-system-field__cell points-system-field__cell--position">
              <span className="points-system-field__medal">🥇</span>
              <span className="points-system-field__label">1st Place</span>
            </div>
            <div className="points-system-field__cell points-system-field__cell--input">
              <input
                type="number"
                value={firstGroupValue ?? 10}
                onChange={(e) => setFirstGroupValue(parseInt(e.target.value, 10) || 0)}
                className="points-system-field__input"
                min="0"
              />
              <span className="points-system-field__unit">pts</span>
            </div>
            <div className="points-system-field__cell points-system-field__cell--input">
              <input
                type="number"
                value={firstIndividualValue ?? 5}
                onChange={(e) => setFirstIndividualValue(parseInt(e.target.value, 10) || 0)}
                className="points-system-field__input"
                min="0"
              />
              <span className="points-system-field__unit">pts</span>
            </div>
          </div>

          {/* Second Place */}
          <div className="points-system-field__row points-system-field__row--second">
            <div className="points-system-field__cell points-system-field__cell--position">
              <span className="points-system-field__medal">🥈</span>
              <span className="points-system-field__label">2nd Place</span>
            </div>
            <div className="points-system-field__cell points-system-field__cell--input">
              <input
                type="number"
                value={secondGroupValue ?? 5}
                onChange={(e) => setSecondGroupValue(parseInt(e.target.value, 10) || 0)}
                className="points-system-field__input"
                min="0"
              />
              <span className="points-system-field__unit">pts</span>
            </div>
            <div className="points-system-field__cell points-system-field__cell--input">
              <input
                type="number"
                value={secondIndividualValue ?? 2}
                onChange={(e) => setSecondIndividualValue(parseInt(e.target.value, 10) || 0)}
                className="points-system-field__input"
                min="0"
              />
              <span className="points-system-field__unit">pts</span>
            </div>
          </div>

          {/* Third Place */}
          <div className="points-system-field__row points-system-field__row--third">
            <div className="points-system-field__cell points-system-field__cell--position">
              <span className="points-system-field__medal">🥉</span>
              <span className="points-system-field__label">3rd Place</span>
            </div>
            <div className="points-system-field__cell points-system-field__cell--input">
              <input
                type="number"
                value={thirdGroupValue ?? 1}
                onChange={(e) => setThirdGroupValue(parseInt(e.target.value, 10) || 0)}
                className="points-system-field__input"
                min="0"
              />
              <span className="points-system-field__unit">pts</span>
            </div>
            <div className="points-system-field__cell points-system-field__cell--input">
              <input
                type="number"
                value={thirdIndividualValue ?? 1}
                onChange={(e) => setThirdIndividualValue(parseInt(e.target.value, 10) || 0)}
                className="points-system-field__input"
                min="0"
              />
              <span className="points-system-field__unit">pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
