---
id: security
title: "Security"
sidebar_position: 6
description: "How Valcr secures your data: API key hashing, TLS, data encryption, GDPR compliance, and responsible disclosure."
keywords: [valcr security, api security, data encryption, gdpr, api key hashing]
image: /img/valcr-social-card.png
---

# Security

Security is a foundational requirement for a financial data platform, not an afterthought. This page explains how Valcr handles your data, how API keys are secured, and how to report a vulnerability.

---

## API key security

### How keys are stored

When you create an API key, Valcr:

1. Generates a cryptographically secure random key (`secrets.token_urlsafe(36)` — 287 bits of entropy)
2. Displays it to you **once**
3. Stores only the SHA-256 hash of the key in our database
4. Discards the raw key immediately

We never store the raw API key. If you lose it, it must be rotated — there is no "show me my key" feature because there is no copy to show.

### Why SHA-256 and not bcrypt

bcrypt is appropriate for passwords because passwords have low entropy — human-chosen strings are susceptible to dictionary attacks.

API keys with 287 bits of entropy are not. The computation overhead of bcrypt on every authenticated API request (which requires re-hashing the key on each call) introduces latency with no security benefit. SHA-256 is fast, deterministic, and cryptographically appropriate for high-entropy tokens.

### Validation is timing-safe

All key hash comparisons use `hmac.compare_digest()` rather than `==`. This prevents timing-based enumeration attacks that could allow an attacker to probe whether a specific key hash exists in the database.

### Keys are scoped

Every key carries a set of permission scopes that restrict which API endpoints it can access. A key with only `benchmarks:read` cannot access merchant data even if it's a valid key. The scope check happens before any data is returned.

---

## Transport security

All Valcr API endpoints are served over **TLS 1.3** with modern cipher suites. HTTP is not supported — all HTTP requests are redirected to HTTPS.

We enforce **HSTS** (HTTP Strict Transport Security) with a 1-year max-age and includeSubDomains, which prevents downgrade attacks.

---

## Data handling

### What data Valcr stores

- Your merchant VCFS submissions (financial data you explicitly provide)
- API request logs (endpoint, status code, latency, key prefix — no request/response bodies)
- Usage counts and quota tracking
- Billing information (via Paystack — we store only a Paystack customer reference, not raw card data)

### What Valcr does not store

- Raw API keys (only SHA-256 hashes)
- Full request bodies or response bodies in logs
- Shopify/Etsy OAuth tokens in plaintext (tokens are encrypted at rest)

### OAuth token handling

When you connect a store via Shopify or Etsy OAuth, the access token Valcr receives is:
- Encrypted at rest using AES-256-GCM before database storage
- Used only for periodic data sync (not for any purpose you haven't authorised)
- Revocable at any time by disconnecting the store in your dashboard or revoking access directly in Shopify/Etsy

### Benchmark data aggregation

Individual merchant data is never exposed in the API. Benchmark distributions are computed as statistical aggregates (percentiles) from pools of 30+ merchants per segment minimum. No individual merchant's data is identifiable from benchmark responses.

---

## Compliance

### GDPR

Valcr acts as a data processor for merchant financial data you submit. We offer:
- Data export (your VCFS data via the API at any time)
- Data deletion (within 30 days of account closure)
- Data processing agreements (DPA) on request for Enterprise customers

For GDPR requests, contact [support@valcr.site](mailto:support@valcr.site).

### CCPA

Valcr does not sell personal data. The `valcr_optout` cookie is set when a user opts out of analytics — this is respected across all tracking.

### PCI DSS

Valcr does not handle payment card data directly. All card processing is handled by Paystack, which is PCI DSS Level 1 compliant.

---

## Security headers

The Valcr API includes the following security headers on all responses:

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Cache-Control` | `no-store, private` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |

---

## Security best practices for integrators

- Store API keys in environment variables, never in code or version control
- Use test keys (`vcr_test_*`) for all development and CI environments
- Create keys with minimum required scopes
- Rotate keys every 90 days as a routine hygiene practice
- Configure a `key.rotated` webhook to alert your team when rotation occurs
- Never log the full `Authorization` header value

---

## Responsible disclosure

If you discover a security vulnerability in Valcr's API, dashboard, or infrastructure, please report it responsibly:

**Email:** [support@valcr.site](mailto:support@valcr.site)  
**Subject line:** `[SECURITY] <brief description>`

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any relevant proof-of-concept (avoid accessing data beyond what's necessary to demonstrate the issue)

We aim to acknowledge all security reports within 24 hours and provide a resolution timeline within 72 hours for critical issues.

We do not currently operate a formal bug bounty program, but we recognise responsible disclosures publicly (with your permission) and will work with you on appropriate acknowledgement.

Please do not publicly disclose vulnerabilities before we've had a chance to address them.
