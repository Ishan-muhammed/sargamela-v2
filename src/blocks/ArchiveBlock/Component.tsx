import type { ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import React from 'react'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async () => {
  // This block is from the template and not used in the fest site
  // Return null or a placeholder
  return null
}
