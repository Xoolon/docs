---
slug: introducing-valcr-data-api
title: Introducing the Valcr Data API
authors: [glen]
tags: [product, announcement, api, benchmarks]
date: 2025-01-14
description: "Valcr opens API access to its financial benchmark intelligence platform. Read about the Data API, VCFS normalisation layer, and how to get started."
keywords: [valcr api launch, commerce benchmark api, vcfs api, ecommerce financial intelligence]
image: /img/valcr-social-card.png
---

# Introducing the Valcr Data API

For the past year, we've been building something that has needed to exist for a long time: a financial data infrastructure layer for digital commerce that actually meets the standard that institutions require.

Today, we're opening API access.

<!--truncate-->

## What the API gives you

The Valcr Data API serves the same benchmark intelligence that powers the Valcr platform — but programmatically, via authenticated HTTP endpoints, into whatever system you're building or operating.

That means:

- **Benchmark percentiles** — gross margin, revenue growth, LTV:CAC, cart abandonment, AOV, refund rate, and more, broken down by category and segment, updated quarterly
- **Merchant VCFS profiles** — submit and retrieve structured financial data in the Valcr Commerce Financial Schema
- **Peer comparisons** — rank a merchant's metrics against their actual peer group, not an industry average from a year-old report
- **AI-generated insights** — causal narratives that explain *why* a metric sits where it does, not just *where* it sits
- **XBRL export** — structured, taxonomy-tagged financial documents for audit, filing, and ERP integration

All of it behind a single base URL: `https://api.valcr.site/data/v1`

## Who this is for

We built this for three audiences:

**Lenders and underwriters** who need to contextualise a merchant's financials within their real peer group — not a national average, but a p25/p50/p75 distribution computed from verified data from comparable businesses in the same segment.

**SaaS platforms and fintech developers** who want to embed benchmark intelligence inside their own products without building or maintaining the underlying dataset. You plug in the API; your users see the intelligence.

**Commerce operators and their teams** who want programmatic access to their own VCFS profile, their Valcr Score, and their benchmark position — integrated into internal dashboards, underwriting pipelines, or investor reporting tools.

## How it works

Authentication is via bearer tokens. Create an API key in the [Console](https://console.valcr.site), assign the scopes your integration needs, and you're making requests in under two minutes.

```bash
curl -X GET "https://api.valcr.site/data/v1/benchmarks?category=ecommerce" \
  -H "Authorization: Bearer vcr_live_your_key_here"
```

```json
{
  "category": "ecommerce",
  "period": "2024-Q4",
  "metrics": {
    "gross_margin":   { "p25": 0.28, "p50": 0.41, "p75": 0.58, "p90": 0.67 },
    "revenue_growth": { "p25": 0.04, "p50": 0.12, "p75": 0.26, "p90": 0.48 }
  },
  "sample_size": 4812
}
```

The keys are scoped. You choose the access level you need — read-only benchmark access at $29/month, or full merchant intelligence with XBRL export at Enterprise tier. Every key is hashed server-side immediately after creation; we never store the raw value.

## The VCFS layer

Everything in the API is built on the Valcr Commerce Financial Schema — a canonical data model that maps the financial structures from Shopify, Amazon, WooCommerce, QuickBooks, and public filings into a single consistent representation.

VCFS is the reason the benchmarks are comparable. Without normalisation at the schema level, you're comparing numbers that were calculated differently, for different time periods, with different field definitions. The value of benchmark data scales directly with the rigour of the normalisation underneath it.

You can read the full [VCFS schema documentation here](/guides/vcfs-schema).

## What's next

The dataset grows every month. Every new connected store, every public filing, every data partnership deepens the benchmark distributions and makes the percentiles more credible. That compounding is the fundamental thesis of the platform.

In the near term:
- Shopify and Amazon SP-API direct integrations for automated VCFS population
- Monthly benchmark updates (currently quarterly)
- Expanded geography coverage beyond US and UK
- Enterprise SLA and dedicated support tier

[Create a free Console account](https://console.valcr.site) and make your first request today. The [Quickstart guide](/quickstart) will get you there in under two minutes.

---

Questions or integration support: [api@valcr.site](mailto:api@valcr.site)
