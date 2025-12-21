import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'

export const nestedDocs = nestedDocsPlugin({
  collections: [],
  generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
})

export default nestedDocs
