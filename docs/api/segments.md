---
id: segments
title: "Segments"
sidebar_position: 4
description: "Valcr Segments API: browse available market segments and retrieve sub-segment metric breakdowns for ecommerce benchmarking."
keywords: [ecommerce segments api, market segment benchmark, ecommerce category data]
image: /img/valcr-social-card.png
---

# Segments API

Browse available market segments and drill into sub-segment metric breakdowns.

**Scope required:** `segments:read`  
**Base path:** `https://api.valcr.site/data/v1`

---

## GET /segments

Returns a list of all available categories and their segments.

### Request

```bash
GET /segments
Authorization: Bearer vcr_live_your_key
```

### Response `200`

```json
{
  "categories": [
    {
      "id":          "ecommerce",
      "label":       "E-Commerce",
      "description": "Direct-to-consumer and marketplace sellers",
      "merchant_count": 8420,
      "segments": [
        { "id": "fashion",          "label": "Fashion & Apparel",       "merchant_count": 1842 },
        { "id": "electronics",      "label": "Electronics & Tech",       "merchant_count": 1120 },
        { "id": "beauty",           "label": "Beauty & Personal Care",   "merchant_count": 980  },
        { "id": "home_garden",      "label": "Home & Garden",            "merchant_count": 870  },
        { "id": "sports_outdoors",  "label": "Sports & Outdoors",        "merchant_count": 640  },
        { "id": "food_beverage",    "label": "Food & Beverage",          "merchant_count": 580  },
        { "id": "pets",             "label": "Pets",                     "merchant_count": 390  },
        { "id": "health_wellness",  "label": "Health & Wellness",        "merchant_count": 970  }
      ]
    },
    {
      "id":          "saas",
      "label":       "SaaS",
      "description": "B2B and B2C software-as-a-service",
      "merchant_count": 3810,
      "segments": [
        { "id": "b2b_smb",          "label": "B2B — SMB focus",         "merchant_count": 1240 },
        { "id": "b2b_enterprise",   "label": "B2B — Enterprise focus",  "merchant_count": 680  },
        { "id": "b2c",              "label": "B2C / Consumer",           "merchant_count": 920  },
        { "id": "vertical_saas",    "label": "Vertical SaaS",            "merchant_count": 970  }
      ]
    },
    {
      "id":          "marketplace",
      "label":       "Marketplace",
      "description": "Two-sided marketplace operators",
      "merchant_count": 1640,
      "segments": [
        { "id": "product",          "label": "Product marketplace",      "merchant_count": 820  },
        { "id": "services",         "label": "Services marketplace",     "merchant_count": 480  },
        { "id": "rental",           "label": "Rental / sharing",         "merchant_count": 340  }
      ]
    },
    {
      "id":          "retail",
      "label":       "Retail",
      "description": "Brick-and-mortar and omnichannel retail",
      "merchant_count": 2180,
      "segments": [
        { "id": "grocery",          "label": "Grocery",                  "merchant_count": 620  },
        { "id": "specialty",        "label": "Specialty retail",         "merchant_count": 980  },
        { "id": "pharmacy",         "label": "Pharmacy & health",        "merchant_count": 580  }
      ]
    },
    {
      "id":          "fintech",
      "label":       "Fintech",
      "description": "Financial services and payments products",
      "merchant_count": 940,
      "segments": [
        { "id": "payments",         "label": "Payments",                 "merchant_count": 340  },
        { "id": "lending",          "label": "Lending & credit",         "merchant_count": 280  },
        { "id": "wealthtech",       "label": "Wealthtech",               "merchant_count": 320  }
      ]
    }
  ],
  "total_merchants": 16990,
  "updated_at": "2025-01-14T00:00:00Z"
}
```

---

## GET /segments/breakdown

Returns metric performance broken down across sub-segments within a category. Useful for identifying which segment a merchant most closely resembles.

### Request

```bash
GET /segments/breakdown?segment=ecommerce&metric=gross_margin
Authorization: Bearer vcr_live_your_key
```

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `segment` | string | ✓ | Parent category ID |
| `metric` | string | ✓ | Metric key to break down |
| `period` | string | — | Time period (default: latest) |
| `stat` | string | — | Statistic to return: `p50` (default), `p25`, `p75`, `mean` |

### Response `200`

```json
{
  "category": "ecommerce",
  "metric":   "gross_margin",
  "period":   "2024-Q4",
  "stat":     "p50",
  "breakdown": [
    { "segment": "beauty",          "label": "Beauty & Personal Care", "value": 0.61, "sample_size": 980  },
    { "segment": "health_wellness", "label": "Health & Wellness",      "value": 0.54, "sample_size": 970  },
    { "segment": "fashion",         "label": "Fashion & Apparel",      "value": 0.44, "sample_size": 1842 },
    { "segment": "sports_outdoors", "label": "Sports & Outdoors",      "value": 0.41, "sample_size": 640  },
    { "segment": "home_garden",     "label": "Home & Garden",          "value": 0.38, "sample_size": 870  },
    { "segment": "food_beverage",   "label": "Food & Beverage",        "value": 0.35, "sample_size": 580  },
    { "segment": "electronics",     "label": "Electronics & Tech",     "value": 0.28, "sample_size": 1120 },
    { "segment": "pets",            "label": "Pets",                   "value": 0.42, "sample_size": 390  }
  ],
  "category_overall": {
    "p50": 0.44,
    "sample_size": 7392
  }
}
```

### JavaScript example

```typescript
const res = await fetch(
  "https://api.valcr.site/data/v1/segments/breakdown" +
  "?segment=ecommerce&metric=gross_margin",
  { headers: { Authorization: `Bearer ${API_KEY}` } }
)
const data = await res.json()

// Sort by value descending
const ranked = data.breakdown.sort((a, b) => b.value - a.value)
ranked.forEach((seg, i) => {
  console.log(`${i + 1}. ${seg.label}: ${(seg.value * 100).toFixed(1)}%`)
})
// 1. Beauty & Personal Care: 61.0%
// 2. Health & Wellness: 54.0%
// 3. Fashion & Apparel: 44.0%
// ...
```

---

## Notes

- Segments with fewer than 30 merchants are suppressed from responses to protect merchant privacy
- Segment definitions are updated quarterly as the merchant base grows
- Custom segment definitions are available on Enterprise plans — contact [hello@valcr.site](mailto:hello@valcr.site)
