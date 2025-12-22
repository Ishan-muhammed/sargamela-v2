import { payloadcmsJsonImporter } from 'payloadcms-json-importer'

export const jsonImporter = payloadcmsJsonImporter({
  collections: {
    participants: true,
    competitionCategories: true,
    competitionItems: true,
  },
})

export default jsonImporter
