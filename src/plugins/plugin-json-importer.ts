import { payloadcmsJsonImporter } from 'payloadcms-json-importer'

export const jsonImporter = payloadcmsJsonImporter({
  collections: {
    participants: true,
    eventCategories: true,
    competitionItems: true,
  },
})

export default jsonImporter
