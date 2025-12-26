'use client'

import { motion } from 'framer-motion'
import { MobilePivotTable } from './MobilePivotTable'
import { Setting } from '@/payload-types'
import { PointsSystem } from '@/types/common'

interface SectionCategoriesProps {
  categories: any[]
  settings?: Setting
  pointsSystem?: PointsSystem
}
const SectionCategories = ({ categories, settings, pointsSystem }: SectionCategoriesProps) => {
  // Get participant label from settings (singular form in Malayalam)
  const participantLabel =
    settings?.participantLabel?.singular?.ml || settings?.participantLabel?.singular?.en || 'മദ്രസ'

  return (
    <motion.div
      key="categories"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {categories.map((category, index) => (
        <MobilePivotTable
          key={category.name}
          data={category.data!}
          index={index}
          participantLabel={participantLabel}
          pointsSystem={pointsSystem}
        />
      ))}
    </motion.div>
  )
}

export default SectionCategories
