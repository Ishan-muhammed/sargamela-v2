'use client'

import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Participant } from '@/app/(frontend)/types'
import { Trophy, Medal, Award, ChevronDown, Users, User } from 'lucide-react'
import { calculateRanks, type RankedItem } from '@/utilities/rankingUtils'

interface MobileScoreboardProps {
  participants: Participant[]
}

export const MobileScoreboard: React.FC<MobileScoreboardProps> = ({ participants }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  // Calculate ranks with tie support
  const rankedParticipants = useMemo(() => {
    return calculateRanks(participants, (p) => p.score)
  }, [participants])

  const getPositionStyle = (rank: number, score: number, isTied: boolean) => {
    // Only apply special styling if team has scored
    if (score === 0) {
      return {
        bg: 'bg-white',
        text: 'text-news-black',
        scoreColor: 'text-gray-400',
        icon: <Award className="w-5 h-5 text-gray-400" />,
      }
    }

    if (rank === 1) {
      return {
        bg: 'bg-gradient-to-r from-news-red to-news-dark',
        text: 'text-white',
        scoreColor: 'text-news-gold',
        icon: <Trophy className="w-6 h-6 text-news-gold" />,
      }
    }
    if (rank === 2) {
      return {
        bg: 'bg-gradient-to-r from-yellow-500 to-yellow-700',
        text: 'text-white',
        scoreColor: 'text-yellow-100',
        icon: <Medal className="w-6 h-6 text-yellow-100" />,
      }
    }
    if (rank === 3) {
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
        {rankedParticipants.map((rankedItem, index) => {
          const { item: participant, rank, displayRank, isTied } = rankedItem
          const style = getPositionStyle(rank, participant.score, isTied)
          const isTop3 = rank <= 3 && participant.score > 0
          const topScore = rankedParticipants[0]?.item.score || 0
          const isExpanded = expandedId === participant.id
          const hasBreakdown = participant.breakdown && participant.score > 0

          return (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`${style.bg} rounded-lg shadow-lg overflow-hidden ${
                !isTop3 && 'border-l-4 border-gray-300'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : participant.id)}
                className="w-full p-4 text-left"
                disabled={!hasBreakdown}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {participant.score > 0 && (
                      <div
                        className={`text-2xl font-bold font-display ${
                          isTop3 ? 'text-white/80' : 'text-gray-400'
                        }`}
                      >
                        #{displayRank}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-xl font-malayalam font-bold ${style.text} truncate`}>
                        {participant.name}
                      </h3>
                      {rank === 1 && !isTied && participant.score > 0 && (
                        <div className="text-news-gold text-xs font-bold uppercase">Leading</div>
                      )}
                      {rank === 1 && isTied && participant.score > 0 && (
                        <div className="text-news-gold text-xs font-bold uppercase">
                          Tied for Lead
                        </div>
                      )}
                      {isTied && rank > 1 && participant.score > 0 && (
                        <div
                          className={`text-xs font-bold uppercase ${isTop3 ? 'text-white/80' : 'text-gray-500'}`}
                        >
                          Tied
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-3xl font-mono font-bold ${style.scoreColor}`}>
                        {participant.score}
                      </div>
                      <div
                        className={`text-xs uppercase ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                      >
                        Points
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {style.icon}
                      {hasBreakdown && (
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''} ${
                            isTop3 ? 'text-white/60' : 'text-gray-400'
                          }`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </button>

              {!isTop3 && topScore > 0 && !isExpanded && (
                <div className="px-4 pb-4">
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-news-red rounded-full transition-all duration-500"
                      style={{
                        width: `${(participant.score / topScore) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Expandable breakdown */}
              <AnimatePresence>
                {isExpanded && hasBreakdown && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`border-t ${isTop3 ? 'border-white/20' : 'border-gray-200'}`}
                  >
                    <div className="p-4 space-y-3">
                      {/* Medal counts */}
                      <div className="grid grid-cols-3 gap-2">
                        <div
                          className={`text-center p-3 rounded-lg ${
                            isTop3 ? 'bg-white/10' : 'bg-gray-50'
                          }`}
                        >
                          <Trophy
                            className={`w-6 h-6 mx-auto mb-1 ${isTop3 ? 'text-news-gold' : 'text-yellow-500'}`}
                          />
                          <div className={`text-2xl font-bold ${style.text}`}>
                            {participant.breakdown?.first || 0}
                          </div>
                          <div className={`text-xs ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}>
                            1st Place
                          </div>
                        </div>
                        <div
                          className={`text-center p-3 rounded-lg ${
                            isTop3 ? 'bg-white/10' : 'bg-gray-50'
                          }`}
                        >
                          <Medal
                            className={`w-6 h-6 mx-auto mb-1 ${isTop3 ? 'text-yellow-200' : 'text-gray-400'}`}
                          />
                          <div className={`text-2xl font-bold ${style.text}`}>
                            {participant.breakdown?.second || 0}
                          </div>
                          <div className={`text-xs ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}>
                            2nd Place
                          </div>
                        </div>
                        <div
                          className={`text-center p-3 rounded-lg ${
                            isTop3 ? 'bg-white/10' : 'bg-gray-50'
                          }`}
                        >
                          <Medal
                            className={`w-6 h-6 mx-auto mb-1 ${isTop3 ? 'text-green-200' : 'text-orange-400'}`}
                          />
                          <div className={`text-2xl font-bold ${style.text}`}>
                            {participant.breakdown?.third || 0}
                          </div>
                          <div className={`text-xs ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}>
                            3rd Place
                          </div>
                        </div>
                      </div>

                      {/* Group vs Individual breakdown */}
                      <div className="space-y-2">
                        <div
                          className={`text-xs font-bold uppercase ${isTop3 ? 'text-white/80' : 'text-gray-600'}`}
                        >
                          Competition Type
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div
                            className={`flex items-center gap-2 p-2 rounded-lg ${
                              isTop3 ? 'bg-white/10' : 'bg-gray-50'
                            }`}
                          >
                            <Users
                              className={`w-5 h-5 ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                            />
                            <div className="flex-1">
                              <div
                                className={`text-xs ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                              >
                                Group
                              </div>
                              <div className={`text-sm font-bold ${style.text}`}>
                                {(participant.breakdown?.firstByType.group || 0) +
                                  (participant.breakdown?.secondByType.group || 0) +
                                  (participant.breakdown?.thirdByType.group || 0)}{' '}
                                wins
                              </div>
                            </div>
                          </div>
                          <div
                            className={`flex items-center gap-2 p-2 rounded-lg ${
                              isTop3 ? 'bg-white/10' : 'bg-gray-50'
                            }`}
                          >
                            <User
                              className={`w-5 h-5 ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                            />
                            <div className="flex-1">
                              <div
                                className={`text-xs ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                              >
                                Individual
                              </div>
                              <div className={`text-sm font-bold ${style.text}`}>
                                {(participant.breakdown?.firstByType.individual || 0) +
                                  (participant.breakdown?.secondByType.individual || 0) +
                                  (participant.breakdown?.thirdByType.individual || 0)}{' '}
                                wins
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
