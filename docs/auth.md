---
id: auth
title: "Authentication"
sidebar_position: 3
description: "Valcr API authentication: API key security model, scopes, rotation policy, rate limiting, and quota management."
keywords: [valcr api authentication, api key security, bearer token, api scopes, rate limiting]
image: /img/valcr-social-card.png
---

# Authentication

All Valcr Data API requests are authenticated with **Bearer tokens** passed in the `Authorization` header.

```bash
Authorization: Bearer vcr_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## API key anatomy

```
vcr_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
│   │         │
│   │         └─ 48-character URL-safe random token (secrets.token_urlsafe)
│   └─────────── environment: "live" or "test"
└─────────────── product prefix
```

| Component | Value | Description |
|---|---|---|
| Prefix | `vcr_` | Identifies this as a Valcr key |
| Environment | `live_` / `test_` | Controls which data is returned |
| Token | 48 chars | Cryptographically random (384 bits of entropy) |

---

## Security model

### What Valcr stores

When you create a key, Valcr:

1. Generates the raw key (`secrets.token_urlsafe(36)`)
2. Displays it to you **once**
3. Stores only `SHA-256(raw_key)` in the database
4. Discards the raw value immediately

The raw key is **never logged, stored, or recoverable**. If lost, the key must be rotated.

### What happens on each request

```
Incoming: Authorization: Bearer vcr_live_abc123...

1. Strip prefix → extract raw token
2. Compute SHA-256(raw token)
3. Lookup key_hash in database
4. Check: is_active = true
5. Check: environment matches request target
6. Check: requested endpoint scope ∈ key.scopes
7. Check: rate limit (sliding window, per key)
8. Check: account quota (per billing period)
9. Forward request to handler
```

If any check fails, the request is rejected with the appropriate HTTP status code.

---

## Environments

| Environment | Prefix | Data | Billing |
|---|---|---|---|
| **Live** | `vcr_live_` | Real benchmark data | Counts toward quota |
| **Test** | `vcr_test_` | Seeded/synthetic data | Never billed |

Use test keys during development. Switch to live keys for production.

:::caution
Live keys in client-side code (browser, mobile app) are a security risk. Always call the API from your backend server.
:::

---

## Scopes

Scopes follow the pattern `resource:action`. A key can carry any subset of scopes permitted by your account tier.

| Scope | Endpoint(s) | Tier required |
|---|---|---|
| `benchmarks:read` | `GET /benchmarks`, `/benchmarks/percentile`, `/benchmarks/distribution`, `/benchmarks/history` | Developer+ |
| `segments:read` | `GET /segments`, `/segments/breakdown` | Developer+ |
| `merchant:read` | `GET /merchant/vcfs`, `/merchant/compare` | Startup+ |
| `merchant:write` | `POST /merchant/vcfs` | Growth+ |
| `insights:read` | `GET /merchant/insights` | Growth+ |
| `compare:read` | `GET /merchant/compare` | Growth+ |
| `score:read` | `GET /merchant/score` | Enterprise |
| `report:read` | `GET /report` | Enterprise |
| `export:read` | `GET /export/xbrl` | Enterprise |

### Creating a minimum-privilege key

Best practice is to create keys with only the scopes your integration actually needs:

```python
# Via Console API (after logging in)
import requests

r = requests.post(
    "https://api.valcr.site/api/v1/console/keys",
    headers={"Authorization": f"Bearer {SESSION_TOKEN}"},
    json={
        "name": "Underwriting service — read only",
        "environment": "live",
        "scopes": ["benchmarks:read", "merchant:read"],
    },
)
key = r.json()
print(key["raw_key"])  # Store this — shown only once
```

---

## Key rotation

Rotate keys regularly or immediately after any suspected exposure.

**Via Console UI:**
1. Go to API Keys
2. Expand the key
3. Click **Rotate key**
4. Copy the new raw key
5. Update your integration

**Via API:**
```bash
curl -X POST "https://api.valcr.site/api/v1/console/keys/{key_id}/rotate" \
  -H "Authorization: Bearer {session_token}"
```

Response:
```json
{
  "raw_key":    "vcr_live_newxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "prefix":     "vcr_live_newxx",
  "rotated_at": "2025-01-14T09:00:00Z"
}
```

:::warning
The previous key is **immediately invalidated**. Any in-flight requests using the old key will fail. Update all services before rotating in production.
:::

---

## Rate limiting

Rate limits are enforced per key, per minute, using a sliding window.

| Tier | Requests / minute | Requests / day |
|---|---|---|
| Developer | 60 | 10,000 |
| Startup | 100 | 100,000 |
| Growth | 300 | 500,000 |
| Enterprise | Custom | Custom |

### Rate limit headers

Every response includes:

```
X-RateLimit-Limit:     100
X-RateLimit-Remaining: 87
X-RateLimit-Reset:     1705228920
```

When exceeded (`429`):

```
X-RateLimit-Limit:     100
X-RateLimit-Remaining: 0
X-RateLimit-Reset:     1705228920
Retry-After:           14
```

---

## Quota & auto-billing

Your plan includes a monthly call quota. When the quota is exhausted:

1. A `402 Payment Required` is returned on the next request
2. A Paystack charge is triggered automatically for the next quota block
3. Once payment clears, the quota resets and API access resumes
4. A `quota.exhausted` webhook event fires (if configured)

### Checking remaining quota

```bash
GET https://api.valcr.site/api/v1/console/usage/summary

{
  "today": 1240,
  "daily_limit": 10000,
  "month": 8820,
  "monthly_limit": 10000,
  "token_balance": 1180,
  "active_keys": 2
}
```

---

## IP allowlisting (Enterprise)

Enterprise accounts can restrict API access to specific IP ranges. Contact [hello@valcr.site](mailto:hello@valcr.site) to configure.

---

## Security checklist

- [ ] Keys stored in environment variables, never hardcoded
- [ ] Keys never committed to version control
- [ ] Live keys only used server-side
- [ ] Keys carry minimum required scopes
- [ ] Test keys used for all development and CI
- [ ] Rotation policy defined (recommended: every 90 days)
- [ ] Webhook configured for `key.rotated` and `quota.exhausted` events
