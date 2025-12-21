import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import type { CollectionConfig } from 'payload'

export const CompetitionItems: CollectionConfig<'competitionItems'> = {
  slug: 'competitionItems',
  admin: {
    defaultColumns: [
      'title',
      'category',
      'type',
      'order',
      'active',
      'results.First',
      'results.Second',
      'results.Third',
    ],
    group: 'Event',
    groupBy: true,
    description: 'The competition items of the event',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    category: true,
    type: true,
    order: true,
    active: true,
  },
  timestamps: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The title of the competition item like "ഖുർആൻ പാരായണം"',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'eventCategories',
      required: true,
      admin: {
        description: 'The category of the competition item',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        {
          label: 'Group Item',
          value: 'group',
        },
        {
          label: 'Individual Item',
          value: 'individual',
        },
      ],
      required: true,
      admin: {
        description: 'The type of the competition item like "Group Item" or "Individual Item"',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'The order of the competition item in the list, 0 is the first',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      required: false,
      defaultValue: true,
      admin: {
        description:
          'The active status of the competition item, if disabled it will not be shown in the competition list',
      },
    },
    {
      name: 'results',
      type: 'group',
      label: false, // Hide default label since our custom component has its own
      admin: {
        components: {
          Field: '/components/Fields/ResultsField/ResultsField#ResultsField',
        },
      },
      fields: [
        {
          name: 'First',
          type: 'relationship',
          relationTo: 'participants',
          hasMany: false,
          admin: {
            description: 'The first place participant of the competition item',
            allowCreate: false,
          },
        },
        {
          name: 'Second',
          type: 'relationship',
          relationTo: 'participants',
          hasMany: false,
          admin: {
            description: 'The second place participant of the competition item',
            allowCreate: false,
          },
        },
        {
          name: 'Third',
          type: 'relationship',
          relationTo: 'participants',
          hasMany: false,
          admin: {
            description: 'The third place participant of the competition item',
            allowCreate: false,
          },
        },
      ],
    },
  ],
}

export default CompetitionItems
