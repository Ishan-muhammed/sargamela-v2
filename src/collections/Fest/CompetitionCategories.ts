import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField, type CollectionConfig } from 'payload'

export const CompetitionCategories: CollectionConfig<'competitionCategories'> = {
  slug: 'competitionCategories',
  admin: {
    defaultColumns: ['name', 'slug', 'order'],
    group: 'Event',
    useAsTitle: 'name',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    name: true,
    slug: true,
  },
  timestamps: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      admin: {
        description:
          'The name of the competition category like "Kids", "Children", "Sub Juniors", "Juniors", "Seniors"',
      },
      required: true,
    },
    slugField(),
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'The order of the competition category in the list, 0 is the first',
        position: 'sidebar',
      },
    },
    {
      name: 'Competition Items',
      type: 'join',
      collection: 'competitionItems',
      on: 'category',
    },
  ],
}

export default CompetitionCategories
