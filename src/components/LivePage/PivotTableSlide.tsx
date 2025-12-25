'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { PivotTableData } from '@/app/(frontend)/types'

interface PivotTableSlideProps {
  data: PivotTableData
  pageIndex: number
  participantLabel?: string
}

export const PivotTableSlide: React.FC<PivotTableSlideProps> = ({
  data,
  pageIndex,
  participantLabel = 'മദ്രസ',
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [scrollWidth, setScrollWidth] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      // Calculate the distance needed to scroll: Total Width - Visible Width
      // We add a buffer so it scrolls all the way to show the last column clearly
      const maxScroll = contentRef.current.scrollWidth - contentRef.current.clientWidth
      setScrollWidth(Math.max(0, maxScroll))
    }
  }, [data])

  const rowHeight = 'h-10'
  const colWidth = 'w-12'
  const nameColWidth = 'w-64'

  return (
    <div className="flex-grow bg-white flex flex-col p-2 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2 border-b-2 border-news-black pb-1 shrink-0">
        <div className="bg-news-black text-white text-xl font-display font-bold px-4 py-1 skew-x-[-10deg]">
          <div className="skew-x-[10deg]">CATEGORY</div>
        </div>
        <h2 className="text-3xl font-malayalam font-bold text-news-red uppercase truncate">
          {data.title}
        </h2>
      </div>

      {/* Table Container - Using Flex to separate Fixed Name Column from Scrolling Data */}
      <div className="flex-grow flex flex-col bg-slate-50 rounded shadow-inner border border-slate-200 overflow-hidden relative">
        {/* Header Row Wrapper */}
        <div className="flex border-b-2 border-news-dark bg-news-dark text-white shrink-0 z-20">
          {/* Fixed Top-Left Header */}
          <div
            className={`${nameColWidth} shrink-0 p-2 font-malayalam font-bold text-2xl uppercase tracking-wider border-r border-red-800 flex items-end pb-2 bg-news-dark z-30 shadow-[4px_0_5px_rgba(0,0,0,0.2)]`}
          >
            {participantLabel}
          </div>

          {/* Scrolling Headers */}
          <div className="flex-grow overflow-hidden relative">
            <motion.div
              animate={{ x: [0, -scrollWidth] }}
              transition={{
                duration: scrollWidth > 0 ? 20 : 0,
                ease: 'linear',
                delay: 1,
              }}
              className="flex h-48 items-end"
            >
              {data.headers.map((h, i) => (
                <div
                  key={i}
                  className={`${colWidth} shrink-0 pb-1 font-anek-malayalam text-sm font-bold uppercase tracking-tight border-r border-red-800 text-center flex items-end justify-center`}
                >
                  <div className="rotate-180 [writing-mode:vertical-rl] text-left w-full h-full flex items-center px-0.5 break-words whitespace-pre-line font-anek-malayalam">
                    {h}
                  </div>
                </div>
              ))}
              <div className="w-24 shrink-0 p-2 font-display text-lg uppercase tracking-wider bg-news-red text-center flex items-center justify-center">
                Total
              </div>
            </motion.div>
          </div>
        </div>

        {/* Body Wrapper */}
        <div className="flex-grow overflow-hidden flex relative">
          {/* Fixed Left Column (Participant Names) */}
          <div
            className={`${nameColWidth} shrink-0 bg-white border-r border-slate-300 z-10 shadow-[4px_0_5px_rgba(0,0,0,0.1)]`}
          >
            {data.rows.map((row, idx) => (
              <div
                key={idx}
                className={`${rowHeight} flex items-center px-3 font-bold text-xl text-news-black border-b border-slate-200 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                }`}
              >
                <span className="whitespace-nowrap overflow-visible font-malayalam">
                  {row.category}
                </span>
              </div>
            ))}
          </div>

          {/* Scrolling Data Columns */}
          <div ref={contentRef} className="flex-grow overflow-hidden relative bg-slate-50">
            <motion.div
              animate={{ x: [0, -scrollWidth] }}
              transition={{
                duration: scrollWidth > 0 ? 20 : 0,
                ease: 'linear',
                delay: 1,
              }}
            >
              {data.rows.map((row, idx) => (
                <div
                  key={idx}
                  className={`${rowHeight} flex border-b border-slate-200 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                  }`}
                >
                  {row.values.map((v, i) => (
                    <div
                      key={i}
                      className={`${colWidth} shrink-0 flex items-center justify-center text-xl font-mono border-r border-slate-200 ${
                        v === 10 || v === 5 ? 'bg-green-600 text-white font-bold' : 'text-slate-700'
                      }`}
                    >
                      {v > 0 ? v : <span className="text-gray-200 text-sm">.</span>}
                    </div>
                  ))}
                  <div className="w-24 shrink-0 flex items-center justify-center text-2xl font-bold bg-red-50 text-news-red font-mono border-l border-slate-300">
                    {row.total}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 right-4 text-gray-400 font-bold text-lg z-30">
        Page {pageIndex} of 5
      </div>
    </div>
  )
}
