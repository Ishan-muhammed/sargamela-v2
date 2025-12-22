'use client'
import { motion } from 'framer-motion'
import { MobileNews } from './MobileNews'
import { Setting } from '@/payload-types'

interface SectionNewsProps {
  settings: Setting
}

const SectionNews = ({ settings }: SectionNewsProps) => {
  return (
    <motion.div
      key="news"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <MobileNews flashNews={settings.flashNews} scrollNews={settings.tickerNews} />
    </motion.div>
  )
}

export default SectionNews
