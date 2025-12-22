'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

interface FlashNewsSlideProps {
  content: string
}

export const FlashNewsSlide: React.FC<FlashNewsSlideProps> = ({ content }) => {
  return (
    <div className="flex-grow bg-news-red flex items-center justify-center p-12 relative overflow-hidden">
      {/* Animated Background Stripes */}
      <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,#000_20px,#000_40px)]"></div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="bg-white p-12 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] max-w-5xl z-10 border-4 border-black text-center"
      >
        <div className="flex justify-center mb-6">
          <AlertTriangle size={80} className="text-news-red animate-pulse-fast" />
        </div>

        <h2 className="text-6xl font-display font-bold uppercase text-news-red mb-8 tracking-widest border-b-4 border-black pb-4 inline-block">
          Flash News
        </h2>

        <p className="text-5xl font-bold font-malayalam leading-tight text-black">{content}</p>
      </motion.div>
    </div>
  )
}
