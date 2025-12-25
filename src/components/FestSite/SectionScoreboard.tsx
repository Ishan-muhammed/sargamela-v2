'use client'

import { motion } from 'framer-motion'
import { MobileScoreboard } from './MobileScoreboard'
import { Participant, PointsSystem } from '@/app/(frontend)/types'

interface SectionScoreboardProps {
  participants: Participant[]
  pointsSystem?: PointsSystem
}

const SectionScoreboard = ({ participants, pointsSystem }: SectionScoreboardProps) => {
  return (
    <motion.div
      key="scoreboard"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <MobileScoreboard participants={participants} pointsSystem={pointsSystem} />
    </motion.div>
  )
}

export default SectionScoreboard
