'use client'

import { motion } from 'framer-motion'
import { MobileScoreboard } from './MobileScoreboard'
import { Participant } from '@/app/(frontend)/types'

interface SectionScoreboardProps {
  participants: Participant[]
}

const SectionScoreboard = ({ participants }: SectionScoreboardProps) => {
  return (
    <motion.div
      key="scoreboard"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <MobileScoreboard participants={participants} />
    </motion.div>
  )
}

export default SectionScoreboard
