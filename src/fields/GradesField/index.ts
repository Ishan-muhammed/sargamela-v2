import type { ArrayField, SelectFieldServerComponent } from 'payload'

export const GradesField: ArrayField = {
  name: 'grade',
  type: 'array',
  required: true,
  admin: {
    description: 'Assign grades to participants who did not win positions',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'participant',
          type: 'relationship',
          relationTo: 'participants',
          required: true,
          admin: {
            description: 'The participant who received this grade',
            allowCreate: false,
            width: '50%',
          },
        },
        {
          name: 'grade',
          type: 'text',
          required: true,
          admin: {
            description: 'Select the grade to award',
            width: '50%',
            components: {
              Field: '/fields/GradesField/GradeSelectField#GradeSelectField',
            },
          },
        },
      ],
    },
  ],
}
