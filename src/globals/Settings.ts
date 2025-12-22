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
              fields: [
                {
                  name: 'singular',
                  type: 'group',
                  fields: [
                    {
                      name: 'en',
                      type: 'text',
                      required: true,
                      defaultValue: 'Madrasa',
                      admin: {
                        description:
                          'Singular form in English (e.g., "Madrasa", "Mandalam", "District")',
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
                      },
                    },
                  ],
                },
                {
                  name: 'plural',
                  type: 'group',
                  fields: [
                    {
                      name: 'en',
                      type: 'text',
                      required: true,
                      defaultValue: 'Madrasas',
                      admin: {
                        description:
                          'Plural form in English (e.g., "Madrasas", "Mandalams", "Districts")',
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
                      },
                    },
                  ],
                },
              ],
              admin: {
                description: 'Customizable labels for participants in both languages',
              },
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
                  defaultValue: 'ഫറോക്ക് മണ്ഡലം',
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
                  Field: '/components/Fields/PointsSystemField/PointsSystemField#PointsSystemField',
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
                      defaultValue: 5,
                    },
                    {
                      name: 'individualItem',
                      type: 'number',
                      required: true,
                      defaultValue: 2,
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
                      defaultValue: 1,
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
