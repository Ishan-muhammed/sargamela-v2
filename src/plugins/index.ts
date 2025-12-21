import { Plugin } from 'payload'
import { search } from './plugin-search'
import { importExport } from './plugin-import-export'
import { redirects } from './plugin-redirect'
import { formBuilder } from './plugin-form-builder'
import nestedDocs from './plugin-nested-docs'
import seo from './plugin-seo'
import jsonImporter from './plugin-json-importer'

export const plugins: Plugin[] = [
  redirects,
  nestedDocs,
  seo,
  formBuilder,
  search,
  importExport,
  jsonImporter,
]
