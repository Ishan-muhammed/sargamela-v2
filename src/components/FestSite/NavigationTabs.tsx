import { Home, Trophy, Table, Radio } from 'lucide-react'

interface NavigationTabsProps {
  activeSection: Section
  scrollToSection: (section: Section) => void
  hasNewsUpdate?: boolean
}

type Section = 'home' | 'scoreboard' | 'categories' | 'news'

const NavigationTabs = ({ activeSection, scrollToSection, hasNewsUpdate }: NavigationTabsProps) => {
  return (
    <div className="flex overflow-x-auto bg-slate-50 border-t border-gray-200 scrollbar-hide">
      <button
        onClick={() => scrollToSection('home')}
        className={`flex-1 min-w-[80px] px-4 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
          activeSection === 'home'
            ? 'bg-news-red text-white border-b-2 border-news-gold'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>
      <button
        onClick={() => scrollToSection('scoreboard')}
        className={`flex-1 min-w-[80px] px-4 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
          activeSection === 'scoreboard'
            ? 'bg-news-red text-white border-b-2 border-news-gold'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Trophy className="w-4 h-4" />
        <span>Scores</span>
      </button>
      <button
        onClick={() => scrollToSection('categories')}
        className={`flex-1 min-w-[80px] px-4 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
          activeSection === 'categories'
            ? 'bg-news-red text-white border-b-2 border-news-gold'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Table className="w-4 h-4" />
        <span>Details</span>
      </button>
      <button
        onClick={() => scrollToSection('news')}
        className={`flex-1 min-w-[80px] px-4 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${
          activeSection === 'news'
            ? 'bg-news-red text-white border-b-2 border-news-gold'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Radio className="w-4 h-4" />
        <span>News</span>
        {hasNewsUpdate && activeSection !== 'news' && (
          <span className="absolute top-0 -right-1 sm:top-1 sm:-right-2 flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-news-gold opacity-75"></span>
            <span className="relative inline-flex items-center justify-center px-1 sm:px-1.5 py-0.5 rounded-full bg-gradient-to-br from-news-gold to-yellow-600 text-white text-[8px] sm:text-[9px] font-bold shadow-lg border border-white uppercase tracking-tight">
              New
            </span>
          </span>
        )}
      </button>
    </div>
  )
}

export default NavigationTabs
