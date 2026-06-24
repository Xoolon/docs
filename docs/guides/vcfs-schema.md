---
id: vcfs-schema
title: "VCFS Schema"
sidebar_position: 4
description: "Complete VCFS field reference: definitions, calculation methodology, completeness scoring, and platform extraction guides for Shopify, Amazon, and WooCommerce."
keywords: [vcfs schema, valcr commerce financial schema, ecommerce financial data standard, gross margin definition]
image: /img/valcr-social-card.png
---

# VCFS Schema

The **Valcr Commerce Financial Schema (VCFS)** is the structured data model that underpins all Valcr benchmark comparisons, scores, and insights. Understanding it is essential for submitting accurate merchant data and interpreting API responses.

---

## What is VCFS?

VCFS is a canonical financial schema designed specifically for commerce operators. It normalizes the diverse financial data structures that exist across different platforms (Shopify, Amazon, WooCommerce, QuickBooks, etc.) into a single, consistent model that enables apples-to-apples comparison.

Every field maps to a standard XBRL taxonomy element, enabling structured regulatory export.

---

## Schema structure

```
vcfs/
├── revenue/
│   ├── gross_revenue          # Total revenue before deductions
│   ├── net_revenue            # After returns, discounts
│   ├── recurring_revenue      # Subscriptions, memberships
│   ├── non_recurring_revenue  # One-time / project revenue
│   └── currency               # ISO 4217 currency code
│
├── margins/
│   ├── gross_margin           # (net_revenue - COGS) / net_revenue
│   ├── operating_margin       # EBIT / net_revenue
│   └── net_margin             # Net income / net_revenue
│
├── growth/
│   ├── revenue_growth_qoq     # Quarter-over-quarter change
│   ├── revenue_growth_yoy     # Year-over-year change
│   └── unit_growth_qoq        # Order/unit volume QoQ
│
├── customers/
│   ├── active_customers       # Customers with ≥1 order in period
│   ├── new_customers          # First-time buyers this period
│   ├── churned_customers      # No order in period vs. prior period
│   ├── average_order_value    # Net revenue / order count
│   ├── customer_ltv           # Projected lifetime value
│   ├── customer_acquisition_cost  # Fully loaded CAC
│   ├── cart_abandonment_rate  # Carts abandoned / carts created
│   └── repeat_purchase_rate   # Customers with ≥2 orders / total
│
├── operations/
│   ├── refund_rate            # Refund value / gross revenue
│   ├── fulfillment_rate       # Orders fulfilled on time
│   └── average_delivery_days  # Mean days from order to delivery
│
└── channel/
    ├── direct                 # Share from own website
    ├── amazon                 # Share from Amazon
    ├── shopify                # Share from Shopify
    ├── wholesale              # Share from B2B wholesale
    └── other                  # All other channels
```

---

## Field reference

### `revenue` object

| Field | Type | Unit | Description |
|---|---|---|---|
| `gross_revenue` | float | Currency | Total revenue before any deductions |
| `net_revenue` | float | Currency | Gross minus returns, discounts, allowances |
| `recurring_revenue` | float | Currency | Revenue from recurring contracts or subscriptions |
| `non_recurring_revenue` | float | Currency | One-time, project, or seasonal revenue |
| `currency` | string | ISO 4217 | Three-letter currency code (e.g. `USD`, `KES`, `GBP`) |

### `margins` object

| Field | Type | Range | Formula |
|---|---|---|---|
| `gross_margin` | float | 0–1 | `(net_revenue - COGS) / net_revenue` |
| `operating_margin` | float | -∞ to 1 | `EBIT / net_revenue` |
| `net_margin` | float | -∞ to 1 | `net_income / net_revenue` |

### `growth` object

| Field | Type | Unit | Description |
|---|---|---|---|
| `revenue_growth_qoq` | float | ratio | Change vs prior quarter: `(current - prior) / prior` |
| `revenue_growth_yoy` | float | ratio | Change vs same quarter prior year |
| `unit_growth_qoq` | float | ratio | Order volume change vs prior quarter |

### `customers` object

| Field | Type | Unit | Description |
|---|---|---|---|
| `active_customers` | integer | count | Unique customers with ≥1 order in the reporting period |
| `new_customers` | integer | count | First-time buyers in the period |
| `churned_customers` | integer | count | Customers active last period but not this one |
| `average_order_value` | float | Currency | `net_revenue / order_count` |
| `customer_ltv` | float | Currency | Projected revenue over customer lifetime |
| `customer_acquisition_cost` | float | Currency | Fully loaded marketing + sales spend / new customers |
| `cart_abandonment_rate` | float | 0–1 | `abandoned_carts / initiated_carts` |
| `repeat_purchase_rate` | float | 0–1 | `customers_with_2+_orders / total_customers` |

### `operations` object

| Field | Type | Unit | Description |
|---|---|---|---|
| `refund_rate` | float | 0–1 | `total_refund_value / gross_revenue` |
| `fulfillment_rate` | float | 0–1 | Orders delivered on time / total orders |
| `average_delivery_days` | float | days | Mean days from purchase to delivery |

### `channel` object

All channel values are ratios that sum to 1.0:

| Field | Type | Description |
|---|---|---|
| `direct` | float | Own website / app |
| `amazon` | float | Amazon marketplace |
| `shopify` | float | Shopify storefronts |
| `wholesale` | float | B2B wholesale accounts |
| `other` | float | Any other channel |

:::info
Channels must sum to 1.0. If they don't, Valcr normalizes them automatically.
:::

---

## Completeness scoring

VCFS submissions are scored for completeness on a 0–1 scale. Higher completeness unlocks:

| Score | Unlocks |
|---|---|
| ≥ 0.30 | Basic benchmark comparisons |
| ≥ 0.50 | Percentile rankings, segment breakdown |
| ≥ 0.70 | AI insights, peer comparison |
| ≥ 0.85 | Valcr Score, XBRL export |
| 1.00 | Full score confidence + all export formats |

The `completeness_score` and `missing_fields` array are returned in every `POST /merchant/vcfs` response.

---

## Minimum viable submission

The minimum fields required for any benchmark comparison:

```json
{
  "period_start": "2024-10-01",
  "period_end":   "2024-12-31",
  "vcfs": {
    "revenue": {
      "net_revenue": 432000,
      "currency":    "USD"
    },
    "margins": {
      "gross_margin": 0.52
    }
  }
}
```

---

## Currency support

VCFS accepts any ISO 4217 currency. Valcr normalizes all values to USD at period-average exchange rates for cross-merchant comparisons. The original currency and values are always preserved.

Supported currencies include: `USD`, `EUR`, `GBP`, `KES`, `NGN`, `GHS`, `ZAR`, `INR`, `BRL`, `CAD`, `AUD`, and 140+ others.

---

## Platform extraction helpers

Common field mappings from popular platforms:

### Shopify

| VCFS field | Shopify source |
|---|---|
| `revenue.gross_revenue` | `total_price` sum |
| `revenue.net_revenue` | `subtotal_price` minus discounts |
| `customers.average_order_value` | Analytics → AOV |
| `customers.cart_abandonment_rate` | Analytics → Checkout abandonment |
| `margins.gross_margin` | Requires COGS from inventory |

### Amazon Seller Central

| VCFS field | Amazon source |
|---|---|
| `revenue.gross_revenue` | Business Reports → Sales |
| `customers.average_order_value` | Business Reports → Average Sales |
| `operations.refund_rate` | Payments → Refunds / Net Sales |

See the [XBRL Export Guide](/guides/xbrl-export) for how VCFS fields map to XBRL taxonomy elements.
