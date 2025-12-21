'use client'

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Madrasa } from '../types'
import { Trophy, Medal } from 'lucide-react'

interface ScoreboardSlideProps {
  madrasas: Madrasa[]
}

export const ScoreboardSlide: React.FC<ScoreboardSlideProps> = ({ madrasas }) => {
  // Sort madrasas by score descending
  const sortedMadrasas = useMemo(() => {
    return [...madrasas].sort((a, b) => b.score - a.score)
  }, [madrasas])

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

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start">
        <AnimatePresence>
          {sortedMadrasas.map((item, index) => {
            const isFirst = index === 0
            const isTop3 = index < 3

            // Layout logic: First place gets a big box, others standard
            const gridSpan = isFirst ? 'col-span-1 md:col-span-2 row-span-2' : 'col-span-1'

            const bgColor = isFirst
              ? 'bg-gradient-to-br from-news-red to-news-dark text-white'
              : index === 1
                ? 'bg-gradient-to-br from-yellow-500 to-yellow-700 text-white'
                : index === 2
                  ? 'bg-gradient-to-br from-green-600 to-green-800 text-white'
                  : 'bg-white border-l-4 border-gray-300'

            const textColor = isTop3 ? 'text-white' : 'text-news-black'
            const scoreColor = isFirst
              ? 'text-news-gold'
              : index === 1
                ? 'text-yellow-100'
                : index === 2
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
                {/* Rank Badge */}
                <div
                  className={`absolute top-0 right-0 p-2 font-display font-bold text-4xl opacity-20 ${
                    isTop3 ? 'text-white' : 'text-black'
                  }`}
                >
                  #{index + 1}
                </div>

                {/* Icons for top ranks */}
                {index === 0 && (
                  <Trophy
                    className="absolute bottom-4 right-4 text-news-gold opacity-30"
                    size={120}
                  />
                )}
                {index === 1 && (
                  <Medal className="absolute bottom-4 right-4 text-yellow-200 opacity-30" size={80} />
                )}
                {index === 2 && (
                  <Medal className="absolute bottom-4 right-4 text-green-200 opacity-30" size={80} />
                )}

                <div className="z-10">
                  {isFirst && (
                    <div className="text-news-gold font-bold uppercase tracking-widest text-sm mb-2">
                      Now leading
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
                  <span className={`text-sm font-bold uppercase opacity-80 ${textColor}`}>
                    Points
                  </span>
                </div>

                {/* Progress bar simulation for visuals */}
                {!isFirst && (
                  <div className="w-full bg-gray-200 h-2 mt-4 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${index < 3 ? 'bg-news-gold' : 'bg-news-red'}`}
                      style={{
                        width: `${(item.score / sortedMadrasas[0].score) * 100}%`,
                      }}
                    ></div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

