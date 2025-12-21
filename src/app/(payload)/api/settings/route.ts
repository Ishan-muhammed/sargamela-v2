import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * GET /api/settings
 *
 * Returns the global settings configuration for the event.
 * This includes event information, live display settings, scoring, etc.
 */
export async function GET() {
  try {
    const payload = await getPayload({ config })

    const settings = await payload.findGlobal({
      slug: 'settings',
      depth: 2,
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}
