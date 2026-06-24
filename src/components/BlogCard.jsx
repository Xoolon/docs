// src/components/BlogListPage.jsx
// Swizzle this into Docusaurus to override the default blog listing UI.
// In docusaurus.config.js this is already wired via theme: { customCss }
// For full swizzle: npx docusaurus swizzle @docusaurus/theme-classic BlogListPage --eject

import React from 'react'
import Link from '@docusaurus/Link'
import { useBlogPost } from '@docusaurus/plugin-content-blog/client'

// Tag color map — mirrors the Valcr console badge system
const TAG_COLORS = {
  product:       '#4B9EFF',
  announcement:  '#34D399',
  api:           '#4B9EFF',
  benchmarks:    '#A78BFA',
  data:          '#A78BFA',
  vcfs:          '#F59E0B',
  infrastructure:'#34D399',
  security:      '#FF6B6B',
  engineering:   '#F59E0B',
  saas:          '#4B9EFF',
  ecommerce:     '#A78BFA',
  strategy:      '#34D399',
}

function tagColor(tag) {
  return TAG_COLORS[tag.toLowerCase()] || '#4A6480'
}

export function BlogCard({ post }) {
  const { title, description, date, permalink, authors, tags, readingTime } = post
  const author    = authors?.[0]
  const tagList   = tags?.slice(0, 3) || []
  const dateStr   = new Date(date).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <Link to={permalink} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background:    '#0D1929',
        border:        '1px solid #1E3054',
        borderRadius:  4,
        padding:       '24px 24px 20px',
        transition:    'border-color .15s, background .15s',
        cursor:        'pointer',
        height:        '100%',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#2A4070'; e.currentTarget.style.background = '#111827' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E3054'; e.currentTarget.style.background = '#0D1929' }}
      >
        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
          {tagList.map(tag => (
            <span key={tag.label} style={{
              fontFamily:     'JetBrains Mono, monospace',
              fontSize:       9,
              fontWeight:     600,
              letterSpacing:  '.06em',
              textTransform:  'lowercase',
              padding:        '2px 7px',
              borderRadius:   2,
              background:     `${tagColor(tag.label)}14`,
              color:          tagColor(tag.label),
              border:         `1px solid ${tagColor(tag.label)}28`,
            }}>
              {tag.label}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily:   '"Playfair Display", serif',
          fontSize:     18,
          fontWeight:   500,
          lineHeight:   1.3,
          color:        '#E8F4FF',
          marginBottom: 10,
          letterSpacing: '-0.01em',
        }}>
          {title}
        </h2>

        {/* Excerpt */}
        {description && (
          <p style={{
            fontSize:     12,
            color:        '#4A6480',
            lineHeight:   1.75,
            marginBottom: 16,
            display:      '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow:     'hidden',
          }}>
            {description}
          </p>
        )}

        {/* Meta */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          paddingTop:     12,
          borderTop:      '1px solid #1E3054',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {author && (
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize:   10,
                color:      '#4B9EFF',
                letterSpacing: '.04em',
              }}>
                {author.name}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {readingTime && (
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#4A6480' }}>
                {Math.ceil(readingTime)} min
              </span>
            )}
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#4A6480' }}>
              {dateStr}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BlogCard
