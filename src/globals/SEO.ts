import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

export const SEO: GlobalConfig = {
  slug: 'seo',
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General SEO',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              defaultValue: 'അറബിക് അധ്യാപക സംഗമം 2026',
              admin: {
                description: 'The name of your site (used in title tags and meta tags)',
              },
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              required: true,
              defaultValue:
                'സംസ്ഥാന അറബിക് അധ്യാപക സംഗമവും കലാസാഹിത്യ മത്സരങ്ങളും 2026 - തത്സമയ സ്കോറുകളും അപ്ഡേറ്റുകളും',
              admin: {
                description: 'A brief description of your site (used in meta description tags)',
              },
            },
            {
              name: 'siteKeywords',
              type: 'textarea',
              admin: {
                description: 'Comma-separated keywords for SEO (optional)',
                placeholder:
                  'arabic teachers meet, അറബിക് അധ്യാപക സംഗമം, കലാസാഹിത്യ മത്സരങ്ങൾ, kerala education, live scores',
              },
            },
            {
              name: 'siteUrl',
              type: 'text',
              required: true,
              admin: {
                description: 'The full URL of your site (e.g., https://sargamela.com)',
                placeholder: 'https://example.com',
              },
            },
          ],
        },
        {
          label: 'Favicon & Images',
          fields: [
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Favicon for the site (32x32 or 16x16 .ico file). This will override the default favicon.',
              },
            },
            {
              name: 'faviconSvg',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'SVG version of favicon for modern browsers (optional)',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description:
                  'Default Open Graph image for social media sharing (recommended: 1200x630px)',
              },
            },
            {
              name: 'appleTouchIcon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Apple touch icon for iOS devices (recommended: 180x180px)',
              },
            },
          ],
        },
        {
          label: 'Social Media',
          fields: [
            {
              name: 'ogTitle',
              type: 'text',
              admin: {
                description:
                  'Open Graph title (leave empty to use site name). Used when sharing on Facebook, LinkedIn, etc.',
                placeholder: 'Defaults to site name if empty',
              },
            },
            {
              name: 'ogDescription',
              type: 'textarea',
              admin: {
                description:
                  'Open Graph description (leave empty to use site description). Used when sharing on social media.',
                placeholder: 'Defaults to site description if empty',
              },
            },
            {
              name: 'twitterCard',
              type: 'select',
              defaultValue: 'summary_large_image',
              options: [
                {
                  label: 'Summary with Large Image',
                  value: 'summary_large_image',
                },
                {
                  label: 'Summary',
                  value: 'summary',
                },
              ],
              admin: {
                description: 'Twitter card type for sharing on X/Twitter',
              },
            },
            {
              name: 'twitterHandle',
              type: 'text',
              admin: {
                description: 'Twitter/X handle (without @)',
                placeholder: 'yourusername',
              },
            },
            {
              name: 'twitterSite',
              type: 'text',
              admin: {
                description: 'Twitter/X site handle (without @)',
                placeholder: 'yoursitename',
              },
            },
          ],
        },
        {
          label: 'Advanced',
          fields: [
            {
              name: 'themeColor',
              type: 'text',
              defaultValue: '#dc2626',
              admin: {
                description:
                  'Theme color for mobile browser chrome (hex color code, e.g., #dc2626)',
              },
            },
            {
              name: 'robots',
              type: 'select',
              hasMany: true,
              defaultValue: ['index', 'follow'],
              options: [
                { label: 'Index', value: 'index' },
                { label: 'No Index', value: 'noindex' },
                { label: 'Follow', value: 'follow' },
                { label: 'No Follow', value: 'nofollow' },
              ],
              admin: {
                description: 'Control how search engines index your site',
              },
            },
            {
              name: 'googleSiteVerification',
              type: 'text',
              admin: {
                description: 'Google Search Console verification code',
                placeholder: 'Enter verification code from Google Search Console',
              },
            },
            {
              name: 'customHeadScripts',
              type: 'textarea',
              admin: {
                description:
                  'Custom scripts or meta tags to inject in <head> (e.g., analytics, verification tags)',
                placeholder: '<script>/* your custom script */</script>',
              },
            },
          ],
        },
      ],
    },
  ],
}

export default SEO
