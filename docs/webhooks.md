---
id: webhooks
title: Webhooks
sidebar_position: 4
---

# Webhooks

Valcr sends signed HTTP `POST` requests to your endpoint when key account events occur. Webhooks are critical for catching quota exhaustion and billing failures without polling.

---

## Configuring a webhook

In the Console under **Webhooks**, provide:
- An HTTPS endpoint URL
- The events you want to receive

Or via API:

```bash
curl -X POST "https://api.valcr.site/api/v1/console/webhooks" \
  -H "Authorization: Bearer {session_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-server.com/webhooks/valcr",
    "events": ["quota.exhausted", "invoice.failed", "key.rotated"]
  }'
```

Response:

```json
{
  "webhook_id":      "wh_01HXXXXXXXXXXXXXXXX",
  "url":             "https://your-server.com/webhooks/valcr",
  "events":          ["quota.exhausted", "invoice.failed", "key.rotated"],
  "signing_secret":  "whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "created_at":      "2025-01-14T09:00:00Z"
}
```

Store the `signing_secret` — you'll use it to verify incoming events.

---

## Event types

| Event | When it fires |
|---|---|
| `key.created` | A new API key was created |
| `key.rotated` | An API key was rotated (old key now invalid) |
| `key.revoked` | An API key was permanently revoked |
| `quota.warning` | Account quota reached 80% |
| `quota.exhausted` | Quota fully consumed — auto-billing triggered |
| `invoice.paid` | Payment successfully processed |
| `invoice.failed` | Payment attempt failed |

---

## Payload structure

All events share the same envelope:

```json
{
  "id":         "evt_01HXXXXXXXXXXXXXXXX",
  "type":       "quota.exhausted",
  "account_id": "acc_01HXXXXXXXXXXXXXXXX",
  "created_at": "2025-01-14T09:22:01Z",
  "data": {
    // event-specific payload — see below
  }
}
```

### `quota.exhausted`

```json
{
  "id":   "evt_01HXXXXXXXXXXXXXXXX",
  "type": "quota.exhausted",
  "data": {
    "calls_used":       10000,
    "period_start":     "2025-01-01T00:00:00Z",
    "period_end":       "2025-01-31T23:59:59Z",
    "charge_amount":    2900,
    "charge_currency":  "USD",
    "paystack_ref":     "PAY_xxxxxxxxxxxxxxxx"
  }
}
```

### `key.rotated`

```json
{
  "id":   "evt_01HXXXXXXXXXXXXXXXX",
  "type": "key.rotated",
  "data": {
    "key_id":     "key_01HXXXXXXXXXXXXXXXX",
    "key_name":   "Production underwriting",
    "rotated_at": "2025-01-14T09:00:00Z"
  }
}
```

### `invoice.paid`

```json
{
  "id":   "evt_01HXXXXXXXXXXXXXXXX",
  "type": "invoice.paid",
  "data": {
    "invoice_id":   "inv_01HXXXXXXXXXXXXXXXX",
    "amount":       2900,
    "currency":     "USD",
    "paid_at":      "2025-01-14T09:22:01Z",
    "paystack_ref": "PAY_xxxxxxxxxxxxxxxx"
  }
}
```

---

## Verifying signatures

Every webhook request includes an `X-Valcr-Signature` header containing an HMAC-SHA256 signature. **Always verify this before processing the event.**

### Python

```python
import hmac, hashlib

def verify_valcr_webhook(payload_bytes: bytes, signature_header: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode(),
        payload_bytes,
        hashlib.sha256,
    ).hexdigest()
    received = signature_header.split("sha256=")[-1]
    return hmac.compare_digest(expected, received)

# In your Flask/FastAPI handler:
@app.post("/webhooks/valcr")
async def handle_webhook(request: Request):
    body      = await request.body()
    sig       = request.headers.get("X-Valcr-Signature", "")
    secret    = os.environ["VALCR_WEBHOOK_SECRET"]

    if not verify_valcr_webhook(body, sig, secret):
        raise HTTPException(status_code=400, detail="Invalid signature")

    event = json.loads(body)
    await process_event(event)
    return {"ok": True}
```

### Node.js

```typescript
import crypto from 'crypto'

function verifyValcrWebhook(
  payload: Buffer,
  signatureHeader: string,
  secret: string,
): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  const received = signatureHeader.replace('sha256=', '')
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(received),
  )
}

// Express handler
app.post('/webhooks/valcr', express.raw({ type: '*/*' }), (req, res) => {
  const sig    = req.headers['x-valcr-signature'] as string
  const secret = process.env.VALCR_WEBHOOK_SECRET!

  if (!verifyValcrWebhook(req.body, sig, secret)) {
    return res.status(400).json({ error: 'Invalid signature' })
  }

  const event = JSON.parse(req.body.toString())
  processEvent(event)
  res.json({ ok: true })
})
```

:::danger Always verify signatures
Never process a webhook without verifying the signature. Unverified webhooks are a common attack vector for triggering billing or access changes.
:::

---

## Retry policy

If your endpoint returns a non-2xx status or times out (> 30 seconds), Valcr retries:

| Attempt | Delay |
|---|---|
| 1 | Immediate |
| 2 | 30 seconds |
| 3 | 5 minutes |
| 4 | 30 minutes |
| 5 | 2 hours |

After 5 failed attempts, the event is marked as dead and no further retries occur. The Console shows delivery status for each event.

---

## Testing your endpoint

Use the **Test** button in the Console, or:

```bash
curl -X POST "https://api.valcr.site/api/v1/console/webhooks/test" \
  -H "Authorization: Bearer {session_token}"
```

This sends a synthetic `quota.warning` event to your configured URL.

---

## Responding correctly

Your endpoint must:
- Return `2xx` within **30 seconds**
- Accept `Content-Type: application/json`
- Not depend on the order of events (events can arrive out of order)

Respond with a simple acknowledgement:

```json
{ "ok": true }
```

Long processing should be queued asynchronously — acknowledge immediately, process in the background.
