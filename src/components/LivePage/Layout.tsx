'use client'

import React, { useRef, useEffect } from 'react'
import { TICKER_NEWS } from '../../app/(live)/constants'

interface LayoutProps {
  children: React.ReactNode
  scrollNews?: string[]
  programStatus?: 'Live' | 'Upcoming' | 'Completed'
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  scrollNews,
  programStatus = 'Completed',
}) => {
  // Keep track of the last valid scroll news to avoid showing empty ticker
  const lastValidScrollNews = useRef<string[]>([])

  useEffect(() => {
    // Update cache only when we have actual data
    if (scrollNews !== undefined) {
      console.log('scrollNews', scrollNews)
      if (scrollNews.length > 0) {
        lastValidScrollNews.current = scrollNews
      } else {
        // Clear cache if scroll news is explicitly empty
        lastValidScrollNews.current = []
      }
    }
  }, [scrollNews])

  // Use scroll news if available, otherwise use last valid data or fallback
  const displayNews =
    scrollNews && scrollNews.length > 0
      ? scrollNews
      : lastValidScrollNews.current.length > 0
        ? lastValidScrollNews.current
        : TICKER_NEWS

  return (
    <div className="h-screen w-screen bg-neutral-900 text-white flex flex-col overflow-hidden font-sans">
      {/* Top Decoration Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-news-red via-news-gold to-news-red"></div>

      {/* Main Content Area */}
      <main className="flex-grow relative overflow-hidden flex flex-col">{children}</main>

      {/* Bottom Ticker */}
      <div className="h-16 bg-news-gold text-news-black flex items-center shadow-lg z-50 border-t-4 border-news-dark relative overflow-hidden">
        <div className="bg-news-red text-white font-display font-bold text-xl px-6 h-full flex items-center justify-center tracking-widest uppercase shrink-0 z-10 shadow-md">
          Breaking News
        </div>
        <div className="flex-grow overflow-hidden relative h-full flex items-center">
          <div className="animate-marquee whitespace-nowrap flex items-center">
            {displayNews.map((news, i) => (
              <span key={i} className="mx-8 text-2xl font-bold uppercase tracking-tight">
                <span className="text-news-red mr-2">●</span> {news}
              </span>
            ))}
            {/* Duplicate for seamless loop */}
            {displayNews.map((news, i) => (
              <span key={`dup-${i}`} className="mx-8 text-2xl font-bold uppercase tracking-tight">
                <span className="text-news-red mr-2">●</span> {news}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
