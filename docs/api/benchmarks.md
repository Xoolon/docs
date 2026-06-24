---
id: benchmarks
title: "Benchmarks"
sidebar_position: 2
description: "Valcr Benchmarks API: retrieve ecommerce financial benchmark percentiles, distributions, and historical trends by category and segment."
keywords: [ecommerce benchmark api, gross margin benchmark, ltv cac benchmark, financial percentiles api]
image: /img/valcr-social-card.png
---

# Benchmarks API

Access category-level financial performance benchmarks. All benchmark endpoints require the `benchmarks:read` scope.

**Base path:** `https://api.valcr.site/data/v1`

---

## GET /benchmarks

Returns aggregate benchmark percentiles for a given category and optional segment.

### Request

```bash
GET /benchmarks?category=ecommerce&segment=fashion&period=2024-Q4
Authorization: Bearer vcr_live_your_key
```

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `category` | string | ✓ | Market category |
| `segment` | string | — | Sub-segment filter |
| `period` | string | — | Time period (default: latest quarter) |

**Supported categories:** `ecommerce`, `saas`, `marketplace`, `retail`, `fintech`, `food_beverage`, `health_wellness`

### Response `200`

```json
{
  "category":     "ecommerce",
  "segment":      "fashion",
  "period":       "2024-Q4",
  "generated_at": "2025-01-14T08:00:00Z",
  "sample_size":  1842,
  "metrics": {
    "gross_margin": {
      "p10": 0.18, "p25": 0.31, "p50": 0.44,
      "p75": 0.59, "p90": 0.68, "mean": 0.43
    },
    "revenue_growth": {
      "p10": -0.02, "p25": 0.06, "p50": 0.14,
      "p75": 0.28, "p90": 0.51, "mean": 0.15
    },
    "customer_ltv": {
      "p10": 42, "p25": 98, "p50": 188,
      "p75": 340, "p90": 620, "mean": 210
    },
    "cart_abandon_rate": {
      "p10": 0.51, "p25": 0.60, "p50": 0.69,
      "p75": 0.77, "p90": 0.84, "mean": 0.69
    },
    "average_order_value": {
      "p10": 28, "p25": 52, "p50": 87,
      "p75": 148, "p90": 240, "mean": 94
    },
    "refund_rate": {
      "p10": 0.02, "p25": 0.04, "p50": 0.07,
      "p75": 0.12, "p90": 0.19, "mean": 0.08
    }
  }
}
```

### Available metrics by category

| Metric | Key | Categories |
|---|---|---|
| Gross margin | `gross_margin` | All |
| Revenue growth (QoQ) | `revenue_growth` | All |
| Net revenue retention | `net_revenue_retention` | SaaS, Marketplace |
| Customer LTV | `customer_ltv` | All |
| CAC | `customer_acquisition_cost` | All |
| LTV:CAC ratio | `ltv_cac_ratio` | All |
| Churn rate | `churn_rate` | SaaS |
| Cart abandonment | `cart_abandon_rate` | Ecommerce, Marketplace |
| Average order value | `average_order_value` | Ecommerce, Retail |
| Refund rate | `refund_rate` | Ecommerce, Retail |
| Repeat purchase rate | `repeat_purchase_rate` | Ecommerce, Retail, F&B |
| GMV growth | `gmv_growth` | Marketplace |
| Take rate | `take_rate` | Marketplace |
| Burn multiple | `burn_multiple` | SaaS, Fintech |

---

## GET /benchmarks/percentile

Returns the percentile rank of a specific metric value within a category.

### Request

```bash
GET /benchmarks/percentile?metric=gross_margin&value=0.52&category=ecommerce
Authorization: Bearer vcr_live_your_key
```

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `metric` | string | ✓ | Metric key (see table above) |
| `value` | float | ✓ | The value to rank |
| `category` | string | ✓ | Market category |
| `segment` | string | — | Optional segment filter |
| `period` | string | — | Period (default: latest) |

### Response `200`

```json
{
  "metric":      "gross_margin",
  "value":       0.52,
  "category":    "ecommerce",
  "period":      "2024-Q4",
  "percentile":  71.4,
  "interpretation": "This gross margin places the merchant in the top 28.6% of ecommerce operators.",
  "context": {
    "p50":  0.44,
    "p75":  0.59,
    "p90":  0.68
  }
}
```

### Python example

```python
import requests

r = requests.get(
    "https://api.valcr.site/data/v1/benchmarks/percentile",
    headers={"Authorization": "Bearer vcr_live_your_key"},
    params={
        "metric":   "gross_margin",
        "value":    0.52,
        "category": "ecommerce",
    },
)
result = r.json()
print(f"Gross margin of 52% is at the {result['percentile']:.0f}th percentile")
# → Gross margin of 52% is at the 71st percentile
```

---

## GET /benchmarks/distribution

Returns the full distribution histogram for a metric, useful for charting.

### Request

```bash
GET /benchmarks/distribution?metric=gross_margin&category=ecommerce&buckets=20
Authorization: Bearer vcr_live_your_key
```

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `metric` | string | ✓ | Metric key |
| `category` | string | ✓ | Market category |
| `buckets` | integer | — | Number of histogram buckets (default: 20, max: 100) |
| `segment` | string | — | Optional segment filter |

### Response `200`

```json
{
  "metric":   "gross_margin",
  "category": "ecommerce",
  "period":   "2024-Q4",
  "histogram": [
    { "bucket_start": 0.00, "bucket_end": 0.05, "count": 24,  "pct": 1.3 },
    { "bucket_start": 0.05, "bucket_end": 0.10, "count": 58,  "pct": 3.1 },
    { "bucket_start": 0.10, "bucket_end": 0.15, "count": 112, "pct": 6.1 },
    { "bucket_start": 0.15, "bucket_end": 0.20, "count": 187, "pct": 10.2 },
    ...
  ],
  "sample_size": 1842,
  "stats": {
    "min": -0.12, "max": 0.91,
    "mean": 0.43, "std_dev": 0.14
  }
}
```

---

## GET /benchmarks/history

Returns benchmark values over multiple time periods, enabling trend analysis.

### Request

```bash
GET /benchmarks/history?metric=gross_margin&category=ecommerce&periods=8
Authorization: Bearer vcr_live_your_key
```

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `metric` | string | ✓ | Metric key |
| `category` | string | ✓ | Market category |
| `periods` | integer | — | Number of periods to return (default: 4, max: 20) |
| `granularity` | string | — | `quarterly` (default) or `monthly` |
| `segment` | string | — | Optional segment |

### Response `200`

```json
{
  "metric":      "gross_margin",
  "category":    "ecommerce",
  "granularity": "quarterly",
  "history": [
    {
      "period": "2023-Q1",
      "p25": 0.29, "p50": 0.42, "p75": 0.57,
      "sample_size": 1502
    },
    {
      "period": "2023-Q2",
      "p25": 0.30, "p50": 0.43, "p75": 0.57,
      "sample_size": 1611
    },
    {
      "period": "2023-Q3",
      "p25": 0.30, "p50": 0.43, "p75": 0.58,
      "sample_size": 1688
    },
    {
      "period": "2023-Q4",
      "p25": 0.31, "p50": 0.44, "p75": 0.58,
      "sample_size": 1731
    }
  ]
}
```

---

## Error responses

### Missing scope

```json
{
  "detail": "Scope 'benchmarks:read' required for this endpoint",
  "code":   "auth.insufficient_scope",
  "status": 403
}
```

### Invalid category

```json
{
  "detail": "Category 'widgets' is not supported. Valid values: ecommerce, saas, marketplace, retail, fintech, food_beverage, health_wellness",
  "code":   "validation.invalid_category",
  "status": 422
}
```
