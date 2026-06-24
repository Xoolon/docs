---
slug: embedding-benchmarks-in-your-saas
title: How to Embed Commerce Benchmarks in Your SaaS Product
authors: [glen]
tags: [api, developers, saas, integration, product]
date: 2024-11-26
description: "How to integrate Valcr benchmark data into your SaaS product: Python and TypeScript integration patterns, caching strategy, and UI implementation guide."
keywords: [embed ecommerce benchmarks, benchmark api integration, saas benchmark feature, valcr api python, valcr api typescript]
image: /img/valcr-social-card.png
---

# How to Embed Commerce Benchmarks in Your SaaS Product

One of the most common features that ecommerce SaaS products get asked for — and one of the hardest to build well — is benchmarking. "How do my metrics compare to other businesses like mine?"

It's a simple question. Building an answer to it is not. You need a dataset of comparable businesses, a consistent normalisation methodology, regular updates, and enough sample depth per segment to produce credible distributions. Most SaaS companies decide the build cost isn't worth it and ship a chart with industry averages from a three-year-old report instead.

The Valcr API exists specifically to solve this. Here's how to integrate it.

<!--truncate-->

## The integration pattern

The core pattern is straightforward:

1. Your user's financial data lives in your platform (or you calculate it from transactions)
2. You call the Valcr API to get the benchmark distribution for their category and metric
3. You call the percentile endpoint to rank their specific value
4. You render the result — a chart, a badge, a scorecard, whatever fits your UI

You don't need to move user data to Valcr's servers unless you want to use the VCFS profile features. The benchmark endpoints are read-only lookups against the Valcr dataset — you bring the merchant's metric, Valcr tells you where it sits.

## Step 1: Create a server-side API key

Create a key with `benchmarks:read` and `segments:read` scopes in the [Console](https://console.valcr.site). Store it as an environment variable on your backend. Never expose it client-side.

```bash
VALCR_API_KEY=vcr_live_your_key_here
```

## Step 2: Build a benchmark lookup function

```python
# Python / FastAPI backend

import os, requests
from functools import lru_cache

VALCR_BASE = "https://api.valcr.site/data/v1"
VALCR_KEY  = os.environ["VALCR_API_KEY"]
HEADERS    = {"Authorization": f"Bearer {VALCR_KEY}"}

@lru_cache(maxsize=128)
def get_benchmark_distribution(category: str, metric: str, period: str = None):
    """Cache benchmark distributions — they update quarterly, not per-request."""
    params = {"category": category, "metric": metric}
    if period: params["period"] = period
    r = requests.get(f"{VALCR_BASE}/benchmarks", headers=HEADERS, params=params)
    r.raise_for_status()
    return r.json()["metrics"][metric]

def get_merchant_percentile(category: str, metric: str, value: float):
    r = requests.get(
        f"{VALCR_BASE}/benchmarks/percentile",
        headers=HEADERS,
        params={"category": category, "metric": metric, "value": value},
    )
    r.raise_for_status()
    return r.json()

# Usage in your route handler:
@app.get("/api/merchant/{merchant_id}/benchmark")
async def merchant_benchmark(merchant_id: str, metric: str = "gross_margin"):
    merchant = await db.get_merchant(merchant_id)
    merchant_value = merchant.calculate_metric(metric)  # your own calculation

    distribution = get_benchmark_distribution(merchant.category, metric)
    rank = get_merchant_percentile(merchant.category, metric, merchant_value)

    return {
        "metric":        metric,
        "merchant_value": merchant_value,
        "percentile":    rank["percentile"],
        "distribution":  distribution,
        "interpretation": rank["interpretation"],
    }
```

```typescript
// TypeScript / Next.js API route

const VALCR_BASE = "https://api.valcr.site/data/v1"
const HEADERS    = { Authorization: `Bearer ${process.env.VALCR_API_KEY}` }

// Cache with a simple in-memory map — distributions update quarterly
const distributionCache = new Map<string, { data: any; ts: number }>()
const CACHE_TTL = 6 * 60 * 60 * 1000  // 6 hours

async function getBenchmarkDistribution(category: string, metric: string) {
  const key = `${category}:${metric}`
  const cached = distributionCache.get(key)
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data

  const res = await fetch(
    `${VALCR_BASE}/benchmarks?category=${category}`,
    { headers: HEADERS }
  )
  const data = await res.json()
  const dist = data.metrics[metric]
  distributionCache.set(key, { data: dist, ts: Date.now() })
  return dist
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category") ?? "ecommerce"
  const metric   = searchParams.get("metric")   ?? "gross_margin"
  const value    = parseFloat(searchParams.get("value") ?? "0")

  const [distribution, rank] = await Promise.all([
    getBenchmarkDistribution(category, metric),
    fetch(`${VALCR_BASE}/benchmarks/percentile?category=${category}&metric=${metric}&value=${value}`, { headers: HEADERS })
      .then(r => r.json()),
  ])

  return Response.json({ distribution, rank })
}
```

## Step 3: Cache aggressively

Benchmark distributions update quarterly. Hitting the Valcr API on every page load for benchmark data is wasteful and unnecessary. Cache at the application layer:

- **Distribution data** (`/benchmarks`) — cache for 6–24 hours. The data doesn't change intra-day.
- **Percentile lookups** (`/benchmarks/percentile`) — cache per merchant, per metric, per period. Recalculate when the merchant's own metrics update.
- **Segment lists** (`/segments`) — cache for 24+ hours. New segments are added quarterly.

This also means your Valcr API quota goes almost entirely to percentile lookups (one per merchant metric update) rather than distribution fetches — making the economics of embedding benchmarks very favourable even at Developer tier.

## Step 4: Design the UI

The most effective benchmark visualisations are not pie charts. They are distribution charts with the merchant's position marked — showing where they sit, who they're near, and what the top quartile looks like.

A minimal implementation:

```tsx
// React component — benchmark position visualiser

function BenchmarkBar({ metric, merchantValue, distribution }) {
  const pct = (v: number) => `${(v * 100).toFixed(0)}%`
  const merchantPct = distribution.p50
    ? Math.min(Math.round((merchantValue / distribution.p90) * 90), 100)
    : 50

  return (
    <div className="benchmark-bar">
      <div className="bar-track">
        <div className="bar-zone p25-p75" style={{
          left:  pct(distribution.p25 / distribution.p90),
          width: pct((distribution.p75 - distribution.p25) / distribution.p90),
        }} />
        <div className="bar-median" style={{ left: pct(distribution.p50 / distribution.p90) }} />
        <div className="bar-merchant" style={{ left: `${merchantPct}%` }}>
          <span className="merchant-label">{pct(merchantValue)}</span>
        </div>
      </div>
      <div className="bar-labels">
        <span>p25: {pct(distribution.p25)}</span>
        <span>Median: {pct(distribution.p50)}</span>
        <span>p75: {pct(distribution.p75)}</span>
      </div>
    </div>
  )
}
```

The middle 50% (p25–p75) shaded, the median marked, the merchant's position as a pin. Users immediately understand where they sit without needing to read a number.

## What you don't need to build

Using the Valcr API for benchmarking means you don't have to:
- Recruit a benchmark panel of comparable businesses
- Design and maintain a data normalisation pipeline
- Decide how to handle outliers and sample size minimums
- Update the data every quarter
- Handle the methodology questions that users inevitably ask ("how was this calculated?")

The methodology is documented in the [VCFS schema guide](/guides/vcfs-schema) and [benchmark API reference](/api/benchmarks). Your users can read it. You didn't have to write it.

---

[Start with the Quickstart →](/quickstart) · [API key scopes reference →](/auth#scopes)
