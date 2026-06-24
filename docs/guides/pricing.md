---
id: pricing
title: "Pricing and Billing"
sidebar_position: 2
description: "Valcr pricing tiers, what is included, how billing works, automatic quota top-ups, and how to manage your subscription."
keywords: [valcr pricing, valcr api cost, developer plan, startup plan, growth plan, enterprise, billing, paystack]
image: /img/valcr-social-card.png
---

# Pricing & Billing

Valcr has two separate pricing surfaces: the **Valcr Platform** (the dashboard, calculators, and benchmarking UI at valcr.site) and the **Data API** (programmatic access via authenticated API keys). This page covers the Data API pricing.

For platform pricing, see [valcr.site/pricing](https://valcr.site/pricing).

---

## Data API plans

| | Developer | Startup | Growth | Enterprise |
|---|---|---|---|---|
| **Price** | $29/mo | $99/mo | $299/mo | Custom |
| **API calls/month** | 10,000 | 100,000 | 500,000 | Unlimited |
| **Live API keys** | 2 | 5 | 10 | Unlimited |
| **Rate limit** | 60 req/min | 100 req/min | 300 req/min | Custom |
| **Scopes included** | benchmarks, segments | + merchant:read | + merchant:write, insights, compare | All scopes |
| **Support** | Email | Email (priority) | Email + Slack | Dedicated |
| **SLA** | None | None | 99.9% uptime | Custom |
| **XBRL export** | ✗ | ✗ | ✗ | ✓ |
| **Valcr Score** | ✗ | ✗ | ✗ | ✓ |

---

## What each plan includes

### Developer — $29/month

The Developer plan is for building and testing integrations. It gives you:
- `benchmarks:read` — access to all benchmark percentile endpoints
- `segments:read` — access to segment lists and breakdowns
- 2 live API keys (plus unlimited test keys)
- 10,000 calls per month — sufficient for integration testing and low-volume production use

Best for: fintech developers, SaaS platforms evaluating the API, early-stage integrations.

### Startup — $99/month

Everything in Developer, plus:
- `merchant:read` — access to merchant VCFS profiles and peer comparison
- 5 live API keys
- 100,000 calls per month

Best for: lenders running pre-approval checks, SaaS tools adding benchmark features, growing data consumers.

### Growth — $299/month

Everything in Startup, plus:
- `merchant:write` — submit and update merchant VCFS profiles
- `insights:read` — AI-generated causal insight narratives
- `compare:read` — detailed peer group comparison with full distributions
- 10 live API keys
- 500,000 calls per month
- Priority email support

Best for: production underwriting pipelines, embedded benchmark features in high-volume SaaS products, portfolio monitoring tools.

### Enterprise — Custom pricing

Everything in Growth, plus:
- `score:read` — the composite Valcr Score endpoint
- `report:read` — structured full-period performance reports
- `export:read` — XBRL-tagged financial export
- Unlimited API keys and calls
- Custom rate limits
- 99.9% uptime SLA
- Dedicated Slack channel
- Custom taxonomy mapping for XBRL

Contact [teams@valcr.site](mailto:teams@valcr.site) for Enterprise pricing.

---

## How billing works

### Payment processor

Valcr uses [Paystack](https://paystack.com) for payment processing. Paystack supports:
- Visa, Mastercard, American Express
- Bank transfers (select regions)
- USSD (select African markets)

Your card details are stored and processed by Paystack — Valcr never handles raw card data.

### Billing cycle

Subscriptions are billed monthly on the anniversary of the date you subscribed. For example, if you subscribe on the 15th, you'll be billed on the 15th of each subsequent month.

### Prorated upgrades

When you upgrade from one tier to another mid-cycle, you are charged the difference prorated to the remaining days in your billing period. You gain access to the higher tier immediately.

### Downgrades

Downgrades take effect at the end of the current billing period. You retain access to your current tier until then.

---

## Quota & automatic top-ups

### How quota works

Your monthly API call quota resets at the start of each billing period. Quota is tracked per account, not per key — all your API keys share the same pool.

### What happens when you hit the limit

When your quota reaches 0:

1. The next API request returns `402 Payment Required` with the error code `billing.quota_exhausted`
2. **A Paystack charge is triggered automatically** for one additional quota block (same as your monthly plan amount)
3. Once the charge clears, your quota resets and API access resumes
4. A `quota.exhausted` webhook event fires to your configured endpoint (if set up)

This means your integration continues running without manual intervention — you're simply billed for the overage.

### Disabling auto-billing

If you prefer to have API access suspended when quota runs out rather than auto-billed, contact [support@valcr.site](mailto:support@valcr.site) and we'll configure this for your account.

### Monitoring quota

Check your current quota status at any time:

```bash
GET https://api.valcr.site/api/v1/console/usage/summary

{
  "today": 1240,
  "daily_limit": 333,
  "month": 8820,
  "monthly_limit": 10000,
  "token_balance": 1180
}
```

You can also configure a `quota.warning` webhook to receive a notification when you reach 80% of your monthly limit.

---

## Invoices & receipts

All invoices are accessible in the Console under **Billing → Invoice history**. Each invoice includes:
- Invoice date and number
- Amount charged
- Payment status
- Paystack transaction reference
- PDF download link

For accounting or tax purposes, the PDF invoice includes Valcr's legal entity details (Cyntax LLC).

---

## Cancellation

You can cancel your subscription at any time from **Console → Billing → Billing portal** or by emailing [support@valcr.site](mailto:support@valcr.site).

- Cancellation takes effect at the end of the current billing period
- You retain API access until the period ends
- Your API keys, usage history, and VCFS data are preserved for 30 days after cancellation
- After 30 days, account data is permanently deleted unless you resubscribe

---

## Free tier / test keys

There is no free tier for the Data API. However:

- **Test keys** (`vcr_test_*`) never count against quota and return seeded/synthetic data
- Test keys are available on all paid plans with no additional cost
- Use test keys for all development, CI/CD, and staging environments

---

## Frequently asked questions

**Can I switch plans at any time?**  
Yes. Upgrades are immediate and prorated. Downgrades take effect at the end of your billing period.

**Is there an annual billing option?**  
Annual billing (with a 2-month discount) is available on request. Contact [teams@valcr.site](mailto:teams@valcr.site).

**What happens to my data if I cancel?**  
Your API keys, usage logs, and VCFS data are retained for 30 days after cancellation, then permanently deleted. You can export your VCFS data via the API before cancelling.

**Do you offer discounts for startups or non-profits?**  
We offer discounted rates for early-stage startups (under $500K ARR) and academic/research institutions. Contact [teams@valcr.site](mailto:teams@valcr.site) with your details.

**Is VAT included in the price?**  
Prices are exclusive of VAT. If you're in a VAT-applicable jurisdiction, VAT will be added at checkout based on your billing address.

**What currencies do you accept?**  
Paystack processes in USD by default. Bank transfer and local currency options are available for select African markets — contact us if you need an alternative.

**Can I get a refund?**  
We offer a full refund within 7 days of your first subscription payment if you haven't made more than 1,000 API calls. After 7 days or 1,000 calls, subscriptions are non-refundable.

**How do I update my payment method?**  
Go to **Console → Billing → Billing portal** to update your card details directly in the Paystack customer portal.

---

## Enterprise custom agreements

For Enterprise accounts, Valcr offers:
- Custom pricing based on volume
- Annual contracts with SLA
- Data processing agreements (DPA) for GDPR compliance
- Custom onboarding and dedicated integration support
- White-label data licensing

Contact [teams@valcr.site](mailto:teams@valcr.site) to start a conversation.
