'use client'

import { Link } from '@payloadcms/ui'
import { AnimatePresence, motion } from 'framer-motion'
import { Home, Trophy, Table, Radio, Tv } from 'lucide-react'

type Section = 'home' | 'scoreboard' | 'categories' | 'news'

interface MobileMenuOverlayProps {
  activeSection: Section
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  scrollToSection: (section: Section) => void
  hasNewsUpdate?: boolean
}
const MobileMenuOverlay = ({
  activeSection,
  mobileMenuOpen,
  setMobileMenuOpen,
  scrollToSection,
  hasNewsUpdate,
}: MobileMenuOverlayProps) => {
  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-[110px] left-0 right-0 bg-white shadow-lg z-40 border-t border-gray-200 max-h-[calc(100vh-110px)] overflow-y-auto"
        >
          <div className="p-4 space-y-3">
            {/* Navigation Links */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 px-2 font-bold">
                Navigation
              </p>

              <button
                onClick={() => scrollToSection('home')}
                className={`w-full px-4 py-3 rounded-lg font-display font-bold text-sm flex items-center gap-3 transition-all ${
                  activeSection === 'home'
                    ? 'bg-news-red text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>

              <button
                onClick={() => scrollToSection('scoreboard')}
                className={`w-full px-4 py-3 rounded-lg font-display font-bold text-sm flex items-center gap-3 transition-all ${
                  activeSection === 'scoreboard'
                    ? 'bg-news-red text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Trophy className="w-5 h-5" />
                <span>Scores</span>
              </button>

              <button
                onClick={() => scrollToSection('categories')}
                className={`w-full px-4 py-3 rounded-lg font-display font-bold text-sm flex items-center gap-3 transition-all ${
                  activeSection === 'categories'
                    ? 'bg-news-red text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Table className="w-5 h-5" />
                <span>Details</span>
              </button>

              <button
                onClick={() => scrollToSection('news')}
                className={`w-full px-4 py-3 rounded-lg font-display font-bold text-sm flex items-center gap-3 transition-all relative ${
                  activeSection === 'news'
                    ? 'bg-news-red text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Radio className="w-5 h-5" />
                <span>News</span>
                {hasNewsUpdate && activeSection !== 'news' && (
                  <span className="ml-auto flex items-center gap-1">
                    <span className="animate-ping absolute h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-news-gold opacity-75"></span>
                    <span className="relative inline-flex items-center justify-center px-1.5 sm:px-2 py-0.5 rounded-full bg-gradient-to-r from-news-gold to-yellow-600 text-white text-[9px] sm:text-[10px] font-bold shadow-lg uppercase tracking-tight">
                      New
                    </span>
                  </span>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 px-2 font-bold">
                Other Links
              </p>
            </div>

            {/* Big Screen Display Link */}
            <Link href="/live" onClick={() => setMobileMenuOpen(false)} className="block">
              <button className="w-full bg-gradient-to-r from-news-red to-news-dark text-white px-4 py-3 rounded-lg font-display font-bold text-sm flex items-center justify-between gap-3 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-3">
                  <Tv className="w-5 h-5" />
                  <span>Big Screen Display</span>
                </div>
                <span className="text-xs opacity-80">For Venue</span>
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileMenuOverlay
