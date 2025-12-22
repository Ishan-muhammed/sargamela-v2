'use client'

import React, { useMemo, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Participant } from '@/types/common'
import { Trophy, Medal } from 'lucide-react'
import { calculateRanks, type RankedItem } from '@/utilities/rankingUtils'

interface ScoreboardSlideProps {
  participants: Participant[]
}

export const ScoreboardSlide: React.FC<ScoreboardSlideProps> = ({ participants }) => {
  // Calculate ranks with tie support
  const rankedParticipants = useMemo(() => {
    return calculateRanks(participants, (p) => p.score)
  }, [participants])

  // Split into top 3 ranks and the rest
  // Only split if there are actual scored teams in top 3
  const { top3, remaining } = useMemo(() => {
    // Check if anyone has scored
    const hasAnyScore = rankedParticipants.some((item) => item.item.score > 0)

    if (!hasAnyScore) {
      // No one has scored yet - don't split, show all in fallback
      return { top3: [], remaining: [] }
    }

    // Someone has scored - split based on rank and score
    const top3Items = rankedParticipants.filter((item) => item.rank <= 3 && item.item.score > 0)
    const remainingItems = rankedParticipants.filter(
      (item) => item.rank > 3 || item.item.score === 0,
    )
    return { top3: top3Items, remaining: remainingItems }
  }, [rankedParticipants])

  // Auto-scroll state for remaining items
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    if (!scrollRef.current || remaining.length === 0) return

    const scrollContainer = scrollRef.current
    const scrollHeight = scrollContainer.scrollHeight
    const clientHeight = scrollContainer.clientHeight

    // Only scroll if content overflows
    if (scrollHeight <= clientHeight) return

    const scrollSpeed = 30 // pixels per second
    const totalScrollDistance = scrollHeight - clientHeight
    const scrollDuration = (totalScrollDistance / scrollSpeed) * 1000 // ms

    let startTime: number | null = null
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = (elapsed % (scrollDuration + 2000)) / scrollDuration // +2s pause at bottom

      let newScrollPosition = 0
      if (progress < 1) {
        // Scrolling down
        newScrollPosition = totalScrollDistance * progress
      } else {
        // Pause at bottom, then reset
        newScrollPosition = totalScrollDistance
        if (progress >= 1.1) {
          // Reset after pause
          startTime = currentTime
        }
      }

      setScrollPosition(newScrollPosition)
      scrollContainer.scrollTop = newScrollPosition

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [remaining.length])

  const renderCard = (rankedItem: RankedItem<Participant>, index: number) => {
    const { item, rank, displayRank, isTied } = rankedItem
    const isFirst = rank === 1 && item.score > 0
    const isTop3 = rank <= 3 && item.score > 0
    const topScore = rankedParticipants[0]?.item.score || 0

    // Layout logic: First place gets a big box, others standard
    const gridSpan = isFirst ? 'col-span-1 md:col-span-2 row-span-2' : 'col-span-1'

    // Only apply special styling if team has scored
    const bgColor =
      item.score === 0
        ? 'bg-white border-l-4 border-gray-300'
        : isFirst
          ? 'bg-gradient-to-br from-news-red to-news-dark text-white'
          : rank === 2
            ? 'bg-gradient-to-br from-yellow-500 to-yellow-700 text-white'
            : rank === 3
              ? 'bg-gradient-to-br from-green-600 to-green-800 text-white'
              : 'bg-white border-l-4 border-gray-300'

    const textColor = isTop3 ? 'text-white' : 'text-news-black'
    const scoreColor =
      item.score === 0
        ? 'text-gray-400'
        : isFirst
          ? 'text-news-gold'
          : rank === 2
            ? 'text-yellow-100'
            : rank === 3
              ? 'text-green-100'
              : 'text-news-red'

    return (
      <motion.div
        layout
        key={item.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`${gridSpan} ${bgColor} rounded-lg shadow-xl p-4 flex flex-col justify-between relative overflow-hidden group`}
      >
        {/* Rank Badge - Only show if score > 0 */}
        {item.score > 0 && (
          <div
            className={`absolute top-0 right-0 p-2 font-display font-bold text-4xl opacity-20 ${
              isTop3 ? 'text-white' : 'text-black'
            }`}
          >
            #{displayRank}
          </div>
        )}

        {/* Icons for top ranks */}
        {rank === 1 && item.score > 0 && (
          <Trophy className="absolute bottom-4 right-4 text-news-gold opacity-30" size={120} />
        )}
        {rank === 2 && item.score > 0 && (
          <Medal className="absolute bottom-4 right-4 text-yellow-200 opacity-30" size={80} />
        )}
        {rank === 3 && item.score > 0 && (
          <Medal className="absolute bottom-4 right-4 text-green-200 opacity-30" size={80} />
        )}

        <div className="z-10">
          {isFirst && !isTied && item.score > 0 && (
            <div className="text-news-gold font-bold uppercase tracking-widest text-sm mb-2">
              Now leading
            </div>
          )}
          {isFirst && isTied && item.score > 0 && (
            <div className="text-news-gold font-bold uppercase tracking-widest text-sm mb-2">
              Tied for Lead
            </div>
          )}
          <h3
            className={`${
              isFirst ? 'text-4xl md:text-5xl' : 'text-2xl'
            } font-malayalam font-bold leading-tight ${textColor}`}
          >
            {item.name}
          </h3>
        </div>

        <div className="z-10 mt-4 flex items-baseline gap-2">
          <span
            className={`font-mono font-bold ${
              isFirst ? 'text-6xl md:text-7xl' : 'text-4xl'
            } ${scoreColor}`}
          >
            {item.score}
          </span>
          <span className={`text-sm font-bold uppercase opacity-80 ${textColor}`}>Points</span>
        </div>

        {/* Progress bar simulation for visuals */}
        {!isFirst && topScore > 0 && (
          <div className="w-full bg-gray-200 h-2 mt-4 rounded-full overflow-hidden">
            <div
              className={`h-full ${rank <= 3 ? 'bg-news-gold' : 'bg-news-red'}`}
              style={{
                width: `${(item.score / topScore) * 100}%`,
              }}
            ></div>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="flex-grow bg-slate-100 flex flex-col p-4 md:p-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-end mb-6 border-b-4 border-news-red pb-2">
        <div>
          <span className="bg-news-red text-white px-3 py-1 text-sm font-bold uppercase tracking-wider">
            Official Standings
          </span>
          <h2 className="text-5xl font-display font-bold text-news-black uppercase mt-1">
            Leaderboard
          </h2>
        </div>
        <div className="text-right">
          <div className="text-news-red font-bold text-xl flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Live Scoring
          </div>
        </div>
      </div>

      {/* Top 3 - Fixed Position */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
          <AnimatePresence>
            {top3.map((rankedItem, index) => renderCard(rankedItem, index))}
          </AnimatePresence>
        </div>
      )}

      {/* Remaining Participants - Auto Scrolling */}
      {remaining.length > 0 && (
        <div
          ref={scrollRef}
          className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start overflow-y-auto scrollbar-hide"
          style={{ maxHeight: 'calc(100vh - 400px)' }}
        >
          <AnimatePresence>
            {remaining.map((rankedItem, index) => renderCard(rankedItem, index))}
          </AnimatePresence>
        </div>
      )}

      {/* Show all in grid if no top 3 (e.g., all teams at 0 or fewer than needed for split) */}
      {top3.length === 0 && (
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start">
          <AnimatePresence>
            {rankedParticipants.map((rankedItem, index) => renderCard(rankedItem, index))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
