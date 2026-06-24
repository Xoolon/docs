---
slug: api-key-security-model
title: How Valcr API Keys Are Secured
authors: [glen]
tags: [security, api, engineering, authentication]
date: 2024-12-10
description: "How Valcr API keys are generated, stored, and validated securely: SHA-256 hashing, 287-bit entropy, rotation design, and production security practices."
keywords: [api key security, sha256 api key, api key best practices, secure api authentication]
image: /img/valcr-social-card.png
---

# How Valcr API Keys Are Secured

API key security is one of those topics where the difference between "good enough" and "actually secure" is invisible until something goes wrong. This post explains exactly how Valcr API keys are designed, stored, and validated — and the reasoning behind each decision.

<!--truncate-->

## Key generation

Every Valcr API key is generated using Python's `secrets.token_urlsafe(36)` — a cryptographically secure random string drawing from `/dev/urandom`, producing 48 characters of URL-safe base64 encoding from 36 bytes of randomness.

That gives each key approximately **287 bits of effective entropy**. For context, the absolute minimum considered adequate for API keys is 128 bits. 287 bits makes brute-force enumeration computationally infeasible for any foreseeable future.

Keys are prefixed with the environment:

```
vcr_live_xKj9RzMnP4qBvWsY...  ← production
vcr_test_aB2cDeFgHiJkLmNo...  ← sandbox
```

The prefix serves a practical purpose: it makes keys identifiable in logs, in code review, and in leaked credential scanning tools (similar to how GitHub tokens begin `ghp_` and Stripe keys begin `sk_live_`). GitHub's secret scanning automatically flags patterns like these before they reach production.

## What we store — and what we don't

This is the critical decision. When you create an API key in the Valcr Console, the sequence is:

1. `raw_key = f"vcr_{env}_{secrets.token_urlsafe(36)}"`
2. `key_hash = hashlib.sha256(raw_key.encode()).hexdigest()`
3. Store `key_hash` in the database
4. Return `raw_key` in the API response — **once, immediately**
5. Discard `raw_key` from memory

We store the SHA-256 hash. We never store the raw key. After the creation response is returned, **no system at Valcr holds the raw value** — not the database, not logs, not application memory.

The consequence is intentional: if our database were completely compromised, the attacker gets a list of SHA-256 hashes with no practical path to recovering the raw keys. A 287-bit random value is not susceptible to rainbow table attacks or dictionary attacks.

The user consequence is also intentional: if you lose the key, it must be rotated. There is no "show me my key again" feature because there is no copy to show.

### Why SHA-256 and not bcrypt?

bcrypt is the right choice for passwords because passwords have low entropy — humans choose predictable strings from a limited character set, which makes offline dictionary attacks viable against unsalted or weakly salted hashes.

API keys with 287 bits of entropy are not susceptible to dictionary attacks. The computation overhead of bcrypt on every API request (which requires a hash lookup on every authenticated call) introduces unnecessary latency with no security benefit. SHA-256 lookup in an indexed database column is fast, correct, and appropriate.

## Validation on every request

Every authenticated request to the Data API runs this sequence:

```
1. Extract token from Authorization: Bearer <token>
2. Compute SHA-256(token)
3. SELECT * FROM api_keys WHERE key_hash = $1 AND is_active = true
4. Check: key.environment matches request target
5. Check: required_scope ∈ key.scopes
6. Check: rate limit (per key, sliding window)
7. Check: account quota (per billing period)
8. Forward to handler
```

Steps 4–7 all happen before the request reaches any business logic. A request that fails any check never touches the data layer.

The hash lookup uses a database index on `key_hash`. Combined with the fixed-length output of SHA-256 (64 hex characters), this is a single indexed equality scan — consistently fast regardless of dataset size.

## Scope enforcement

Scopes follow the pattern `resource:action` and are stored as an array on the key record. The endpoint-to-scope mapping is maintained in the application layer:

```python
ENDPOINT_SCOPE_MAP = {
    "GET /benchmarks":              "benchmarks:read",
    "GET /benchmarks/percentile":   "benchmarks:read",
    "GET /segments":                "segments:read",
    "GET /merchant/vcfs":           "merchant:read",
    "POST /merchant/vcfs":          "merchant:write",
    "GET /merchant/insights":       "insights:read",
    "GET /merchant/score":          "score:read",
    "GET /export/xbrl":             "export:read",
}
```

If the scope is not present on the key, the request returns `403 Forbidden` — not `401 Unauthorized`. This distinction is deliberate: `401` means "not authenticated," `403` means "authenticated but not permitted." The difference helps integration developers understand whether they have a key problem or a scope problem.

## Key rotation

Rotation is the recommended response to any suspected key exposure — or simply as a regular security hygiene practice (every 90 days is reasonable for production integrations).

When a key is rotated:

1. A new raw key is generated with the same process as creation
2. The `key_hash` column on the existing record is overwritten atomically with the new hash
3. The old hash is gone — immediately invalid
4. The new raw key is returned in the rotation response — once

The atomic overwrite means there is no window where both the old and new key are simultaneously valid. The trade-off is that any in-flight requests using the old key at the moment of rotation will fail. For production systems where this matters, coordinate rotations with a low-traffic window or implement a brief retry on `401`.

## What this means for your integration

A few practical implications:

**Store keys in environment variables, never in code.** A key committed to a git repository is compromised — even if the repo is private, even if you delete the commit. Environment variables keep credentials out of version control entirely.

**Use test keys during development.** Test keys (`vcr_test_*`) return seeded data and never count against your quota or trigger billing. There is no reason to use a live key in a development or CI environment.

**Assign minimum required scopes.** If your integration only reads benchmarks, create a key with only `benchmarks:read`. A compromised key with minimal scopes has minimal blast radius.

**Rotate if in doubt.** Rotation takes 30 seconds in the Console. If a key was ever logged, ever appeared in an error message, ever shipped in a build artifact — rotate it. The old key is invalidated immediately.

---

[Read the full authentication documentation →](/auth)
