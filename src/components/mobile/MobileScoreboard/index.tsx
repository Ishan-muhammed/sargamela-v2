'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Award } from 'lucide-react'
import type { ScoreboardParticipant } from '@/types/mobile'

interface MobileScoreboardProps {
  participants: ScoreboardParticipant[]
}

export const MobileScoreboard: React.FC<MobileScoreboardProps> = ({ participants }) => {
  // Sort participants by score descending
  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => b.totalPoints - a.totalPoints)
  }, [participants])

  const getPositionStyle = (index: number) => {
    if (index === 0) {
      return {
        bg: 'bg-gradient-to-r from-news-red to-news-dark',
        text: 'text-white',
        scoreColor: 'text-news-gold',
        icon: <Trophy className="w-6 h-6 text-news-gold" />,
      }
    }
    if (index === 1) {
      return {
        bg: 'bg-gradient-to-r from-yellow-500 to-yellow-700',
        text: 'text-white',
        scoreColor: 'text-yellow-100',
        icon: <Medal className="w-6 h-6 text-yellow-100" />,
      }
    }
    if (index === 2) {
      return {
        bg: 'bg-gradient-to-r from-green-600 to-green-800',
        text: 'text-white',
        scoreColor: 'text-green-100',
        icon: <Medal className="w-6 h-6 text-green-100" />,
      }
    }
    return {
      bg: 'bg-white',
      text: 'text-news-black',
      scoreColor: 'text-news-red',
      icon: <Award className="w-5 h-5 text-gray-400" />,
    }
  }

  return (
    <div className="w-full px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-news-red text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Live
          </div>
          <h2 className="text-3xl font-display font-bold text-news-black">Leaderboard</h2>
        </div>
        <div className="h-1 w-20 bg-news-gold"></div>
      </div>

      <div className="space-y-3">
        {sortedParticipants.map((participant, index) => {
          const style = getPositionStyle(index)
          const isTop3 = index < 3

          return (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`${style.bg} rounded-lg shadow-lg p-4 ${
                !isTop3 && 'border-l-4 border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`text-2xl font-bold font-display ${
                      isTop3 ? 'text-white/80' : 'text-gray-400'
                    }`}
                  >
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-xl font-malayalam font-bold ${style.text} truncate`}>
                      {participant.name}
                    </h3>
                    {index === 0 && (
                      <div className="text-news-gold text-xs font-bold uppercase">Leading</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-3xl font-mono font-bold ${style.scoreColor}`}>
                      {participant.totalPoints}
                    </div>
                    <div
                      className={`text-xs uppercase ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                    >
                      Points
                    </div>
                  </div>
                  {style.icon}
                </div>
              </div>
              {!isTop3 && sortedParticipants[0].totalPoints > 0 && (
                <div className="mt-3 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-news-red rounded-full transition-all duration-500"
                    style={{
                      width: `${(participant.totalPoints / sortedParticipants[0].totalPoints) * 100}%`,
                    }}
                  ></div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
