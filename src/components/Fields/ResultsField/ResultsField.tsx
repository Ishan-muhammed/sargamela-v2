'use client'

import React from 'react'
import { RenderFields } from '@payloadcms/ui'
import type { GroupFieldClientComponent } from 'payload'
import type { ClientField } from 'payload'
import './styles.scss'

export const ResultsField: GroupFieldClientComponent = (props) => {
  const { field, path, schemaPath, permissions, readOnly } = props

  // Get the actual field definitions from the schema
  const fields = field.fields || []

  // Type guard to check if field has a name property
  const hasName = (f: ClientField): f is ClientField & { name: string } => {
    return 'name' in f && typeof f.name === 'string'
  }

  // Find each position field
  const firstField = fields.find((f) => hasName(f) && f.name === 'First')
  const secondField = fields.find((f) => hasName(f) && f.name === 'Second')
  const thirdField = fields.find((f) => hasName(f) && f.name === 'Third')

  return (
    <div className="results-field">
      <div className="results-field__header">
        <h3>Competition Results</h3>
        <p className="results-field__description">
          Select the top three participants for this competition item
        </p>
      </div>

      <div className="results-field__grid">
        <div className="results-field__position results-field__position--first">
          <div className="results-field__position-header">
            <span className="results-field__medal">🥇</span>
            <span className="results-field__rank">1st Place</span>
          </div>
          <div className="results-field__field-wrapper">
            {firstField && (
              <RenderFields
                fields={[firstField]}
                forceRender
                parentPath={path}
                parentIndexPath={path}
                parentSchemaPath={schemaPath || ''}
                permissions={permissions || {}}
                readOnly={readOnly}
            />
            )}
          </div>
        </div>

        <div className="results-field__position results-field__position--second">
          <div className="results-field__position-header">
            <span className="results-field__medal">🥈</span>
            <span className="results-field__rank">2nd Place</span>
          </div>
          <div className="results-field__field-wrapper">
            {secondField && (
              <RenderFields
                fields={[secondField]}
                forceRender
                parentPath={path}
                parentIndexPath={path}
                parentSchemaPath={schemaPath || ''}
                permissions={permissions || {}}
                readOnly={readOnly}
            />
            )}
          </div>
        </div>

        <div className="results-field__position results-field__position--third">
          <div className="results-field__position-header">
            <span className="results-field__medal">🥉</span>
            <span className="results-field__rank">3rd Place</span>
          </div>
          <div className="results-field__field-wrapper">
            {thirdField && (
              <RenderFields
                fields={[thirdField]}
                forceRender
                parentPath={path}
                parentIndexPath={path}
                parentSchemaPath={schemaPath || ''}
                permissions={permissions || {}}
                readOnly={readOnly}
            />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
