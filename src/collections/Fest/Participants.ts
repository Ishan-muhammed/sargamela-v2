import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import type { CollectionConfig } from 'payload'

export const Participants: CollectionConfig<'participants'> = {
  slug: 'participants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'shortCode', 'totalPoints', 'active'],
    group: 'Event',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    name: true,
    shortCode: true,
    active: true,
  },
  timestamps: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'The name of the participant like "തിരുത്തിയാട്"',
      },
    },
    {
      name: 'shortCode',
      type: 'text',
      required: false,
      admin: {
        description: 'The short code of the participant like "TT". Optional',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      required: false,
      defaultValue: true,
      admin: {
        description:
          'The active status of the participant, if disabled it will not be shown in the participant list',
      },
    },
    {
      name: 'totalPoints',
      type: 'ui',
      admin: {
        components: {
          Field: '/fields/TotalPointsField/TotalPointsField#TotalPointsField',
          Cell: '/fields/TotalPointsField/TotalPointsCell#TotalPointsCell',
        },
      },
    },
  ],
}

export default Participants
