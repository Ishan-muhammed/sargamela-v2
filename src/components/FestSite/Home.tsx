import React from 'react'
import HomeClient from './Home.client'
import { getGlobal } from '@/utilities/getGlobals'
import { Setting } from '@/payload-types'

/**
 * Server Component wrapper for the Home page
 *
 * Strategy:
 * - Fetch settings server-side for initial page load (fast first render)
 * - HomeClient then uses settings from Fest API for live updates
 * - This provides optimal UX: fast initial load + auto-refresh
 */
export default async function HomePage() {
  const settings = (await getGlobal('settings', 2)) as Setting

  return <HomeClient initialSettings={settings} />
}
