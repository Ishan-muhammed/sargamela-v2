import { revalidateTag } from 'next/cache'

import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

// Universal hook that works for Collections (Change/Delete) and Globals (Change)
export const revalidateFest = ({ doc, req: { payload } }: any) => {
  payload.logger.info(`Revalidating fest-data tag`)

  revalidateTag('fest-data')

  return doc
}
