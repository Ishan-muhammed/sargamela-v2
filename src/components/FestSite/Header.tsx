import { Menu, X, RefreshCw } from 'lucide-react'
import { Setting } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { Media } from '../Media'

interface HeaderProps {
  settings: Setting
  setMobileMenuOpen: (open: boolean) => void
  mobileMenuOpen: boolean
  secondsRemaining?: number
  isLoading?: boolean
}

const Header = ({
  settings,
  setMobileMenuOpen,
  mobileMenuOpen,
  secondsRemaining = 0,
  isLoading = false,
}: HeaderProps) => {
  const programStatus = settings.festStatus
  const isUpdating = secondsRemaining <= 5

  return (
    <div className="px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {settings.festLogo && (
          <Media resource={settings.festLogo} size="40px" className="w-10 h-10 object-contain" />
        )}
        <div>
          <h1 className="text-lg font-malayalam font-bold text-news-black leading-tight">
            {settings.festName}
          </h1>
          <div className="flex items-center gap-1 text-xs">
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                programStatus === 'live'
                  ? 'bg-green-500 animate-pulse'
                  : programStatus === 'upcoming'
                    ? 'bg-yellow-500 animate-pulse'
                    : 'bg-gray-400',
              )}
            ></div>
            <span
              className={
                programStatus === 'live'
                  ? 'text-green-600 font-bold'
                  : programStatus === 'upcoming'
                    ? 'text-yellow-600 font-bold'
                    : 'text-gray-500'
              }
            >
              {programStatus.charAt(0).toUpperCase() + programStatus.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2">
        {/* Countdown indicator - compact mobile friendly */}
        {!isLoading && (
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-md transition-colors',
              isUpdating
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            )}
          >
            <RefreshCw className={cn('w-3 h-3', isUpdating && 'animate-spin')} strokeWidth={2.5} />
            <span className="text-[10px] font-semibold tabular-nums">
              {isUpdating ? '...' : `${secondsRemaining}s`}
            </span>
          </div>
        )}

        {/* Menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-news-black" />
          ) : (
            <Menu className="w-6 h-6 text-news-black" />
          )}
        </button>
      </div>
    </div>
  )
}

export default Header
