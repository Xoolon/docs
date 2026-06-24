// src/pages/index.jsx — Valcr docs custom home page
// This replaces the default Docusaurus landing page

import React from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

const S = {
  bg:      '#080B10',
  surface: '#0D1929',
  card:    '#111827',
  border:  '#1E3054',
  text:    '#E8F4FF',
  text2:   '#8BA7C7',
  text3:   '#4A6480',
  accent:  '#4B9EFF',
  green:   '#34D399',
  mono:    '"JetBrains Mono", monospace',
  serif:   '"Playfair Display", serif',
  body:    '"Inter", sans-serif',
}

const QUICK_LINKS = [
  { label: 'Quickstart',     href: '/quickstart',     icon: '▶', desc: 'Make your first API call in 2 minutes' },
  { label: 'Authentication', href: '/auth',            icon: '⌗', desc: 'API keys, scopes, and security model' },
  { label: 'Benchmarks API', href: '/api/benchmarks',  icon: '↗', desc: 'Percentile distributions by category' },
  { label: 'VCFS Schema',    href: '/guides/vcfs-schema', icon: '⌥', desc: 'The financial data standard for commerce' },
  { label: 'XBRL Export',   href: '/api/xbrl',        icon: '⎘', desc: 'Structured financial export' },
  { label: 'Webhooks',       href: '/webhooks',        icon: '⌀', desc: 'Real-time event notifications' },
]

const ENDPOINTS = [
  { method: 'GET',  path: '/benchmarks',       scope: 'benchmarks:read', color: '#4B9EFF' },
  { method: 'GET',  path: '/benchmarks/percentile', scope: 'benchmarks:read', color: '#4B9EFF' },
  { method: 'GET',  path: '/merchant/vcfs',    scope: 'merchant:read',   color: '#34D399' },
  { method: 'POST', path: '/merchant/vcfs',    scope: 'merchant:write',  color: '#34D399' },
  { method: 'GET',  path: '/merchant/insights',scope: 'insights:read',   color: '#A78BFA' },
  { method: 'GET',  path: '/export/xbrl',      scope: 'export:read',     color: '#F59E0B' },
]

export default function Home() {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout title="Valcr API Documentation" description="Financial benchmark intelligence for commerce operators.">
      <div style={{ background: S.bg, minHeight: '100vh', fontFamily: S.body }}>

        {/* ── Hero ───────────────────────────────────────────────── */}
        <div style={{ padding: '72px 24px 64px', maxWidth: 900, margin: '0 auto' }}>
          <p style={{
            fontFamily: S.mono, fontSize: 10, color: S.text3,
            letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ display: 'block', width: 28, height: 1, background: S.text3 }} />
            API Documentation
          </p>
          <h1 style={{
            fontFamily:   S.serif,
            fontSize:     'clamp(32px, 5vw, 54px)',
            fontWeight:   500,
            lineHeight:   1.1,
            letterSpacing: '-0.02em',
            color:        S.text,
            marginBottom: 20,
          }}>
            Commerce intelligence,<br />
            served <span style={{ color: S.accent }}>programmatically.</span>
          </h1>
          <p style={{
            fontSize: 15, color: S.text2, lineHeight: 1.7,
            maxWidth: 580, marginBottom: 32,
          }}>
            The Valcr Data API gives you authenticated access to financial benchmark
            distributions, merchant VCFS profiles, peer comparisons, and XBRL exports —
            built on the canonical financial data standard for commerce.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/quickstart" style={{
              background: S.accent, color: '#fff',
              padding: '10px 20px', borderRadius: 4,
              fontFamily: S.mono, fontSize: 12, fontWeight: 600,
              textDecoration: 'none', letterSpacing: '.02em',
            }}>
              Get started →
            </Link>
            <a href="https://console.valcr.site" target="_blank" rel="noreferrer" style={{
              background: S.surface, color: S.text2, border: `1px solid ${S.border}`,
              padding: '10px 20px', borderRadius: 4,
              fontFamily: S.mono, fontSize: 12,
              textDecoration: 'none',
            }}>
              Open Console ↗
            </a>
          </div>
        </div>

        {/* ── Quick links grid ────────────────────────────────────── */}
        <div style={{
          borderTop: `1px solid ${S.border}`, borderBottom: `1px solid ${S.border}`,
          padding: '0 24px',
        }}>
          <div style={{
            maxWidth: 900, margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          }}>
            {QUICK_LINKS.map((link, i) => (
              <Link key={link.label} to={link.href} style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                padding: '20px 16px', textDecoration: 'none',
                borderRight: `1px solid ${S.border}`,
                borderBottom: i < QUICK_LINKS.length - 3 ? `1px solid ${S.border}` : 'none',
                transition: 'background .12s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = S.surface}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{
                  fontFamily: S.mono, fontSize: 16, color: S.accent,
                  flexShrink: 0, marginTop: 2,
                }}>{link.icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: S.text, marginBottom: 3 }}>
                    {link.label}
                  </p>
                  <p style={{ fontFamily: S.mono, fontSize: 10, color: S.text3, lineHeight: 1.5 }}>
                    {link.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Base URL + example ─────────────────────────────────── */}
        <div style={{ padding: '52px 24px', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

            {/* Base URL */}
            <div>
              <p style={{ fontFamily: S.mono, fontSize: 10, color: S.text3, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 14 }}>
                Base URL
              </p>
              <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 4, padding: '14px 16px', fontFamily: S.mono, fontSize: 13, color: S.accent }}>
                https://api.valcr.site/data/v1
              </div>
              <p style={{ fontSize: 11, color: S.text3, marginTop: 8, lineHeight: 1.6 }}>
                Console and auth endpoints (key management, billing) are at{' '}
                <span style={{ fontFamily: S.mono, color: S.text2 }}>https://api.valcr.site/api/v1</span>
              </p>
            </div>

            {/* Quick example */}
            <div>
              <p style={{ fontFamily: S.mono, fontSize: 10, color: S.text3, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 14 }}>
                Quick example
              </p>
              <pre style={{
                background: '#050709', border: `1px solid ${S.border}`,
                borderRadius: 4, padding: '14px 16px', margin: 0,
                fontFamily: S.mono, fontSize: 11, color: S.text2, lineHeight: 1.65,
                overflow: 'auto',
              }}>
{`curl "https://api.valcr.site/data/v1/benchmarks\\
  ?category=ecommerce" \\
  -H "Authorization: Bearer vcr_live_..."`}
              </pre>
            </div>
          </div>

          {/* Endpoints quick reference */}
          <div style={{ marginTop: 48 }}>
            <p style={{ fontFamily: S.mono, fontSize: 10, color: S.text3, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 16 }}>
              Available endpoints
            </p>
            <div style={{ background: S.surface, border: `1px solid ${S.border}`, borderRadius: 4, overflow: 'hidden' }}>
              {ENDPOINTS.map((ep, i) => (
                <div key={ep.path} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 16px',
                  borderBottom: i < ENDPOINTS.length - 1 ? `1px solid ${S.border}` : 'none',
                }}>
                  <span style={{
                    fontFamily: S.mono, fontSize: 10, fontWeight: 700,
                    padding: '2px 7px', borderRadius: 2, minWidth: 36, textAlign: 'center',
                    background: `${ep.color}14`, color: ep.color,
                  }}>
                    {ep.method}
                  </span>
                  <span style={{ fontFamily: S.mono, fontSize: 12, color: S.text, flex: 1 }}>
                    {ep.path}
                  </span>
                  <span style={{
                    fontFamily: S.mono, fontSize: 9, color: S.text3,
                    background: S.card, padding: '2px 7px', borderRadius: 2,
                    border: `1px solid ${S.border}`,
                  }}>
                    {ep.scope}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'right', marginTop: 10 }}>
              <Link to="/api/overview" style={{ fontFamily: S.mono, fontSize: 11, color: S.accent, textDecoration: 'none' }}>
                Full API reference →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}
