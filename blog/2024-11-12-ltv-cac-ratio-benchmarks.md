---
slug: ltv-cac-ratio-benchmarks
title: "LTV:CAC Benchmarks: What the Ratio Actually Means"
authors: [valcr_team]
tags: [benchmarks, data, ltv, cac, customer-economics]
date: 2024-11-12
description: "LTV:CAC ratio benchmarks by ecommerce category from Q4 2024 Valcr data. The 3:1 myth debunked — what the actual distributions show."
keywords: [ltv cac benchmark, ltv cac ratio ecommerce, customer economics benchmark, ecommerce ltv cac 2024]
image: /img/valcr-social-card.png
---

# LTV:CAC Benchmarks: What the Ratio Actually Means

The "3:1 LTV:CAC is healthy" benchmark has been repeated in enough blog posts and pitch deck templates that it has taken on the quality of received wisdom. Raise a VC round and someone will compare your ratio to 3:1. Apply for revenue-based financing and the underwriter will check it.

The problem: that number didn't come from a distribution. It came from a SaaS heuristic from the early 2010s, applied to a subscription business model, and has since been cargo-culted onto every business model in the internet economy regardless of whether it makes sense.

Here is what the actual data shows.

<!--truncate-->

## First: how Valcr calculates LTV:CAC

VCFS defines these fields precisely because imprecision makes the ratio meaningless:

**Customer LTV** = projected net revenue from a customer over their lifetime with the business. Valcr uses a cohort-based calculation where available: `average_order_value × purchase_frequency × gross_margin × (1 / churn_rate)`. Where churn data is unavailable, a simplified version using trailing 12-month repeat purchase rates is used, with a confidence score adjustment applied to the benchmark.

**Customer Acquisition Cost** = total marketing and sales spend in the period divided by new customers acquired. "Total" means all paid channels, all agency fees, all content production costs attributed to acquisition. Not just ad spend.

The ratio = `customer_ltv / customer_acquisition_cost`.

If your platform calculates these differently, your ratio is not comparable to the benchmark. This is not a criticism — it is a measurement problem that VCFS exists to solve.

## What the data shows

From the Q4 2024 Valcr dataset, LTV:CAC ratio by ecommerce category:

| Segment | p25 | p50 | p75 | p90 | Notes |
|---|---|---|---|---|---|
| Beauty & Personal Care | 3.8 | 6.2 | 9.4 | 14.1 | Highest replenishment rates |
| Health & Wellness | 3.2 | 5.4 | 8.1 | 12.0 | Subscription uplift in supplement sub-segment |
| Pet supplies | 3.1 | 5.1 | 7.8 | 11.6 | High repeat purchase frequency |
| Fashion & Apparel | 1.8 | 3.1 | 4.9 | 7.2 | Wide variance; depends heavily on return rate |
| Home & Garden | 1.6 | 2.8 | 4.4 | 6.8 | Lower purchase frequency compresses LTV |
| Electronics & Tech | 1.2 | 2.1 | 3.4 | 5.1 | Low repeat rate; high per-unit value |
| Food & Beverage | 2.9 | 4.8 | 7.2 | 10.4 | Consumable replenishment dominates |

The ecommerce-wide p50 is **3.8:1** — above the 3:1 baseline. But that aggregate masks enormous variation across categories.

## The 3:1 myth in context

A fashion brand with a 3.1:1 LTV:CAC ratio is at the **median for its category**. That is not great — it is average. A health & wellness brand with a 3.1:1 ratio is in the **bottom quartile**. The same number means opposite things.

This is exactly why context-free benchmarks are dangerous. The 3:1 heuristic was derived from SaaS subscription businesses with predictable churn and no inventory. It has been applied as a universal standard to businesses where:

- Repeat purchase rates vary from 8% (one-time gift electronics) to 62% (pet food)
- COGS varies from 18% (software subscription) to 72% (commodity electronics)
- Customer lifecycle varies from 14 months (fast fashion) to 8+ years (premium pet supply)

A 3:1 ratio for a consumables brand with 55% gross margin and 52% repeat purchase rate is a sign of a broken acquisition funnel. A 3:1 ratio for a premium furniture brand where customers buy once every five years is structurally reasonable.

## What a good ratio looks like by model

**High-replenishment consumables** (beauty, pet, F&B): The benchmark should be 5:1 or above. These categories have the economics to support high LTV — high gross margin, frequent repeat purchases, predictable consumption cycles. A sub-4:1 ratio in these categories usually indicates an acquisition efficiency problem or a retention problem. Both are fixable.

**Fashion and apparel**: 3:1 is roughly median. Optimise for repeat purchase rate (which is the main LTV lever in this category) before assuming an acquisition problem. A fashion brand at 2.5:1 that improves repeat purchase rate from 28% to 38% will see a meaningful ratio improvement without touching acquisition costs.

**Electronics**: 2:1 can be healthy. The category is structurally different — per-unit revenue is high but repeat frequency is low. A consumer electronics brand at 2.1:1 is at the median and should not feel pressure to match a benchmark designed for a consumables business.

**Home and garden**: 2.5:1 is reasonable given purchase frequency. The LTV uplift opportunity is usually cross-category (furniture → accessories → tools) rather than repeat purchase of the same SKU.

## Accessing LTV:CAC benchmarks via API

```python
import requests

# Get the LTV:CAC distribution for a segment
r = requests.get(
    "https://api.valcr.site/data/v1/benchmarks",
    headers={"Authorization": "Bearer vcr_live_your_key"},
    params={"category": "ecommerce", "segment": "beauty"},
)
metrics = r.json()["metrics"]
ltv_cac = metrics.get("ltv_cac_ratio")
print(f"Beauty LTV:CAC p50: {ltv_cac['p50']:.1f}x, p75: {ltv_cac['p75']:.1f}x")

# Rank a specific merchant's LTV:CAC
r2 = requests.get(
    "https://api.valcr.site/data/v1/benchmarks/percentile",
    headers={"Authorization": "Bearer vcr_live_your_key"},
    params={
        "metric":   "ltv_cac_ratio",
        "value":    5.8,
        "category": "ecommerce",
        "segment":  "beauty",
    },
)
print(f"Merchant is at the {r2.json()['percentile']:.0f}th percentile")
```

## The number to watch alongside LTV:CAC

LTV:CAC in isolation is incomplete. The payback period — how many months of gross margin it takes to recover the acquisition cost — is equally important for cash flow management.

A 6:1 LTV:CAC ratio with a 36-month payback period is a cash flow problem even if the unit economics eventually work. A 3:1 ratio with a 9-month payback is often more operationally sound.

Payback period = `CAC / (AOV × gross_margin × purchase_frequency_per_month)`

The Valcr benchmark dataset includes payback period distributions within the customer economics metric set. At median for ecommerce broadly: 11 months. Top quartile: under 7 months. Bottom quartile: over 18 months.

---

*Data from the Valcr Q4 2024 benchmark pool. All calculations use VCFS-normalised LTV and CAC methodology.*

[Access customer economics benchmarks →](/api/benchmarks) · [VCFS field definitions →](/guides/vcfs-schema#customers-object)
