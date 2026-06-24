---
slug: how-valcr-score-works
title: How the Valcr Score Works
authors: [glen]
tags: [valcr-score, benchmarks, underwriting, product]
date: 2024-12-18
description: "How the Valcr Score is constructed: five components, weightings, grade bands, and what the composite tells you that individual metrics don't."
keywords: [valcr score, ecommerce financial score, merchant score, commerce financial health]
image: /img/valcr-social-card.png
---

# How the Valcr Score Works

A single number summarising a merchant's financial health is a dangerous thing if constructed carelessly. It can flatten important nuance, reward the wrong behaviours, or simply be gamed.

The Valcr Score was designed with that danger front of mind. Here's exactly how it's constructed — and why.

<!--truncate-->

## What the score is

The Valcr Score is a 0–100 composite that summarises a merchant's financial performance relative to their peer group in five dimensions. It is **not** an absolute measure of business quality. It is a relative measure — a percentile-anchored position within a defined comparison group.

A score of 74 means: across these five dimensions, this merchant outperforms approximately 74% of comparable businesses in the same category and segment.

That framing matters. A score of 74 for a $500K/year fashion DTC brand and a score of 74 for a $10M/year marketplace operator are not comparable — but both say something precise about where each business sits within its actual peer group.

## The five components

```
Valcr Score = weighted average of 5 component scores

Revenue Quality          25%
Margin Health            25%
Growth Trajectory        20%
Customer Economics       20%
Operational Efficiency   10%
```

### Revenue Quality (25%)

Evaluates the composition and reliability of the revenue base:
- Recurring revenue share (subscription, membership, replenishment)
- Channel concentration risk (overdependence on a single platform)
- Net revenue retention where applicable
- Revenue consistency across the trailing period

A business with 60% direct-channel revenue, 20% Amazon, and meaningful subscription revenue scores higher on revenue quality than one that is 90% Amazon with no recurring component — even if the gross numbers are identical. The former is more defensible.

### Margin Health (25%)

Gross margin percentile within peer group, adjusted for category norms. A 35% gross margin means something very different for an electronics seller (above median) than for a beauty brand (well below median). VCFS normalisation ensures these comparisons are valid.

Operating margin and net margin contribute when the data is available with sufficient confidence score (≥ 0.7 on the VCFS completeness scale).

### Growth Trajectory (20%)

Revenue growth rate (QoQ and YoY) benchmarked against category peers. A 15% YoQ growth rate might be strong for a mature retail category and weak for an early-stage DTC brand growing in a fast-moving segment. The benchmark distribution makes this contextual.

Unit growth (order volume, SKU count expansion) is incorporated where available as a leading indicator when revenue growth lags.

### Customer Economics (20%)

The most predictive component for long-term business health:
- LTV:CAC ratio percentile — the ratio of lifetime value to acquisition cost, benchmarked within segment
- Repeat purchase rate vs. peer median
- Cart abandonment rate (inverted — lower is better)
- Average order value trend

A business with a 6:1 LTV:CAC ratio, a 42% repeat purchase rate, and declining cart abandonment scores very well on this component regardless of where it sits on revenue or margin.

### Operational Efficiency (10%)

Fulfilment quality and return economics:
- Refund/return rate percentile (inverted)
- Fulfilment rate (orders delivered on time)
- Average delivery time vs. category benchmark

Weighted at 10% because operational metrics are often outside the merchant's direct control (carrier-dependent, geography-dependent) and are more volatile quarter-to-quarter.

## Grade bands

| Score | Grade | Interpretation |
|---|---|---|
| 90–100 | A+ | Top decile — exceptional relative to peers |
| 80–89 | A | Strong across all dimensions |
| 70–79 | B+ | Above median, meaningful strengths |
| 60–69 | B | Solid fundamentals, clear improvement areas |
| 50–59 | C+ | Mixed profile — some strengths, some gaps |
| 40–49 | C | Below median in multiple dimensions |
| Below 40 | D | Significant underperformance vs. peers |

## What it is not

The Valcr Score is not a credit score. It does not incorporate repayment history, days outstanding, or liability structure. Lenders using Valcr data for underwriting combine the score with their own credit assessment — the score provides peer-relative financial context that their models typically lack, not a complete credit decision.

The score is not static. It is recalculated each time a new VCFS submission is processed, and the benchmark pool it draws from is updated quarterly. A score from six months ago reflects the merchant's position at that time relative to the peer group as it was constituted then.

## Accessing the score

The Valcr Score is available on Enterprise plans via the [`GET /merchant/score`](/api/merchant#get-merchantscore) endpoint. It requires a VCFS completeness score of at least 0.70 to compute reliably.

The response includes not just the composite score but the individual component scores, the peer percentile rank, and the quarter-over-quarter trend — so the number is always accompanied by enough context to be genuinely useful.

```json
{
  "valcr_score": 74,
  "grade": "B+",
  "components": {
    "revenue_quality":        { "score": 81, "weight": 0.25 },
    "margin_health":          { "score": 76, "weight": 0.25 },
    "growth_trajectory":      { "score": 68, "weight": 0.20 },
    "customer_economics":     { "score": 71, "weight": 0.20 },
    "operational_efficiency": { "score": 62, "weight": 0.10 }
  },
  "peer_percentile": 68.2,
  "trend": { "prev_score": 70, "delta": 4, "direction": "up" }
}
```

---

[See the full score endpoint documentation →](/api/merchant#get-merchantscore)
