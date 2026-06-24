---
slug: what-is-vcfs
title: "VCFS: Why Commerce Needs a Financial Data Standard"
authors: [glen]
tags: [vcfs, data, benchmarks, infrastructure]
date: 2025-01-07
description: "The Valcr Commerce Financial Schema (VCFS) explained: why commerce needs a financial data standard, how it maps to XBRL, and what it enables."
keywords: [vcfs, valcr commerce financial schema, ecommerce data standard, financial data normalisation, xbrl ecommerce]
image: /img/valcr-social-card.png
---

# VCFS: Why Commerce Needs a Financial Data Standard

The ecommerce industry produces enormous volumes of financial data every day. Hundreds of millions of transactions. Revenue figures, margin data, customer counts, return rates, fulfilment metrics.

The problem is not the volume. The problem is that none of it speaks the same language.

<!--truncate-->

## The fragmentation problem

Ask ten ecommerce operators what their gross margin is and you will get ten different answers — not because their businesses are different, but because they calculated it differently.

Some include shipping as cost of goods. Some don't. Some report net revenue after returns; others report gross. Some count a customer as "active" if they've purchased in the last 90 days; others use 12 months. Cart abandonment rate means something slightly different in every analytics platform that reports it.

This isn't a data problem. It's a schema problem. There is no agreed standard for what these numbers mean and how they should be calculated — so any comparison across merchants is, at best, approximate.

For an operator benchmarking their business, this is inconvenient. For a lender underwriting a merchant, it is a risk. For an investor evaluating a portfolio company against its peers, it quietly degrades every decision they make.

## What VCFS does

The Valcr Commerce Financial Schema is a canonical data model that maps every significant financial metric in ecommerce to a single, precisely defined field with a documented calculation methodology.

Every record that enters Valcr — from a connected Shopify store, an Amazon Seller Central account, an SEC filing, a Companies House submission, or a manual upload — is normalised to the same structure.

The same field names. The same calculation logic. The same confidence score.

```json
{
  "revenue": {
    "gross_revenue":  480000,
    "net_revenue":    432000,
    "currency":       "USD"
  },
  "margins": {
    "gross_margin":     0.52,
    "operating_margin": 0.14,
    "net_margin":       0.09
  },
  "customers": {
    "active_customers":          3840,
    "average_order_value":       125,
    "customer_ltv":              310,
    "customer_acquisition_cost": 48,
    "cart_abandonment_rate":     0.66,
    "repeat_purchase_rate":      0.38
  }
}
```

The definitions matter. VCFS specifies:

- `gross_margin` = `(net_revenue - COGS) / net_revenue` — not revenue minus all costs, not including shipping as COGS unless it's a core fulfilment cost
- `active_customers` = unique customers with at least one order in the reporting period — not monthly actives, not email list size
- `cart_abandonment_rate` = `abandoned_carts / initiated_carts` where "initiated" means at least one item added — not page views on the cart

These distinctions sound pedantic. In practice, they are the difference between a benchmark that means something and a number that sounds authoritative but is actually noise.

## Why XBRL

VCFS maps directly to XBRL taxonomy elements. This is not an accident.

XBRL (eXtensible Business Reporting Language) is the global standard for structured financial data exchange — the format used by the SEC, Companies House, and financial regulators in over 50 jurisdictions. When a company files with the SEC, the data is tagged in XBRL so systems can automatically process and compare it without parsing prose documents.

By anchoring VCFS to XBRL, Valcr makes it possible to:
- Export merchant financial data as a standards-compliant XBRL document for regulatory submission or audit
- Compare ecommerce operator data directly against public company filings in the same taxonomy
- Integrate into ERP and accounting systems that already speak XBRL

The [XBRL export endpoint](/api/xbrl) takes a merchant's VCFS submission and returns a fully tagged XBRL instance document. Validated against our published taxonomy. Readable by any XBRL processor.

## The benchmark value chain

The reason VCFS matters for benchmarking specifically is this: the value of a percentile distribution is entirely dependent on the consistency of the underlying data.

If your benchmark says the median gross margin for ecommerce fashion businesses is 44%, that number is only useful if every business in the sample calculated gross margin the same way. If half of them included fulfilment costs and half didn't, the 44% is a blend of two different things — and benchmarking against it tells you almost nothing.

VCFS eliminates that uncertainty. Every merchant in the Valcr benchmark pool has had their data normalised to the same schema with the same calculation rules. The p50 means the median of businesses where gross margin was calculated identically. That's what makes it a useful number.

## Getting started with VCFS

If you're a developer integrating Valcr into a platform, start with the [VCFS Schema guide](/guides/vcfs-schema) — it documents every field, the calculation methodology, and the completeness scoring system that indicates how much of the schema a given merchant submission covers.

If you're an operator, the completeness score is worth understanding. VCFS submissions are scored 0–1. Higher completeness unlocks more granular benchmarking, AI insights, and the Valcr Score composite. A minimum viable submission (net revenue + gross margin) scores around 0.30. A fully populated profile with customer economics and channel breakdown scores above 0.85 and unlocks XBRL export.

The schema is open. The benchmark data that results from it is proprietary — and becomes more valuable with every additional record that enters the normalisation pipeline.

---

Read the full [VCFS schema documentation →](/guides/vcfs-schema)
