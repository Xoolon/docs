---
id: index
title: Introduction
slug: /
sidebar_position: 1
---

# Valcr Data API

**Financial benchmark intelligence for commerce operators.**

Valcr gives developers programmatic access to the same benchmark data that powers the Valcr platform — category-level performance percentiles, merchant VCFS profiles, peer comparisons, AI-generated insights, and XBRL-compliant financial exports.

:::tip Getting started fast?
Jump straight to the [Quickstart →](./quickstart.md) and make your first authenticated request in under two minutes.
:::

---

## What you can build

| Use case | Endpoints |
|---|---|
| Benchmark your merchant against category peers | `/benchmarks`, `/merchant/compare` |
| Pull a full structured financial profile | `/merchant/vcfs` |
| Generate AI causal insights from current data | `/merchant/insights` |
| Export XBRL-tagged financial data | `/export/xbrl` |
| Build internal reporting dashboards | `/report`, `/benchmarks/history` |
| Integrate underwriting or credit scoring | `/merchant/score`, `/merchant/vcfs` |

---

## Base URL

All Data API requests go to:

```
https://api.valcr.site/data/v1
```

The Console and auth endpoints (key management, billing) are at:

```
https://api.valcr.site/api/v1
```

---

## How it works

```
Your server
    │
    │  Authorization: Bearer vcr_live_...
    ▼
api.valcr.site/data/v1
    │
    ├─ Key validated (SHA-256 hash lookup)
    ├─ Scope checked against requested endpoint
    ├─ Rate limit checked (per key, per minute)
    ├─ Quota checked (per account, per billing period)
    │
    ▼
  Response (JSON)
```

Every request must carry a valid API key in the `Authorization` header. Keys are environment-scoped (`live` or `test`) and carry granular permission scopes that control which endpoints they can reach.

---

## API keys

| Prefix | Environment | Description |
|---|---|---|
| `vcr_live_` | Live | Production — real data, real billing |
| `vcr_test_` | Test | Sandbox — seeded data, no billing impact |

Keys are created in the [Console](https://console.valcr.site). Each key is shown **once** at creation and hashed server-side immediately — Valcr never stores the raw value.

---

## Tiers & access

Your account tier controls which endpoints your keys can access:

| Tier | Price | Included scopes |
|---|---|---|
| **Developer** | $29/mo | `benchmarks:read`, `segments:read` |
| **Startup** | $99/mo | + `merchant:read` |
| **Growth** | $299/mo | + `merchant:write`, `insights:read`, `compare:read` |
| **Enterprise** | Custom | All scopes including `score:read`, `report:read`, `export:read` |

---

## Quick example

```bash
curl -X GET "https://api.valcr.site/data/v1/benchmarks?category=ecommerce" \
  -H "Authorization: Bearer vcr_live_your_key_here"
```

```json
{
  "category": "ecommerce",
  "period": "2024-Q4",
  "metrics": {
    "gross_margin":      { "p25": 0.28, "p50": 0.41, "p75": 0.58, "p90": 0.67 },
    "revenue_growth":    { "p25": 0.04, "p50": 0.12, "p75": 0.26, "p90": 0.48 },
    "customer_ltv":      { "p25": 82,   "p50": 164,  "p75": 310,  "p90": 580  },
    "cart_abandon_rate": { "p25": 0.58, "p50": 0.68, "p75": 0.76, "p90": 0.82 }
  },
  "sample_size": 4812
}
```

---

## SDKs & libraries

Official clients are in progress. In the meantime, any HTTP library works:

- **Python** — `requests`, `httpx`
- **Node.js** — `fetch`, `axios`
- **Go** — `net/http`
- **cURL** — for quick testing

See the [quickstart](./quickstart.md) for copy-paste examples in each language.

---

## Support

- **Docs issues** — open a PR on [GitHub](https://github.com/valcr/docs-valcr)
- **API issues** — email [api@valcr.site](mailto:api@valcr.site)
- **Enterprise** — [hello@valcr.site](mailto:hello@valcr.site)
