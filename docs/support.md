---
id: support
title: "Support"
sidebar_position: 99
description: "Get help with the Valcr API, console, billing, and store connections. Contact support, browse FAQs, and find relevant documentation."
keywords: [valcr support, api help, valcr contact, valcr faq, billing support]
image: /img/valcr-social-card.png
---


# Support

Need help? Start with the FAQs below — most common questions are answered here. If you can't find what you need, use the contact form or email us directly.

---

## Contact

| Channel | Use for | Address |
|---|---|---|
| **support@valcr.site** | API issues, account problems, billing questions, general help | [support@valcr.site](mailto:support@valcr.site) |
| **teams@valcr.site** | Enterprise inquiries, team plans, partnerships, custom data agreements | [teams@valcr.site](mailto:teams@valcr.site) |

We respond to all support emails within **24 hours on business days**. For Enterprise accounts, priority response is guaranteed within **4 hours**.

---

## Send a message

:::info Direct email is fastest
Emailing [support@valcr.site](mailto:support@valcr.site) directly is the fastest way to reach us. Include your account email and a description of the issue.
:::

When contacting support, please include:
- Your **account email** (so we can look up your account)
- The **API key prefix** if the issue relates to a specific key (e.g. `vcr_live_xKj9Rz`)
- The **HTTP status code and error message** you received
- The **endpoint and request** that produced the error (you can redact sensitive values)

---

## Frequently asked questions

### Account & Access

<details>
<summary><strong>How do I create a Valcr account?</strong></summary>

Go to [valcr.site/login](https://valcr.site/login) and click "Create account". You can sign up with your email and password, or continue with Google. Once your account is created, you can access the [Console](https://console.valcr.site) to create API keys.

</details>

<details>
<summary><strong>I forgot my password. How do I reset it?</strong></summary>

Go to [valcr.site/forgot-password](https://valcr.site/forgot-password) and enter your email address. You'll receive a reset link within a few minutes. Check your spam folder if it doesn't arrive.

</details>

<details>
<summary><strong>Can I use the same account for both the Valcr platform and the Data API Console?</strong></summary>

Yes. Your Valcr account is shared across the platform at valcr.site and the Console at console.valcr.site. You log in once and have access to both. Billing is separate — your platform subscription and your API subscription are independent.

</details>

<details>
<summary><strong>My email verification link expired. What do I do?</strong></summary>

Log in to the Console — you'll see a banner with a "Resend verification" link. Click it and a new link will be sent immediately. Verification links expire after 24 hours.

</details>

---

### API Keys

<details>
<summary><strong>I lost my API key. Can I recover it?</strong></summary>

No. Valcr stores only a SHA-256 hash of your key — the raw value is never persisted. If you've lost the key, rotate it: go to **Console → API Keys → expand the key → Rotate key**. You'll receive a new key immediately.

</details>

<details>
<summary><strong>How many API keys can I create?</strong></summary>

The number of **live keys** is limited by your plan: 2 on Developer, 5 on Startup, 10 on Growth, unlimited on Enterprise. **Test keys** (`vcr_test_*`) are unlimited on all plans. You can also create live keys that are rotated or revoked without counting toward the limit.

</details>

<details>
<summary><strong>What's the difference between a live key and a test key?</strong></summary>

Live keys (`vcr_live_*`) return real benchmark data and count against your monthly quota. Test keys (`vcr_test_*`) return seeded/synthetic data and never count against quota or trigger billing. Use test keys for all development, staging, and CI environments.

</details>

<details>
<summary><strong>My API key is returning 403 Forbidden. Why?</strong></summary>

A `403` means your key is valid but doesn't have permission for the endpoint you're calling. Check that:
1. Your key has the required scope (expand the key in Console → view Scopes)
2. Your account tier includes that scope (see the [Pricing guide](./guides/pricing.md))

For example, `merchant:read` requires a Startup plan or higher. If your key was created on a Developer plan, it won't have this scope even if you've since upgraded — you'll need to create a new key.

</details>

<details>
<summary><strong>I'm getting 429 Too Many Requests. What's my rate limit?</strong></summary>

Rate limits are per key, per minute:
- Developer: 60 requests/minute
- Startup: 100 requests/minute
- Growth: 300 requests/minute

The response includes `Retry-After: <seconds>` and `X-RateLimit-Reset: <timestamp>` headers. Wait the specified number of seconds before retrying. For sustained high-volume usage, consider upgrading your plan.

</details>

<details>
<summary><strong>How do I rotate an API key?</strong></summary>

Go to **Console → API Keys → expand the key → Rotate key**. The old key is immediately invalidated. A new raw key is shown once — copy it before closing the modal. Update your integration before rotating in production to avoid downtime.

</details>

---

### Data & Benchmarks

<details>
<summary><strong>How often is benchmark data updated?</strong></summary>

Benchmark distributions are updated **quarterly** — typically in the first week of January, April, July, and October. The API returns the period with each response (e.g. `"period": "2024-Q4"`) so you can always see which dataset version you're querying.

</details>

<details>
<summary><strong>How large is the benchmark sample for my category?</strong></summary>

Every benchmark response includes a `sample_size` field showing how many merchants contributed to that distribution. The minimum sample size for any published benchmark is 30 merchants per segment. Segments with fewer than 30 merchants are suppressed.

</details>

<details>
<summary><strong>My gross margin looks different from what I calculate myself. Why?</strong></summary>

The most common reason is a difference in COGS definition. Valcr uses the VCFS definition: `gross_margin = (net_revenue - COGS) / net_revenue`, where COGS is product cost only — not shipping, not platform fees, not marketing. If your own calculation includes shipping or fees in COGS, your margin will appear lower than what Valcr shows. See the [VCFS Schema guide](/docs-valcr/docs/guides/vcfs-schema.md#margins-object) for exact definitions.

</details>

<details>
<summary><strong>Can I get benchmark data for a country or region other than the US?</strong></summary>

The current benchmark pool is predominantly US and UK merchants. Regional filtering is on the roadmap. If your business operates in a specific region and you need regionally-adjusted benchmarks, contact [teams@valcr.site](mailto:teams@valcr.site) to discuss Enterprise data options.

</details>

<details>
<summary><strong>Can Valcr access my Shopify data without OAuth?</strong></summary>

No. Valcr only reads store data through explicit OAuth authorization that you grant. We never scrape, access, or infer data from your store without your permission. You can revoke access at any time by disconnecting the store in your Valcr dashboard or removing the app in your Shopify admin.

</details>

---

### VCFS & Store Connections

<details>
<summary><strong>Why is my VCFS completeness score low?</strong></summary>

VCFS completeness is based on how many of the 20+ fields in the schema have been populated. A low score usually means:
1. You've only submitted revenue data but not customer economics, operations, or channel mix
2. Some fields couldn't be detected from your file upload (try mapping them manually)
3. Your connected store doesn't provide certain data (e.g. Etsy doesn't expose COGS)

The `missing_fields` array in the VCFS response tells you exactly which fields are absent. Add them via `POST /merchant/vcfs` or by re-uploading a more complete file.

</details>

<details>
<summary><strong>Shopify connection failed. What do I do?</strong></summary>

Common causes and fixes:
- **"Invalid shop domain"** — use `yourstore.myshopify.com`, not your custom domain
- **"App installation failed"** — your Shopify account needs the "Manage apps" permission
- **"Store already connected"** — disconnect first in Console → Settings → Connected Stores, then reconnect
- **OAuth redirect error** — try in an incognito window to rule out cookie issues

If none of these help, email [support@valcr.site](mailto:support@valcr.site) with your shop domain and the error message.

</details>

<details>
<summary><strong>My file upload says "low confidence". How do I fix it?</strong></summary>

Low confidence means Valcr could only map one or two columns from your file. To improve it:
1. On the mapping screen, manually assign VCFS fields to any undetected columns
2. Make sure you're uploading a data file, not a summary report (individual row data maps better)
3. Use one of the [recommended export formats](./guides/connect-store.md#shopify-export-instructions) from your platform

</details>

---

### Billing & Subscriptions

<details>
<summary><strong>How do I cancel my subscription?</strong></summary>

Go to **Console → Billing → Billing portal**. This opens your Paystack customer portal where you can cancel. Cancellation takes effect at the end of your current billing period — you retain access until then.

</details>

<details>
<summary><strong>My payment failed. What happens?</strong></summary>

If an automatic payment fails, Valcr will:
1. Retry the charge after 24 hours
2. Send an email notification to your account email
3. Fire an `invoice.failed` webhook if you have one configured

If the retry also fails, your account enters a grace period of 7 days during which API access continues. After 7 days without a successful payment, API access is suspended until billing is resolved.

To update your payment method: **Console → Billing → Billing portal**.

</details>

<details>
<summary><strong>I was charged for a quota top-up I didn't expect. Can I get a refund?</strong></summary>

Quota top-ups are triggered automatically when you exhaust your monthly limit. This behaviour is documented in the [Pricing guide](/docs-valcr/docs/guides/pricing.md#what-happens-when-you-hit-the-limit). If you'd prefer to have API access suspended rather than auto-billed when quota runs out, contact [support@valcr.site](mailto:support@valcr.site) to disable auto-billing on your account.

Refunds for unexpected charges are evaluated case by case — email [support@valcr.site](mailto:support@valcr.site) with your account email and invoice details.

</details>

---

## Related documentation

Quick links to the most commonly referenced pages:

- [Quickstart — make your first API call](/docs-valcr/docs/quickstart.md)
- [Authentication — API keys, scopes, rotation](./auth.md)
- [Connect a Store — Shopify, Etsy, file upload](./guides/connect-store.md)
- [Pricing & Billing — plans, quota, invoices](./guides/pricing.md)
- [Valcr Score — how it's calculated and why to trust it](./guides/valcr-score.md)
- [VCFS Schema — field definitions and methodology](./guides/vcfs-schema.md)
- [Webhooks — real-time event notifications](./webhooks.md)
- [Security — data handling and disclosure policy](./guides/security.md)

---

## Status

Check the current API status at [status.valcr.site](https://valcr.site). Subscribe to status updates to receive email notifications for incidents and planned maintenance.
