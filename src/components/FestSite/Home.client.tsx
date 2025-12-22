'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { useFullDetails } from './hooks/useFestData'
import { useRefetchCountdown } from './hooks/useRefetchCountdown'
import Header from './Header'
import NavigationTabs from './NavigationTabs'
import MobileMenuOverlay from './MobileMenuOverlay'
import SectionHome from './SectionHome'
import SectionCategories from './SectionCategories'
import SectionScoreboard from './SectionScoreboard'
import SectionNews from './SectionNews'
import { Footer } from './Footer'
import { Setting } from '@/payload-types'

type Section = 'home' | 'scoreboard' | 'categories' | 'news'

interface HomeClientProps {
  initialSettings?: Setting // Optional: for SSR hydration
}

// Helper to create a hash of news content
function getNewsHash(flashNews?: string, tickerNews?: string[]): string {
  const flash = flashNews || ''
  const ticker = JSON.stringify(tickerNews || [])
  return `${flash}::${ticker}`
}

export default function HomeClient({ initialSettings }: HomeClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<Section>('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hasNewsUpdate, setHasNewsUpdate] = useState(false)
  const lastSeenNewsHashRef = useRef<string>('')

  // Fetch data from Fest API (auto-refreshes every 30s)
  const { data: festData, isLoading, error, dataUpdatedAt } = useFullDetails()

  // Use settings from API (with initial fallback for SSR hydration)
  const settings = festData?.settings || initialSettings

  // Countdown to next refetch (30 seconds), synced with actual data updates
  const secondsRemaining = useRefetchCountdown(30 * 1000, dataUpdatedAt, !isLoading && !error)

  // Transform API data to match component expectations
  const participants =
    festData?.participants.map((p) => ({
      id: String(p.id),
      name: p.name,
      score: p.score,
      breakdown: p.breakdown,
    })) || []

  const categories =
    festData?.detailedScoreboardData.map((category) => ({
      name: category.title,
      data: category,
    })) || []

  // Sync URL with active section
  useEffect(() => {
    const path = pathname
    if (path === '/' || path === '/home') {
      setActiveSection('home')
    } else if (path === '/scores' || path === '/scoreboard') {
      setActiveSection('scoreboard')
    } else if (path === '/details' || path === '/categories') {
      setActiveSection('categories')
    } else if (path === '/news') {
      setActiveSection('news')
    }
  }, [pathname])

  // Detect news changes
  useEffect(() => {
    if (!settings) return

    const currentNewsHash = getNewsHash(settings.flashNews, settings.tickerNews)

    // Initialize hash on first load
    if (!lastSeenNewsHashRef.current) {
      lastSeenNewsHashRef.current = currentNewsHash
      return
    }

    // If news changed and we're not on news tab, show badge
    if (currentNewsHash !== lastSeenNewsHashRef.current && activeSection !== 'news') {
      setHasNewsUpdate(true)
    }
  }, [settings?.flashNews, settings?.tickerNews, activeSection])

  // Clear badge when visiting news tab
  useEffect(() => {
    if (activeSection === 'news') {
      setHasNewsUpdate(false)
      if (settings) {
        lastSeenNewsHashRef.current = getNewsHash(settings.flashNews, settings.tickerNews)
      }
    }
  }, [activeSection, settings])

  const scrollToSection = (section: Section) => {
    setActiveSection(section)
    setMobileMenuOpen(false)

    // Update URL based on section
    const pathMap: Record<Section, string> = {
      home: '/',
      scoreboard: '/scores',
      categories: '/details',
      news: '/news',
    }
    // router.push(pathMap[section])

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Show loading state
  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-news-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-bold mb-2">Error loading data</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="h-1 bg-gradient-to-r from-news-red via-news-gold to-news-red"></div>

        {/* Header */}
        <Header
          settings={settings}
          setMobileMenuOpen={setMobileMenuOpen}
          mobileMenuOpen={mobileMenuOpen}
          secondsRemaining={secondsRemaining}
          isLoading={isLoading}
        />

        {/* Navigation Tabs */}
        <NavigationTabs
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          hasNewsUpdate={hasNewsUpdate}
        />
      </div>

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay
        activeSection={activeSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrollToSection={scrollToSection}
        hasNewsUpdate={hasNewsUpdate}
      />

      {/* Main Content - Flex grow to push footer down */}
      <div className="flex-grow flex flex-col">
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            {/* Home Section */}
            {activeSection === 'home' && (
              <SectionHome
                settings={settings}
                participants={participants}
                categories={categories}
              />
            )}

            {/* Scoreboard Section */}
            {activeSection === 'scoreboard' && <SectionScoreboard participants={participants} />}

            {/* Categories Section */}
            {activeSection === 'categories' && <SectionCategories categories={categories} />}

            {/* News Section */}
            {activeSection === 'news' && <SectionNews settings={settings} />}
          </AnimatePresence>
        </div>

        {/* Footer - Always at bottom */}
        <Footer
          organizerName={settings.organizerName}
          contactEmail={settings.contactEmail}
          contactPhone={settings.contactPhone}
          socialLinks={settings.socialLinks}
        />
      </div>
    </div>
  )
}
