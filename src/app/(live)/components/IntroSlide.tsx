'use client'

import React from 'react'
import { motion } from 'framer-motion'

export const IntroSlide: React.FC = () => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center bg-gradient-to-br from-news-dark to-black relative overflow-hidden">
      {/* Background graphic elements */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-news-red text-white px-4 py-1 text-2xl font-anek-malayalam font-bold inline-block mb-6 uppercase tracking-widest shadow-lg"
        >
          <div className="">ഫറോക്ക് മണ്ഡലം</div>
        </motion.div>

        <h1 className="text-7xl md:text-9xl font-malayalam font-bold text-white mb-2 uppercase drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] tracking-tighter leading-relaxed space-y-4">
          <div>മദ്രസ</div>
          <div className="text-news-gold">സർഗ്ഗമേള</div>
          <div>2025</div>
        </h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="h-2 bg-news-gold mt-6 mb-6 mx-auto"
        ></motion.div>

        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex items-center justify-center gap-4"
        >
          <div className="w-6 h-6 bg-red-600 rounded-full animate-pulse"></div>
          <h2 className="text-4xl font-bold uppercase tracking-[0.5em] text-white">
            Live Updates
          </h2>
        </motion.div>
      </motion.div>
    </div>
  )
}

