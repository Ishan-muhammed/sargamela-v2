'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Layout } from '../components/Layout'
import { IntroSlide } from '../components/IntroSlide'
import { ScoreboardSlide } from '../components/ScoreboardSlide'
import { PivotTableSlide } from '../components/PivotTableSlide'
import { FlashNewsSlide } from '../components/FlashNewsSlide'
import { AdSlide } from '../components/AdSlide'
import { URGENT_FLASH_NEWS } from '../constants'
import { AnimatePresence, motion } from 'framer-motion'
import {
  useAllCategoriesData,
  useScoreboardMadrasas,
  useGeneralData,
  sheetQueryKeys,
} from '../hooks/useSheetData'
import { PivotTableData } from '../types'
import { useQueryClient } from '@tanstack/react-query'

// Configure durations for each slide in milliseconds
const DURATIONS = {
  INTRO: 5000,
  SCOREBOARD: 10000,
  TABLE: 20000, // Increased to allow time for auto-scrolling columns
  FLASH: 6000,
  AD: 8000, // 8 seconds for advertisement
}

const LivePage: React.FC = () => {
  const [viewIndex, setViewIndex] = useState(0)
  const queryClient = useQueryClient()

  // Calculate refetch interval: 1 minute minimum
  const generalRefetchInterval = 60 * 1000 // 60 seconds

  // Fetch all categories data using TanStack Query
  const categoriesData = useAllCategoriesData()
  const { madrasas, isLoading: scoreboardLoading } = useScoreboardMadrasas()
  const { data: generalData, isLoading: generalLoading } = useGeneralData(generalRefetchInterval)

  // Use real data from Google Sheets
  const displayMadrasas = madrasas
  // Only show flash news if there's actual content (not empty string)
  const flashNewsContent = generalData?.flashNews?.trim() || URGENT_FLASH_NEWS
  const programStatus = generalData?.programStatus || 'Completed'
  const adImageUrl = generalData?.adImageUrl?.trim() || ''

  // Construct the sequence of views dynamically from fetched data
  // 0: Intro
  // 1: Scoreboard
  // 2-6: Tables (Kids, Children, Sub Juniors, Juniors, Seniors)
  // 7: Flash News (Conditional)
  // 8: Ad (Conditional)
  const views = useMemo(() => {
    const sequence: Array<{
      type: string
      data?: PivotTableData
      index?: number
    }> = [{ type: 'INTRO' }]

    // Only add Flash News slide if there's actual content
    if (flashNewsContent && flashNewsContent.trim().length > 0) {
      sequence.push({ type: 'FLASH' })
    }

    sequence.push({ type: 'SCOREBOARD' })

    // Add category tables if data is available
    const categories = [
      categoriesData.kids,
      categoriesData.children,
      categoriesData.subJuniors,
      categoriesData.juniors,
      categoriesData.seniors,
    ]

    categories.forEach((category, index) => {
      if (category.data) {
        sequence.push({
          type: 'TABLE',
          data: category.data,
          index: index + 1,
        })
      }
    })

    // Add Ad slide at the end if there's an ad image
    if (adImageUrl && adImageUrl.length > 0) {
      sequence.push({ type: 'AD' })
    }

    return sequence
  }, [
    flashNewsContent,
    adImageUrl,
    categoriesData.kids.data,
    categoriesData.children.data,
    categoriesData.subJuniors.data,
    categoriesData.juniors.data,
    categoriesData.seniors.data,
  ])

  // Reset viewIndex if it's out of bounds (e.g., Flash News removed)
  useEffect(() => {
    if (viewIndex >= views.length && views.length > 0) {
      setViewIndex(0)
    }
  }, [views.length, viewIndex])

  useEffect(() => {
    const currentViewConfig = views[viewIndex]

    let duration = 1000
    if (currentViewConfig.type === 'INTRO') duration = DURATIONS.INTRO
    else if (currentViewConfig.type === 'SCOREBOARD') duration = DURATIONS.SCOREBOARD
    else if (currentViewConfig.type === 'TABLE') duration = DURATIONS.TABLE
    else if (currentViewConfig.type === 'FLASH') {
      duration = DURATIONS.FLASH
      // Refetch general data when Flash News completes
      const refetchTimer = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: sheetQueryKeys.general() })
      }, duration - 500) // Refetch 500ms before transitioning
    } else if (currentViewConfig.type === 'AD') {
      duration = DURATIONS.AD
    }

    const timer = setTimeout(() => {
      setViewIndex((prev) => (prev + 1) % views.length)
    }, duration)

    return () => {
      clearTimeout(timer)
    }
  }, [viewIndex, views, queryClient])

  // No longer needed - scores update automatically via TanStack Query refetch

  // Log data when it's fetched (for debugging)
  useEffect(() => {
    if (!categoriesData.isLoading && !categoriesData.isError) {
      console.log('Formatted Kids Data:', categoriesData.kids.data)
      console.log('Formatted Children Data:', categoriesData.children.data)
      console.log('Formatted Sub Juniors Data:', categoriesData.subJuniors.data)
      console.log('Formatted Juniors Data:', categoriesData.juniors.data)
      console.log('Formatted Seniors Data:', categoriesData.seniors.data)
    }
  }, [
    categoriesData.isLoading,
    categoriesData.isError,
    categoriesData.kids.data,
    categoriesData.children.data,
    categoriesData.subJuniors.data,
    categoriesData.juniors.data,
    categoriesData.seniors.data,
  ])

  const currentView = views[viewIndex]

  return (
    <Layout scrollNews={generalData?.scrollNews} programStatus={programStatus}>
      <AnimatePresence mode="wait">
        <motion.div
          key={viewIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-grow flex flex-col h-full w-full"
        >
          {currentView.type === 'INTRO' && <IntroSlide />}
          {currentView.type === 'SCOREBOARD' && <ScoreboardSlide madrasas={displayMadrasas} />}
          {currentView.type === 'TABLE' && (
            // @ts-ignore - dynamic type check safe
            <PivotTableSlide data={currentView.data} pageIndex={currentView.index} />
          )}
          {currentView.type === 'FLASH' && <FlashNewsSlide content={flashNewsContent} />}
          {currentView.type === 'AD' && <AdSlide imageUrl={adImageUrl} />}
        </motion.div>
      </AnimatePresence>
    </Layout>
  )
}

export default LivePage
