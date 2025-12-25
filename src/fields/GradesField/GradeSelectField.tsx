'use client'

import { useEffect, useState } from 'react'
import { SelectInput, useField } from '@payloadcms/ui'
import type { OptionObject } from 'payload'

interface GradeSelectFieldProps {
  path: string
}

interface GradeSystemItem {
  key: string
  grade: string
  groupPoints: number
  individualPoints: number
}

export const GradeSelectField: React.FC<GradeSelectFieldProps> = ({ path }) => {
  const { value, setValue } = useField<string>({ path })
  const [options, setOptions] = useState<OptionObject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/globals/settings')

        if (!response.ok) {
          throw new Error('Failed to fetch grade system')
        }

        const data = await response.json()

        if (data.gradeSystem && Array.isArray(data.gradeSystem)) {
          // Transform gradeSystem to SelectInput options format with detailed labels
          const transformedOptions = data.gradeSystem.map((grade: GradeSystemItem) => ({
            label: `${grade.grade} - Group: ${grade.groupPoints}pts, Individual: ${grade.individualPoints}pts`,
            value: grade.key,
          }))
          setOptions(transformedOptions)
        } else {
          setOptions([])
        }
      } catch (err) {
        console.error('Error fetching grades:', err)
        setError(err instanceof Error ? err.message : 'Failed to load grades')
        setOptions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchGrades()
  }, [])

  return (
    <div className="grade-select-field">
      <div className="field-type">
        <label className="field-label">
          Grade
          <span className="required">*</span>
        </label>
      </div>
      {error && (
        <div
          className="grade-select-field__error"
          style={{ color: 'var(--theme-error-500)', marginBottom: '0.5rem' }}
        >
          {error}
        </div>
      )}
      <SelectInput
        path={path}
        name={path}
        options={options}
        value={value}
        onChange={(selectedOption) => {
          if (selectedOption && typeof selectedOption === 'object' && 'value' in selectedOption) {
            setValue(selectedOption.value as string)
          }
        }}
        readOnly={isLoading}
        style={{ width: '100%' }}
        isClearable
      />
      <div className="field-description" style={{ marginTop: '0.25rem' }}>
        Select the grade to award to this participant
      </div>
      {isLoading && (
        <div
          className="grade-select-field__loading"
          style={{
            fontSize: '0.875rem',
            color: 'var(--theme-elevation-400)',
            marginTop: '0.25rem',
          }}
        >
          Loading grades...
        </div>
      )}
    </div>
  )
}
