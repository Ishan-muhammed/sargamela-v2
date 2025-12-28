import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import {
  FixedToolbarFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import hooks from './hooks'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: authenticatedOrPublished,
    update: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Fest Information',
          fields: [
            {
              name: 'festName',
              type: 'text',
              required: true,
              defaultValue: 'Sargamela 2025',
              admin: {
                description: 'The name of the fest displayed throughout the site',
              },
            },
            {
              name: 'festDescription',
              type: 'textarea',
              admin: {
                description: 'A brief description of the fest',
              },
            },
            {
              name: 'participantLabel',
              type: 'group',
              admin: {
                description: 'Customizable labels for participants in both languages',
              },
              fields: [
                {
                  name: 'singular',
                  type: 'group',
                  label: 'Singular Form',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'en',
                          type: 'text',
                          required: true,
                          defaultValue: 'Madrasa',
                          admin: {
                            description:
                              'Singular form in English (e.g., "Madrasa", "Zone", "District")',
                            width: '50%',
                          },
                        },
                        {
                          name: 'ml',
                          type: 'text',
                          required: true,
                          defaultValue: 'മദ്രസ',
                          admin: {
                            description:
                              'Singular form in Malayalam (e.g., "മദ്രസ", "മണ്ഡലം", "ജില്ല")',
                            width: '50%',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'plural',
                  type: 'group',
                  label: 'Plural Form',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'en',
                          type: 'text',
                          required: true,
                          defaultValue: 'Madrasas',
                          admin: {
                            description:
                              'Plural form in English (e.g., "Madrasas", "Zones", "Districts")',
                            width: '50%',
                          },
                        },
                        {
                          name: 'ml',
                          type: 'text',
                          required: true,
                          defaultValue: 'മദ്രസകൾ',
                          admin: {
                            description:
                              'Plural form in Malayalam (e.g., "മദ്രസകൾ", "മണ്ഡലങ്ങൾ", "ജില്ലകൾ")',
                            width: '50%',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'festDate',
              type: 'date',
              admin: {
                description: 'The date of the fest',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'festStatus',
              type: 'select',
              required: true,
              defaultValue: 'upcoming',
              options: [
                {
                  label: 'Upcoming',
                  value: 'upcoming',
                },
                {
                  label: 'Live',
                  value: 'live',
                },
                {
                  label: 'Completed',
                  value: 'completed',
                },
              ],
              admin: {
                description: 'Current status of the fest',
              },
            },
            {
              name: 'festLogo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'The main logo for the fest',
              },
            },
            {
              name: 'organizationLogo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Organization logo (e.g., KNM Education Board)',
              },
            },
            {
              name: 'festBanner',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Banner image for the fest',
              },
            },
          ],
        },
        {
          label: 'Live Display Settings',
          fields: [
            {
              name: 'introSlide',
              type: 'group',
              admin: {
                description: 'Configure the intro slide that appears at the start of live display',
              },
              fields: [
                {
                  name: 'topLabel',
                  type: 'text',
                  required: true,
                  defaultValue: 'കോഴിക്കോട് നോർത്ത് ജില്ലാ',
                  admin: {
                    description: 'Top label text (shown in red banner)',
                  },
                },
                {
                  name: 'titleLine1',
                  type: 'text',
                  required: true,
                  defaultValue: 'മദ്രസ',
                  admin: {
                    description: 'First line of main title',
                  },
                },
                {
                  name: 'titleLine2',
                  type: 'text',
                  required: true,
                  defaultValue: 'സർഗ്ഗമേള',
                  admin: {
                    description: 'Second line of main title (shown in gold)',
                  },
                },
                {
                  name: 'titleLine3',
                  type: 'text',
                  required: true,
                  defaultValue: '2025',
                  admin: {
                    description: 'Third line of main title (usually year)',
                  },
                },
                {
                  name: 'bottomText',
                  type: 'text',
                  required: true,
                  defaultValue: 'Live Updates',
                  admin: {
                    description: 'Text shown at bottom with pulsing indicator',
                  },
                },
              ],
            },
            {
              name: 'flashNews',
              type: 'textarea',
              admin: {
                description:
                  'Urgent flash news that will be displayed prominently (leave empty to hide)',
              },
            },
            {
              name: 'tickerNews',
              type: 'array',
              admin: {
                description: 'News items that scroll at the bottom of the display',
              },
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'adImageUrl',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Advertisement image to display during transitions',
              },
            },
          ],
        },
        {
          label: 'Scoring Settings',
          fields: [
            {
              name: 'pointsSystem',
              type: 'group',
              label: false,
              admin: {
                components: {
                  Field: '/fields/PointsSystemField/PointsSystemField#PointsSystemField',
                },
              },
              fields: [
                {
                  name: 'firstPlace',
                  type: 'group',
                  fields: [
                    {
                      name: 'groupItem',
                      type: 'number',
                      required: true,
                      defaultValue: 10,
                      admin: {
                        description: 'Points awarded for 1st place group item',
                      },
                    },
                    {
                      name: 'individualItem',
                      type: 'number',
                      required: true,
                      defaultValue: 5,
                      admin: {
                        description: 'Points awarded for 1st place individual item',
                      },
                    },
                  ],
                },
                {
                  name: 'secondPlace',
                  type: 'group',
                  fields: [
                    {
                      name: 'groupItem',
                      type: 'number',
                      required: true,
                      defaultValue: 6,
                    },
                    {
                      name: 'individualItem',
                      type: 'number',
                      required: true,
                      defaultValue: 3,
                      admin: {
                        description: 'Points awarded for 2nd place individual item',
                      },
                    },
                  ],
                },
                {
                  name: 'thirdPlace',
                  type: 'group',
                  fields: [
                    {
                      name: 'groupItem',
                      type: 'number',
                      required: true,
                      defaultValue: 2,
                      admin: {
                        description: 'Points awarded for 3rd place group item',
                      },
                    },
                    {
                      name: 'individualItem',
                      type: 'number',
                      required: true,
                      defaultValue: 1,
                      admin: {
                        description: 'Points awarded for 3rd place individual item',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'gradeSystem',
              type: 'array',
              admin: {
                description:
                  "Grade-based scoring system (A, B, C grades). Participants who don't win positions can receive grades with points.",
                initCollapsed: false,
              },
              defaultValue: [
                { key: 'a', grade: 'A', groupPoints: 5, individualPoints: 5 },
                { key: 'b', grade: 'B', groupPoints: 3, individualPoints: 3 },
                { key: 'c', grade: 'C', groupPoints: 1, individualPoints: 1 },
              ],
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'key',
                      type: 'text',
                      required: true,
                      admin: {
                        description:
                          'Key of the grade (e.g., a, b, c, a-plus, etc.), this will be used to identify the grade in the results',
                        width: '50%',
                      },
                    },
                    {
                      name: 'grade',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Grade label (e.g., A, B, C, A+, etc.)',
                        width: '50%',
                      },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'groupPoints',
                      type: 'number',
                      required: true,
                      defaultValue: 1,
                      admin: {
                        description: 'Points awarded for this grade in group items',
                        width: '50%',
                      },
                    },
                    {
                      name: 'individualPoints',
                      type: 'number',
                      required: true,
                      defaultValue: 1,
                      admin: {
                        description: 'Points awarded for this grade in individual items',
                        width: '50%',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'showPointsOnScoreboard',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Display points on the public scoreboard',
              },
            },
          ],
        },
        {
          label: 'Contact & Social',
          fields: [
            {
              name: 'organizerName',
              type: 'text',
              admin: {
                description: 'Name of the organizing body',
              },
            },
            {
              name: 'contactEmail',
              type: 'email',
              admin: {
                description: 'Contact email for the event',
              },
            },
            {
              name: 'contactPhone',
              type: 'text',
              admin: {
                description: 'Contact phone number',
              },
            },
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Twitter', value: 'twitter' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'Website', value: 'website' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Programs & Schedules',
          fields: [
            {
              name: 'programFiles',
              type: 'array',
              admin: {
                description: 'Downloadable program schedules (PDF, etc.)',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'file',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: hooks,
}

export default Settings
