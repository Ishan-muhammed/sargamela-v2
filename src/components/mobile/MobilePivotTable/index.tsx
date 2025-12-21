'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { PivotTableData } from '@/types/mobile'

interface MobilePivotTableProps {
  data: PivotTableData
  index: number
}

export const MobilePivotTable: React.FC<MobilePivotTableProps> = ({ data, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="w-full px-4 py-6"
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-news-black text-white px-3 py-1 text-xs font-display font-bold uppercase">
            Category
          </div>
          <ChevronRight className="w-4 h-4 text-news-red" />
        </div>
        <h3 className="text-2xl font-malayalam font-bold text-news-red">{data.title}</h3>
        <div className="h-1 w-16 bg-news-gold mt-2"></div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {/* Table Header - Scrollable */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-news-dark text-white">
              <tr>
                <th className="sticky left-0 z-10 bg-news-dark px-3 py-3 text-left font-malayalam font-bold text-sm border-r border-red-800 shadow-[2px_0_5px_rgba(0,0,0,0.2)]">
                  മദ്രസ
                </th>
                {data.headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-2 py-3 text-xs font-anek-malayalam font-bold border-r border-red-800 min-w-[60px]"
                  >
                    <div
                      className="rotate-180 [writing-mode:vertical-rl] mx-auto flex items-center justify-center break-words"
                      style={{
                        height: `${Math.max(150, header.length * 8)}px`,
                      }}
                    >
                      {header}
                    </div>
                  </th>
                ))}
                <th className="px-3 py-3 text-sm font-display font-bold bg-news-red min-w-[80px]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="sticky left-0 z-10 px-3 py-2 font-malayalam font-bold text-sm text-news-black border-r border-slate-200 shadow-[2px_0_5px_rgba(0,0,0,0.05)] bg-inherit">
                    {row.category}
                  </td>
                  {row.values.map((value, valIdx) => (
                    <td
                      key={valIdx}
                      className={`px-2 py-2 text-center font-mono border-r border-slate-200 ${
                        value === 10 || value === 5
                          ? 'bg-green-600 text-white font-bold text-base'
                          : 'text-slate-700 text-sm'
                      }`}
                    >
                      {value > 0 ? value : <span className="text-gray-300 text-xs">-</span>}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-center font-mono font-bold text-base text-news-red bg-red-50 border-l border-slate-300">
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 border-t border-gray-200 flex items-center gap-2">
          <ChevronRight className="w-3 h-3" />
          <span>Swipe to see all items</span>
        </div>
      </div>
    </motion.div>
  )
}
