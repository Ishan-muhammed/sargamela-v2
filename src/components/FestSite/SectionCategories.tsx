'use client'

import { motion } from 'framer-motion'
import { MobilePivotTable } from './MobilePivotTable'

interface SectionCategoriesProps {
  categories: any[]
}
const SectionCategories = ({ categories }: SectionCategoriesProps) => {
  return (
    <motion.div
      key="categories"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {categories.map((category, index) => (
        <MobilePivotTable key={category.name} data={category.data!} index={index} />
      ))}
    </motion.div>
  )
}

export default SectionCategories
