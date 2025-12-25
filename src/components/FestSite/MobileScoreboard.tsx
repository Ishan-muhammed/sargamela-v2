'use client'

import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Participant, PointsSystem } from '@/app/(frontend)/types'
import { Trophy, Medal, Award, ChevronDown, Users, User, Info } from 'lucide-react'
import { calculateRanks, type RankedItem } from '@/utilities/rankingUtils'

interface MobileScoreboardProps {
  participants: Participant[]
  pointsSystem?: PointsSystem
}

export const MobileScoreboard: React.FC<MobileScoreboardProps> = ({
  participants,
  pointsSystem,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showScoringLegend, setShowScoringLegend] = useState(false)
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

  const getGradeBadgeColor = (gradeKey: string) => {
    // Generate consistent colors based on grade key
    // Using a simple hash-based color generation
    const colors = [
      'bg-green-600 text-white',
      'bg-blue-600 text-white',
      'bg-purple-600 text-white',
      'bg-pink-600 text-white',
      'bg-indigo-600 text-white',
      'bg-red-600 text-white',
      'bg-orange-600 text-white',
      'bg-teal-600 text-white',
      'bg-cyan-600 text-white',
      'bg-amber-600 text-white',
    ]

    // Simple hash function
    let hash = 0
    for (let i = 0; i < gradeKey.length; i++) {
      hash = gradeKey.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % colors.length
    return colors[index]
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

      {/* Scoring System Legend */}
      {pointsSystem && (
        <div className="mb-4">
          <button
            onClick={() => setShowScoringLegend(!showScoringLegend)}
            className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">Scoring System</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-blue-600 transition-transform ${showScoringLegend ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showScoringLegend && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-white rounded-b-lg border border-t-0 border-blue-200 space-y-4">
                  {/* Position Points */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-gray-700 mb-3">
                      Position Points
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm font-semibold text-gray-800">1st Place</span>
                        </div>
                        <div className="flex gap-4 text-sm font-medium">
                          <span className="flex items-center gap-1 text-gray-700">
                            <Users className="w-4 h-4" />
                            <strong className="text-gray-900">
                              {pointsSystem.firstPlace.group}
                            </strong>{' '}
                            pts
                          </span>
                          <span className="flex items-center gap-1 text-gray-700">
                            <User className="w-4 h-4" />
                            <strong className="text-gray-900">
                              {pointsSystem.firstPlace.individual}
                            </strong>{' '}
                            pts
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <Medal className="w-5 h-5 text-gray-400" />
                          <span className="text-sm font-semibold text-gray-800">2nd Place</span>
                        </div>
                        <div className="flex gap-4 text-sm font-medium">
                          <span className="flex items-center gap-1 text-gray-700">
                            <Users className="w-4 h-4" />
                            <strong className="text-gray-900">
                              {pointsSystem.secondPlace.group}
                            </strong>{' '}
                            pts
                          </span>
                          <span className="flex items-center gap-1 text-gray-700">
                            <User className="w-4 h-4" />
                            <strong className="text-gray-900">
                              {pointsSystem.secondPlace.individual}
                            </strong>{' '}
                            pts
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <Medal className="w-5 h-5 text-orange-400" />
                          <span className="text-sm font-semibold text-gray-800">3rd Place</span>
                        </div>
                        <div className="flex gap-4 text-sm font-medium">
                          <span className="flex items-center gap-1 text-gray-700">
                            <Users className="w-4 h-4" />
                            <strong className="text-gray-900">
                              {pointsSystem.thirdPlace.group}
                            </strong>{' '}
                            pts
                          </span>
                          <span className="flex items-center gap-1 text-gray-700">
                            <User className="w-4 h-4" />
                            <strong className="text-gray-900">
                              {pointsSystem.thirdPlace.individual}
                            </strong>{' '}
                            pts
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Grade Points */}
                  {pointsSystem.grades && pointsSystem.grades.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase text-gray-700 mb-3">
                        Grade Points
                      </h4>
                      <div className="space-y-2">
                        {pointsSystem.grades.map((grade) => (
                          <div
                            key={grade.key}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded text-sm font-bold uppercase ${getGradeBadgeColor(grade.key)}`}
                              >
                                {grade.label}
                              </span>
                            </div>
                            <div className="flex gap-4 text-sm font-medium">
                              <span className="flex items-center gap-1 text-gray-700">
                                <Users className="w-4 h-4" />
                                <strong className="text-gray-900">{grade.groupPoints}</strong> pts
                              </span>
                              <span className="flex items-center gap-1 text-gray-700">
                                <User className="w-4 h-4" />
                                <strong className="text-gray-900">
                                  {grade.individualPoints}
                                </strong>{' '}
                                pts
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-700 text-center font-medium">
                      <Users className="w-4 h-4 inline" /> = Group Item •{' '}
                      <User className="w-4 h-4 inline" /> = Individual Item
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

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
                    <div className="p-4 space-y-4">
                      {/* Position medals */}
                      <div>
                        <div
                          className={`text-xs font-bold uppercase mb-2 ${isTop3 ? 'text-white/80' : 'text-gray-600'}`}
                        >
                          Position Awards
                        </div>
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
                            <div
                              className={`text-xs ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                            >
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
                            <div
                              className={`text-xs ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                            >
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
                            <div
                              className={`text-xs ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                            >
                              3rd Place
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Grade breakdown */}
                      {participant.breakdown?.grades && participant.breakdown.grades.length > 0 && (
                        <div>
                          <div
                            className={`text-xs font-bold uppercase mb-2 ${isTop3 ? 'text-white/80' : 'text-gray-600'}`}
                          >
                            Grade Awards
                          </div>
                          <div className="space-y-2">
                            {participant.breakdown.grades.map((gradeEntry) => {
                              const hasGroup = gradeEntry.byType.group > 0
                              const hasIndividual = gradeEntry.byType.individual > 0

                              return (
                                <div key={gradeEntry.grade}>
                                  {hasGroup && (
                                    <div
                                      className={`flex items-center gap-2 p-2 rounded-lg ${
                                        isTop3 ? 'bg-white/10' : 'bg-gray-50'
                                      }`}
                                    >
                                      <Users
                                        className={`w-4 h-4 flex-shrink-0 ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                                      />
                                      <span
                                        className={`text-xs font-semibold flex-shrink-0 ${isTop3 ? 'text-white/80' : 'text-gray-700'}`}
                                      >
                                        Group
                                      </span>
                                      <span
                                        className={`text-xs ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                                      >
                                        -
                                      </span>
                                      <span
                                        className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${getGradeBadgeColor(gradeEntry.grade)}`}
                                      >
                                        {gradeEntry.gradeLabel}
                                      </span>
                                      <span className={`text-sm font-bold ${style.text}`}>
                                        ×{gradeEntry.byType.group}
                                      </span>
                                      <span
                                        className={`text-sm font-bold ml-auto ${isTop3 ? 'text-news-gold' : 'text-news-red'}`}
                                      >
                                        {gradeEntry.points.group} pts
                                      </span>
                                    </div>
                                  )}
                                  {hasIndividual && (
                                    <div
                                      className={`flex items-center gap-2 p-2 rounded-lg ${
                                        isTop3 ? 'bg-white/10' : 'bg-gray-50'
                                      }`}
                                    >
                                      <User
                                        className={`w-4 h-4 flex-shrink-0 ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                                      />
                                      <span
                                        className={`text-xs font-semibold flex-shrink-0 ${isTop3 ? 'text-white/80' : 'text-gray-700'}`}
                                      >
                                        Individual
                                      </span>
                                      <span
                                        className={`text-xs ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                                      >
                                        -
                                      </span>
                                      <span
                                        className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${getGradeBadgeColor(gradeEntry.grade)}`}
                                      >
                                        {gradeEntry.gradeLabel}
                                      </span>
                                      <span className={`text-sm font-bold ${style.text}`}>
                                        ×{gradeEntry.byType.individual}
                                      </span>
                                      <span
                                        className={`text-sm font-bold ml-auto ${isTop3 ? 'text-news-gold' : 'text-news-red'}`}
                                      >
                                        {gradeEntry.points.individual} pts
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Group vs Individual summary */}
                      <div>
                        <div
                          className={`text-xs font-bold uppercase mb-2 ${isTop3 ? 'text-white/80' : 'text-gray-600'}`}
                        >
                          Competition Type Summary
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {/* Group Summary */}
                          <div
                            className={`p-3 rounded-lg ${isTop3 ? 'bg-white/10' : 'bg-gray-50'}`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Users
                                className={`w-4 h-4 ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                              />
                              <span
                                className={`text-xs font-semibold ${isTop3 ? 'text-white/80' : 'text-gray-700'}`}
                              >
                                Group
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span
                                  className={`text-xs ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                                >
                                  🥇 1st
                                </span>
                                <span className={`text-sm font-bold ${style.text}`}>
                                  {participant.breakdown?.firstByType.group || 0}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span
                                  className={`text-xs ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                                >
                                  🥈 2nd
                                </span>
                                <span className={`text-sm font-bold ${style.text}`}>
                                  {participant.breakdown?.secondByType.group || 0}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span
                                  className={`text-xs ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                                >
                                  🥉 3rd
                                </span>
                                <span className={`text-sm font-bold ${style.text}`}>
                                  {participant.breakdown?.thirdByType.group || 0}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Individual Summary */}
                          <div
                            className={`p-3 rounded-lg ${isTop3 ? 'bg-white/10' : 'bg-gray-50'}`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <User
                                className={`w-4 h-4 ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                              />
                              <span
                                className={`text-xs font-semibold ${isTop3 ? 'text-white/80' : 'text-gray-700'}`}
                              >
                                Individual
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span
                                  className={`text-xs ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                                >
                                  🥇 1st
                                </span>
                                <span className={`text-sm font-bold ${style.text}`}>
                                  {participant.breakdown?.firstByType.individual || 0}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span
                                  className={`text-xs ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                                >
                                  🥈 2nd
                                </span>
                                <span className={`text-sm font-bold ${style.text}`}>
                                  {participant.breakdown?.secondByType.individual || 0}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span
                                  className={`text-xs ${isTop3 ? 'text-white/60' : 'text-gray-500'}`}
                                >
                                  🥉 3rd
                                </span>
                                <span className={`text-sm font-bold ${style.text}`}>
                                  {participant.breakdown?.thirdByType.individual || 0}
                                </span>
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
