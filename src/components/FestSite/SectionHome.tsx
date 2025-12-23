'use client'

import { motion } from 'framer-motion'
import { Trophy, Table, Radio, FileText, Download } from 'lucide-react'
import { MobileNews } from './MobileNews'
import { Participant } from '@/app/(frontend)/types'
import { cn } from '@/utilities/ui'
import { Media as MediaType, Setting } from '@/payload-types'
import { Media } from '../Media'
import { getMediaUrl } from '@/utilities/getMediaUrl'

interface SectionHomeProps {
  settings: Setting
  participants: Participant[]
  categories: any[]
}

const SectionHome = ({ settings, participants, categories }: SectionHomeProps) => {
  const programStatus = settings.festStatus

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-news-dark via-black to-news-black px-4 py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-news-red rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-news-gold rounded-full filter blur-3xl opacity-30"></div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center"
        >
          {/* Logo Images */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {settings.festLogo && (
              <motion.img
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                src={getMediaUrl((settings.festLogo as MediaType).url)}
                alt={(settings.festLogo as MediaType).alt || 'Logo'}
                className="w-16 h-16 object-contain"
              />
            )}

            {settings.organizationLogo ? (
              <motion.img
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                src={getMediaUrl((settings.organizationLogo as MediaType).url)}
                alt={(settings.organizationLogo as MediaType).alt || 'Organization Logo'}
                className="w-16 h-16 object-contain"
              />
            ) : (
              <motion.img
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                src="/media/KNM Logo.png"
                alt="KNM Education Board"
                className="w-16 h-16 object-contain"
              />
            )}
          </div>

          {/* Sargamela Art or Title Lines */}
          {settings.festBanner ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-6"
            >
              <Media resource={settings.festBanner} size="640px" className="w-64 h-auto mx-auto" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-6"
            >
              {settings.introSlide?.titleLine1 && (
                <div className="text-3xl md:text-4xl font-malayalam font-bold text-white mb-2">
                  {settings.introSlide.titleLine1}
                </div>
              )}
              {settings.introSlide?.titleLine2 && (
                <div className="text-2xl md:text-3xl font-malayalam font-semibold text-news-gold">
                  {settings.introSlide.titleLine2}
                </div>
              )}
            </motion.div>
          )}

          {/* Year/Title Line 3 */}
          {settings.introSlide?.titleLine3 && (
            <>
              <div className="text-4xl font-malayalam font-bold text-white mb-3">
                <div className="text-news-gold">{settings.introSlide.titleLine3}</div>
              </div>
              <div className="h-1 w-24 bg-news-gold mx-auto mt-4 mb-6"></div>
            </>
          )}
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <Trophy className="w-6 h-6 text-news-gold mx-auto mb-2" />
          <div className="text-2xl font-bold text-news-red">{participants.length}</div>
          <div className="text-xs text-gray-600 font-bold">
            {settings.participantLabel.plural.en}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <Table className="w-6 h-6 text-news-gold mx-auto mb-2" />
          <div className="text-2xl font-bold text-news-red">{categories.length}</div>
          <div className="text-xs text-gray-600 font-bold">Categories</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <Radio className="w-6 h-6 text-news-gold mx-auto mb-2" />
          <div
            className={cn(
              'text-base sm:text-2xl font-bold',
              programStatus === 'live'
                ? 'text-green-600 animate-pulse'
                : programStatus === 'upcoming'
                  ? 'text-yellow-600 animate-pulse'
                  : 'text-gray-500',
            )}
          >
            {programStatus.charAt(0).toUpperCase() + programStatus.slice(1)}
          </div>
          <div className="text-xs text-gray-600 font-bold">Status</div>
        </div>
      </div>

      {/* Programme Schedule Downloads */}
      {settings.programFiles && settings.programFiles.length > 0 && (
        <div className="px-4 py-6">
          <h3 className="text-xl font-display font-bold text-news-black mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-news-gold" />
            Programme Schedule
          </h3>
          <div className="space-y-3">
            {settings.programFiles.map((programFile, index) => {
              const fileUrl =
                typeof programFile.file === 'string'
                  ? programFile.file
                  : getMediaUrl((programFile.file as MediaType).url)

              // Modern gradient colors
              const gradients = [
                'from-blue-500 via-blue-600 to-blue-700',
                'from-purple-500 via-purple-600 to-purple-700',
                'from-indigo-500 via-indigo-600 to-indigo-700',
                'from-violet-500 via-violet-600 to-violet-700',
                'from-cyan-500 via-cyan-600 to-cyan-700',
                'from-teal-500 via-teal-600 to-teal-700',
              ]

              return (
                <a
                  key={index}
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div
                    className={`bg-gradient-to-r ${gradients[index % gradients.length]} text-white rounded-lg shadow-lg p-4 flex items-center justify-between hover:shadow-xl hover:scale-[1.02] transition-all duration-200`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white bg-opacity-20 p-3 rounded-lg backdrop-blur-sm">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-display font-bold text-base">{programFile.title}</div>
                        <div className="text-xs opacity-80">View Schedule</div>
                      </div>
                    </div>
                    <Download className="w-5 h-5" />
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick Preview - Top 3 */}
      <div className="px-4">
        <h3 className="text-xl font-display font-bold text-news-black mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-news-gold" />
          Top 3 Leaders
        </h3>
        <div className="space-y-2">
          {participants
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map((participant, index) => (
              <div
                key={participant.id}
                className={`bg-white rounded-lg shadow p-4 flex items-center justify-between ${
                  index === 0 ? 'ring-2 ring-news-gold' : 'border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`text-2xl font-bold ${
                      index === 0
                        ? 'text-news-red'
                        : index === 1
                          ? 'text-yellow-600'
                          : 'text-green-600'
                    }`}
                  >
                    #{index + 1}
                  </div>
                  <div className="font-malayalam font-bold text-lg text-news-black">
                    {participant.name}
                  </div>
                </div>
                <div className="text-2xl font-mono font-bold text-news-red">
                  {participant.score}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* News Preview */}
      {(settings.flashNews || (settings.tickerNews && settings.tickerNews.length > 0)) && (
        <MobileNews flashNews={settings.flashNews} scrollNews={settings.tickerNews} />
      )}

      {/* Advertisement Section */}
      {settings.adImageUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="px-4 py-6"
        >
          <div className="bg-white rounded-lg shadow-xl overflow-hidden border-4 border-news-gold">
            <Media resource={settings.adImageUrl} size="100%" />
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default SectionHome
