import { importExportPlugin } from '@payloadcms/plugin-import-export'

export const importExport = importExportPlugin({
  collections: ['participants', 'eventCategories', 'competitionItems'],
})

export default importExport
