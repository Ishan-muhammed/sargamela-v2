'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Radio, Megaphone } from 'lucide-react'
import RichText from '../RichText'
import { Setting } from '@/payload-types'

interface MobileNewsProps {
  flashNews?: Setting['flashNews']
  scrollNews?: Setting['tickerNews']
}

export const MobileNews: React.FC<MobileNewsProps> = ({ flashNews, scrollNews }) => {
  // Handle both old richText format and new plain text
  const flashNewsText = typeof flashNews === 'string' ? flashNews : ''

  return (
    <div className="w-full px-4 py-6 space-y-4">
      {/* Flash News */}
      {flashNewsText && flashNewsText.trim().length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-news-red to-news-dark rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Megaphone className="w-5 h-5 text-news-gold animate-pulse-fast" />
              <span className="text-news-gold font-display font-bold uppercase text-sm tracking-wider">
                Flash News
              </span>
            </div>
            <p className="text-white text-lg font-malayalam leading-relaxed whitespace-pre-wrap">
              {flashNewsText}
            </p>
          </div>
        </motion.div>
      )}

      {/* Scrolling News */}
      {scrollNews && scrollNews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-news-gold rounded-lg shadow-lg overflow-hidden"
        >
          <div className="bg-news-red px-4 py-2 flex items-center gap-2">
            <Radio className="w-4 h-4 text-white" />
            <span className="text-white font-display font-bold uppercase text-xs tracking-wider">
              Latest Updates
            </span>
          </div>
          <div className="p-4 space-y-3">
            {scrollNews.map((news, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-2 h-2 bg-news-red rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-news-black font-bold text-base flex-1">{news.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
