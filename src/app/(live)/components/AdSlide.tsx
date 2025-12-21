'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface AdSlideProps {
  imageUrl: string
}

export const AdSlide: React.FC<AdSlideProps> = ({ imageUrl }) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-900 relative overflow-hidden p-8">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-news-gold"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-news-gold"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-news-gold"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-news-gold"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-6xl w-full"
      >
        {/* Ad Image Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-news-gold">
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            src={imageUrl}
            alt="Advertisement"
            className="w-full h-auto object-contain max-h-[80vh]"
            onError={(e) => {
              // Fallback if image fails to load
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}

