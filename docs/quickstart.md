---
id: quickstart
title: Quickstart
sidebar_position: 2
---

# Quickstart

Make your first authenticated Valcr Data API request in under two minutes.

---

## Step 1 — Create an account

Go to [console.valcr.site](https://console.valcr.site) and sign up. New accounts start on the **Developer** tier with access to `benchmarks:read` and `segments:read`.

---

## Step 2 — Create an API key

In the Console, navigate to **API Keys** → **Create key**.

1. Give it a name (e.g. `Production underwriting`)
2. Select environment: **Live** (real data) or **Test** (sandbox)
3. Select the scopes your integration needs
4. Click **Create key**

:::warning Store it now
The raw key is shown **once**. Copy it immediately — Valcr stores only a SHA-256 hash and cannot recover or display it again.
:::

Your key will look like:

```
vcr_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Step 3 — Make your first request

### cURL

```bash
curl -X GET "https://api.valcr.site/data/v1/benchmarks?category=ecommerce" \
  -H "Authorization: Bearer vcr_live_your_key_here"
```

### Python

```python
import requests

API_KEY = "vcr_live_your_key_here"
BASE    = "https://api.valcr.site/data/v1"

headers = {"Authorization": f"Bearer {API_KEY}"}

# Fetch benchmark percentiles for e-commerce
r = requests.get(
    f"{BASE}/benchmarks",
    headers=headers,
    params={"category": "ecommerce"},
)
r.raise_for_status()
data = r.json()

print(data["metrics"]["gross_margin"])
# → {"p25": 0.28, "p50": 0.41, "p75": 0.58, "p90": 0.67}
```

### JavaScript / TypeScript

```typescript
const API_KEY = "vcr_live_your_key_here"
const BASE    = "https://api.valcr.site/data/v1"

const res = await fetch(`${BASE}/benchmarks?category=ecommerce`, {
  headers: { Authorization: `Bearer ${API_KEY}` },
})

if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
const data = await res.json()

console.log(data.metrics.gross_margin)
// → { p25: 0.28, p50: 0.41, p75: 0.58, p90: 0.67 }
```

### Go

```go
package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func main() {
	req, _ := http.NewRequest("GET",
		"https://api.valcr.site/data/v1/benchmarks?category=ecommerce", nil)
	req.Header.Set("Authorization", "Bearer vcr_live_your_key_here")

	resp, err := http.DefaultClient.Do(req)
	if err != nil { panic(err) }
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var result map[string]interface{}
	json.Unmarshal(body, &result)
	fmt.Println(result["metrics"])
}
```

---

## Step 4 — Parse the response

A successful `200` response returns:

```json
{
  "category": "ecommerce",
  "segment":  null,
  "period":   "2024-Q4",
  "metrics": {
    "gross_margin": {
      "p25": 0.28,
      "p50": 0.41,
      "p75": 0.58,
      "p90": 0.67
    },
    "revenue_growth": {
      "p25": 0.04,
      "p50": 0.12,
      "p75": 0.26,
      "p90": 0.48
    }
  },
  "sample_size": 4812,
  "generated_at": "2025-01-14T08:22:01Z"
}
```

### Error responses

All errors follow a consistent shape:

```json
{
  "detail": "Invalid or revoked API key",
  "code":   "auth.invalid_key",
  "status": 401
}
```

| Status | Meaning |
|---|---|
| `401` | Missing or invalid API key |
| `403` | Valid key but insufficient scope |
| `429` | Rate limit exceeded (100 req/min per key) |
| `402` | Quota exhausted — billing triggered |
| `422` | Invalid query parameters |
| `500` | Server error — retry with exponential backoff |

---

## Step 5 — Handle rate limits

Every key is limited to **100 requests per minute**. When exceeded, the response is:

```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit:     100
X-RateLimit-Remaining: 0
X-RateLimit-Reset:     1705228920
Retry-After:           42
```

Implement a simple retry:

```python
import time, requests

def call_with_retry(url, headers, params, max_retries=3):
    for attempt in range(max_retries):
        r = requests.get(url, headers=headers, params=params)
        if r.status_code == 429:
            wait = int(r.headers.get("Retry-After", 5))
            time.sleep(wait)
            continue
        r.raise_for_status()
        return r.json()
    raise Exception("Max retries exceeded")
```

---

## Next steps

- [Authentication deep-dive →](./auth.md) — key rotation, scopes, security model
- [Benchmarks API →](/api/benchmarks) — all available metrics and filters
- [VCFS Schema →](/guides/vcfs-schema) — understand the merchant financial model
- [Set up webhooks →](/docs-valcr/docs/webhooks.md) — get notified when quota is exhausted
