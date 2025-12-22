'use client'

import React from 'react'
import { Mail, Phone, Globe, Facebook, Instagram, Youtube } from 'lucide-react'
import { Setting } from '@/payload-types'

interface FooterProps {
  organizerName?: string
  contactEmail?: string
  contactPhone?: string
  socialLinks?: Setting['socialLinks']
}

export const Footer: React.FC<FooterProps> = ({
  organizerName,
  contactEmail,
  contactPhone,
  socialLinks,
}) => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="w-5 h-5" />
      case 'instagram':
        return <Instagram className="w-5 h-5" />
      case 'youtube':
        return <Youtube className="w-5 h-5" />
      case 'website':
        return <Globe className="w-5 h-5" />
      default:
        return <Globe className="w-5 h-5" />
    }
  }

  const getSocialLabel = (platform: string) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1)
  }

  return (
    <footer className="bg-gradient-to-b from-news-dark to-black text-white py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Organizer Name */}
        {organizerName && (
          <div className="text-center">
            <h3 className="text-2xl font-malayalam font-bold text-news-gold mb-2">
              {organizerName}
            </h3>
          </div>
        )}

        {/* Contact Information */}
        {(contactEmail || contactPhone) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-2 hover:text-news-gold transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{contactEmail}</span>
              </a>
            )}
            {contactPhone && (
              <a
                href={`tel:${contactPhone}`}
                className="flex items-center gap-2 hover:text-news-gold transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{contactPhone}</span>
              </a>
            )}
          </div>
        )}

        {/* Social Links */}
        {socialLinks && socialLinks.length > 0 && (
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-news-red hover:bg-news-gold rounded-lg transition-colors"
                aria-label={getSocialLabel(link.platform)}
              >
                {getSocialIcon(link.platform)}
                <span className="text-sm font-semibold">{getSocialLabel(link.platform)}</span>
              </a>
            ))}
          </div>
        )}

        {/* Copyright */}
        <div className="text-center text-xs text-gray-400 border-t border-gray-700 pt-4">
          <p>
            © {new Date().getFullYear()} {organizerName || 'Sargamela'}. All rights reserved.
          </p>
          <p className="mt-1">
            Powered by{' '}
            <a
              href="https://elabins.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-news-gold hover:underline"
            >
              elabins.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
