---
id: overview
title: "API Overview"
sidebar_position: 1
description: "Valcr Data API reference overview: base URL, authentication, response format, status codes, and pagination."
keywords: [valcr api reference, api overview, rest api, http status codes]
image: /img/valcr-social-card.png
---

# API Reference Overview

All endpoints are prefixed with:

```
https://api.valcr.site/data/v1
```

---

## Authentication

Every request requires:

```
Authorization: Bearer vcr_live_your_key_here
```

See [Authentication](/auth) for the full security model.

---

## Response format

All responses are `application/json`. Successful responses (2xx) return the resource directly. Error responses always include:

```json
{
  "detail": "Human-readable error description",
  "code":   "machine.readable_code",
  "status": 403
}
```

---

## Standard query parameters

| Parameter | Type | Description |
|---|---|---|
| `category` | string | Market category: `ecommerce`, `saas`, `marketplace`, `retail`, `fintech` |
| `segment` | string | Sub-segment within a category |
| `period` | string | Time period: `2024-Q4`, `2024`, `last_30_days` |
| `format` | string | Response format where supported: `json`, `pdf`, `xbrl` |

---

## HTTP methods

| Method | Usage |
|---|---|
| `GET` | Read data — safe, idempotent |
| `POST` | Create or trigger an action |
| `PATCH` | Partial update |
| `DELETE` | Remove a resource |

---

## Status codes

| Code | Meaning | Action |
|---|---|---|
| `200` | OK | — |
| `201` | Created | — |
| `400` | Bad request | Check query parameters |
| `401` | Unauthorized | Check API key |
| `402` | Payment required | Quota exhausted, billing triggered |
| `403` | Forbidden | Key lacks required scope |
| `404` | Not found | Resource does not exist |
| `422` | Validation error | Check request body |
| `429` | Rate limited | Wait for `Retry-After` seconds |
| `500` | Server error | Retry with exponential backoff |

---

## Available endpoints

| Group | Scope required | Endpoints |
|---|---|---|
| [Benchmarks](/api/benchmarks) | `benchmarks:read` | `/benchmarks`, `/benchmarks/percentile`, `/benchmarks/distribution`, `/benchmarks/history` |
| [Segments](/api/segments) | `segments:read` | `/segments`, `/segments/breakdown` |
| [Merchant](/api/merchant) | `merchant:read` / `write` | `/merchant/vcfs`, `/merchant/score`, `/merchant/insights`, `/merchant/compare` |
| [XBRL Export](/api/xbrl) | `export:read` | `/export/xbrl` |
| Health | None | `/health` |

---

## Pagination

List endpoints that return multiple items support cursor-based pagination:

```
GET /benchmarks/history?category=ecommerce&limit=10&cursor=eyJpZCI6IjEwMCJ9
```

Response includes:

```json
{
  "items": [...],
  "next_cursor": "eyJpZCI6IjExMCJ9",
  "has_more": true
}
```

Pass `next_cursor` as `cursor` in the next request. When `has_more` is `false`, you've reached the end.

---

## CORS

The Data API does not support browser-side requests. All calls must originate from a server with a valid API key. CORS headers are not included in responses by design.
