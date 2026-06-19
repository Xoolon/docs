---
id: merchant
title: Merchant
sidebar_position: 3
---

# Merchant API

Endpoints for reading and writing merchant VCFS data, retrieving the Valcr Score, generating AI insights, and running peer comparisons.

**Base path:** `https://api.valcr.site/data/v1`

---

## GET /merchant/vcfs

Retrieve the full VCFS (Valcr Commerce Financial Schema) profile for the authenticated merchant.

**Scope required:** `merchant:read`

### Request

```bash
GET /merchant/vcfs
Authorization: Bearer vcr_live_your_key
```

### Response `200`

```json
{
  "merchant_id":   "mer_01HXXXXXXXXXXXXXXXX",
  "submitted_at":  "2025-01-10T14:30:00Z",
  "period_start":  "2024-10-01",
  "period_end":    "2024-12-31",
  "vcfs": {
    "revenue": {
      "gross_revenue":     480000,
      "net_revenue":       432000,
      "recurring_revenue": 0,
      "currency":          "USD"
    },
    "margins": {
      "gross_margin":       0.52,
      "operating_margin":   0.14,
      "net_margin":         0.09
    },
    "growth": {
      "revenue_growth_qoq":  0.18,
      "revenue_growth_yoy":  0.41,
      "unit_growth_qoq":     0.12
    },
    "customers": {
      "active_customers":       3840,
      "new_customers":          680,
      "churned_customers":      142,
      "average_order_value":    125,
      "customer_ltv":           310,
      "customer_acquisition_cost": 48,
      "cart_abandonment_rate":  0.66,
      "repeat_purchase_rate":   0.38
    },
    "operations": {
      "refund_rate":         0.04,
      "fulfillment_rate":    0.97,
      "average_delivery_days": 3.2
    },
    "channel": {
      "direct":    0.64,
      "amazon":    0.22,
      "wholesale": 0.14
    }
  },
  "completeness_score": 0.92
}
```

---

## POST /merchant/vcfs

Submit or update the merchant's VCFS profile.

**Scope required:** `merchant:write`

### Request

```bash
POST /merchant/vcfs
Authorization: Bearer vcr_live_your_key
Content-Type: application/json
```

```json
{
  "period_start": "2024-10-01",
  "period_end":   "2024-12-31",
  "vcfs": {
    "revenue": {
      "gross_revenue": 480000,
      "net_revenue":   432000,
      "currency":      "USD"
    },
    "margins": {
      "gross_margin":     0.52,
      "operating_margin": 0.14,
      "net_margin":       0.09
    },
    "customers": {
      "active_customers":   3840,
      "average_order_value": 125,
      "customer_ltv":        310
    }
  }
}
```

:::tip Partial submissions are accepted
You don't need to submit all fields at once. A `completeness_score` is returned indicating what percentage of the schema is populated. Higher completeness unlocks more accurate benchmark comparisons and insights.
:::

### Response `201`

```json
{
  "merchant_id":       "mer_01HXXXXXXXXXXXXXXXX",
  "vcfs_version":      "vcfs_01HXXXXXXXXXXXXXXXX",
  "submitted_at":      "2025-01-14T09:30:00Z",
  "completeness_score": 0.74,
  "missing_fields": [
    "vcfs.growth.revenue_growth_yoy",
    "vcfs.operations.refund_rate"
  ]
}
```

### Python example

```python
import requests

data = {
    "period_start": "2024-10-01",
    "period_end":   "2024-12-31",
    "vcfs": {
        "revenue": {
            "gross_revenue": 480000,
            "net_revenue":   432000,
            "currency":      "USD",
        },
        "margins": {
            "gross_margin": 0.52,
        },
        "customers": {
            "active_customers":   3840,
            "average_order_value": 125,
        },
    },
}

r = requests.post(
    "https://api.valcr.site/data/v1/merchant/vcfs",
    headers={
        "Authorization": "Bearer vcr_live_your_key",
        "Content-Type":  "application/json",
    },
    json=data,
)
result = r.json()
print(f"Completeness: {result['completeness_score']:.0%}")
```

---

## GET /merchant/score

Returns the composite Valcr Score (0–100) for the merchant.

**Scope required:** `score:read` (Enterprise)

### Request

```bash
GET /merchant/score
Authorization: Bearer vcr_live_your_key
```

### Response `200`

```json
{
  "merchant_id":   "mer_01HXXXXXXXXXXXXXXXX",
  "valcr_score":   74,
  "grade":         "B+",
  "generated_at":  "2025-01-14T08:00:00Z",
  "components": {
    "revenue_quality":    { "score": 81, "weight": 0.25 },
    "margin_health":      { "score": 76, "weight": 0.25 },
    "growth_trajectory":  { "score": 68, "weight": 0.20 },
    "customer_economics": { "score": 71, "weight": 0.20 },
    "operational_efficiency": { "score": 62, "weight": 0.10 }
  },
  "peer_percentile": 68.2,
  "trend": {
    "prev_score":   70,
    "delta":        4,
    "direction":    "up"
  }
}
```

---

## GET /merchant/insights

Returns AI-generated causal insights based on the merchant's current VCFS data and benchmark position.

**Scope required:** `insights:read` (Growth+)

### Request

```bash
GET /merchant/insights?refresh=false
Authorization: Bearer vcr_live_your_key
```

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `refresh` | boolean | — | Force regeneration of insights (default: `false`, returns cached) |

### Response `200`

```json
{
  "merchant_id":  "mer_01HXXXXXXXXXXXXXXXX",
  "generated_at": "2025-01-14T08:00:00Z",
  "is_cached":    true,
  "insights": [
    {
      "type":     "strength",
      "metric":   "gross_margin",
      "headline": "Gross margin 8pp above category median",
      "detail":   "Your 52% gross margin outperforms 71% of ecommerce peers. The primary driver appears to be direct-channel share (64% vs 41% category median), which reduces marketplace fees.",
      "impact":   "high",
      "benchmark_context": {
        "your_value": 0.52,
        "category_p50": 0.44,
        "category_p75": 0.59
      }
    },
    {
      "type":     "opportunity",
      "metric":   "cart_abandonment_rate",
      "headline": "Cart abandonment 3pp above category median",
      "detail":   "Your 66% cart abandonment rate is slightly elevated versus the 69% p50, but still within normal range. Merchants at the 25th percentile (60%) typically deploy one-click checkout and exit-intent recovery flows.",
      "impact":   "medium",
      "benchmark_context": {
        "your_value":    0.66,
        "category_p50":  0.69,
        "category_p25":  0.60
      }
    }
  ],
  "summary": "Strong margin profile driven by direct channel. Primary opportunity is repeat purchase rate improvement, which at 38% trails the category median of 44%."
}
```

---

## GET /merchant/compare

Compare the merchant's VCFS against category peer group percentiles.

**Scope required:** `compare:read` (Growth+)

### Request

```bash
GET /merchant/compare?segment=fashion
Authorization: Bearer vcr_live_your_key
```

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `segment` | string | — | Optional: narrow the peer group to a segment |

### Response `200`

```json
{
  "merchant_id":  "mer_01HXXXXXXXXXXXXXXXX",
  "category":     "ecommerce",
  "segment":      "fashion",
  "period":       "2024-Q4",
  "peer_count":   842,
  "comparison": {
    "gross_margin": {
      "merchant":    0.52,
      "p25":         0.31,
      "p50":         0.44,
      "p75":         0.59,
      "percentile":  71.4,
      "vs_median":   "+18.2%"
    },
    "revenue_growth": {
      "merchant":    0.18,
      "p25":         0.06,
      "p50":         0.14,
      "p75":         0.28,
      "percentile":  58.3,
      "vs_median":   "+28.6%"
    },
    "customer_ltv": {
      "merchant":    310,
      "p25":         98,
      "p50":         188,
      "p75":         340,
      "percentile":  67.2,
      "vs_median":   "+64.9%"
    }
  }
}
```
