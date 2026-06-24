---
id: valcr-score
title: "The Valcr Score"
sidebar_position: 3
description: "What the Valcr Score is, how it is calculated, why it should be trusted, and how to access it via the API. A 0-100 composite of merchant financial health."
keywords: [valcr score, merchant financial score, ecommerce financial health, benchmark score, underwriting score]
image: /img/valcr-social-card.png
---

# The Valcr Score

The Valcr Score is a **0–100 composite index** that measures a merchant's financial health relative to verified peers in their category and segment. It is not an absolute rating — it is a relative position within a distribution.

A score of 74 means the merchant outperforms approximately 74% of comparable businesses across five financial dimensions.

---

## Why it exists

Standalone financial metrics are hard to interpret in isolation. A 44% gross margin sounds solid — but is it? Compared to what? Relative to fast-fashion DTC brands at the same revenue tier, it's average. Relative to an electronics seller, it's exceptional.

The Valcr Score solves this by anchoring every metric to the actual distribution of that metric within a merchant's specific peer group. The result is a single number that communicates relative financial performance with enough precision to be useful for lending decisions, investor diligence, and operator benchmarking.

---

## How it's calculated

The Valcr Score is a **weighted average of five component scores**, each expressed as a percentile rank (0–100) within the merchant's peer group:

```
Valcr Score = weighted average of:

  Revenue Quality          × 25%
  Margin Health            × 25%
  Growth Trajectory        × 20%
  Customer Economics       × 20%
  Operational Efficiency   × 10%
```

### Revenue Quality (25%)

Evaluates the composition and reliability of the revenue base:
- **Recurring revenue share** — subscriptions and memberships signal predictable cash flow
- **Channel concentration risk** — overdependence on a single platform (e.g. 90% Amazon) reduces resilience
- **Net revenue retention** — where applicable (SaaS-adjacent models)
- **Revenue consistency** — volatility across the trailing period relative to peers

A merchant with 64% direct-channel revenue and meaningful recurring components scores well on quality regardless of absolute revenue size.

### Margin Health (25%)

Gross margin percentile within the specific segment, adjusted for category norms.

A 35% gross margin means something different for an electronics seller (above median) versus a beauty brand (well below median). The VCFS normalisation layer ensures margin figures are calculated identically across the peer group, making the comparison valid.

Operating margin and net margin contribute proportionally when VCFS completeness is ≥ 0.70.

### Growth Trajectory (20%)

Revenue growth rate (quarter-over-quarter and year-over-year) benchmarked against segment peers. A 15% QoQ growth rate might be strong in a mature retail category and average in a fast-growing health & wellness segment.

Unit growth (order volume, active customer growth) is incorporated as a leading indicator when revenue growth lags due to pricing changes.

### Customer Economics (20%)

The most predictive component for long-term business value:
- **LTV:CAC ratio** — lifetime value relative to acquisition cost, benchmarked within segment
- **Repeat purchase rate** vs. segment median
- **Cart abandonment rate** (inverted — lower is better)
- **Average order value trend**

A merchant with a 6:1 LTV:CAC ratio and 42% repeat purchase rate scores strongly on this component regardless of revenue or margin position.

### Operational Efficiency (10%)

Fulfilment quality and return economics, weighted lower because these are often partially outside the merchant's control (carrier-dependent, season-dependent):
- Refund/return rate (inverted — lower is better)
- Fulfilment rate (orders delivered on time)
- Average delivery time vs. category benchmark

---

## Grade bands

| Score | Grade | What it means |
|---|---|---|
| 90–100 | A+ | Top decile — exceptional relative to peers |
| 80–89 | A | Strong across all five dimensions |
| 70–79 | B+ | Above median, clear strengths |
| 60–69 | B | Solid fundamentals, 1–2 improvement areas |
| 50–59 | C+ | Mixed profile — some strengths, some gaps |
| 40–49 | C | Below median in multiple dimensions |
| Below 40 | D | Significant underperformance relative to peers |

---

## Why the Valcr Score should be trusted

### 1. The benchmark pool is real

The score is computed against verified data from real merchants — connected via OAuth (Shopify, Etsy) or submitted via authenticated VCFS uploads. It is not estimated from survey data, press releases, or industry reports.

As of Q4 2024, the benchmark pool contains over 16,000 ecommerce merchants across 5 categories and 20+ sub-segments.

### 2. The normalisation is consistent

Every merchant in the peer group has had their financial data normalised through the same VCFS pipeline with identical calculation methodology. Gross margin is calculated the same way for every merchant in the comparison set. This is the foundational requirement for any valid percentile ranking — without it, you're comparing numbers calculated differently.

### 3. The components are weighted on predictive value

The 25/25/20/20/10 weighting is based on analysis of which financial metrics correlate most strongly with sustained revenue growth and creditworthiness in ecommerce businesses. Revenue quality and margin health receive the highest weights because they are the most fundamental measures of business health. Operational efficiency is weighted lowest because it has the most noise from factors outside the merchant's control.

### 4. The score is transparent

The API response includes not just the composite score but every component score, every input metric, and the sample size of the peer group. There are no black boxes. If you disagree with a component, you can trace it back to the underlying data.

### 5. The score updates with new data

The Valcr Score is recalculated every time a new VCFS submission is processed. The benchmark pool it draws from updates quarterly. A score reflects the merchant's current position relative to the current state of the dataset — not a snapshot from 6 months ago.

---

## What it is not

**Not a credit score.** The Valcr Score does not incorporate repayment history, days outstanding, CCJs, or any credit bureau data. Lenders using Valcr combine the score with their own credit assessment — the Valcr Score provides peer-relative financial context that complements credit data, it does not replace it.

**Not a prediction.** The score reflects current performance relative to peers. It does not model future performance or predict default risk. A high Valcr Score merchant can still fail; a low score merchant can still succeed.

**Not static.** A score from 3 months ago is a historical data point. For underwriting and investment decisions, always request a fresh score via the API.

---

## Accessing the Valcr Score

The Valcr Score requires:
1. An Enterprise tier API key with the `score:read` scope
2. A merchant VCFS submission with a completeness score of at least **0.70**

```bash
GET https://api.valcr.site/data/v1/merchant/score
Authorization: Bearer vcr_live_your_key
```

```json
{
  "merchant_id":   "mer_01HXXXXXXXXXXXXXXXX",
  "valcr_score":   74,
  "grade":         "B+",
  "generated_at":  "2025-01-14T08:00:00Z",
  "components": {
    "revenue_quality":        { "score": 81, "weight": 0.25 },
    "margin_health":          { "score": 76, "weight": 0.25 },
    "growth_trajectory":      { "score": 68, "weight": 0.20 },
    "customer_economics":     { "score": 71, "weight": 0.20 },
    "operational_efficiency": { "score": 62, "weight": 0.10 }
  },
  "peer_percentile": 68.2,
  "peer_count":      842,
  "trend": {
    "prev_score": 70,
    "delta":      4,
    "direction":  "up"
  }
}
```

See the [Merchant API reference](/api/merchant#get-merchantscore) for the full response schema.

---

## Improving a Valcr Score

The score improves as the underlying financial metrics improve relative to peers. The highest-leverage actions for most merchants:

1. **Improve VCFS completeness first** — an incomplete VCFS submission produces a less accurate score. Increasing completeness from 0.60 to 0.85 often moves the score even before the underlying business improves, simply because more components can be calculated.

2. **Direct channel growth** — reducing marketplace dependency improves revenue quality, which carries a 25% weight.

3. **LTV:CAC optimisation** — the single metric with the largest typical spread between quartiles. Improving repeat purchase rate has an outsized impact on this component.

4. **Gross margin improvement** — reducing COGS as a percentage of revenue (via pricing, supplier negotiation, or mix shift) directly improves the highest-weighted component.

---

## Questions about the Score?

Email [support@valcr.site](mailto:support@valcr.site) with your merchant ID and specific questions about your score components.
