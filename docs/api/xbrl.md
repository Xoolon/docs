---
id: xbrl
title: XBRL Export
sidebar_position: 5
---

# XBRL Export API

Export merchant VCFS data as XBRL-tagged XML, suitable for regulatory filings, audit submissions, and structured financial data interchange.

**Scope required:** `export:read` (Enterprise)  
**Base path:** `https://api.valcr.site/data/v1`

---

## GET /export/xbrl

Generates and returns an XBRL document for the merchant's most recently submitted VCFS period.

### Request

```bash
GET /export/xbrl
Authorization: Bearer vcr_live_your_key
Accept: application/xml
```

### Query parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `period` | string | — | Period to export (default: latest) |
| `taxonomy` | string | — | XBRL taxonomy: `us-gaap` (default), `ifrs`, `valcr-core` |
| `format` | string | — | `xml` (default) or `json-ld` |
| `include_benchmarks` | boolean | — | Embed benchmark percentile context (default: `false`) |

### Response `200`

Content-Type: `application/xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xbrl
  xmlns="http://www.xbrl.org/2003/instance"
  xmlns:valcr="https://taxonomy.valcr.site/2024"
  xmlns:xbrli="http://www.xbrl.org/2003/instance"
  xmlns:iso4217="http://www.xbrl.org/2003/iso4217"
  xmlns:xlink="http://www.w3.org/1999/xlink">

  <schemaRef
    xlink:type="simple"
    xlink:href="https://taxonomy.valcr.site/2024/valcr-core.xsd"/>

  <!-- Context: Reporting entity and period -->
  <context id="ctx-current-period">
    <entity>
      <identifier scheme="https://valcr.site/merchants">
        mer_01HXXXXXXXXXXXXXXXX
      </identifier>
    </entity>
    <period>
      <startDate>2024-10-01</startDate>
      <endDate>2024-12-31</endDate>
    </period>
  </context>

  <!-- Unit definitions -->
  <unit id="USD">
    <measure>iso4217:USD</measure>
  </unit>
  <unit id="pure">
    <measure>xbrli:pure</measure>
  </unit>

  <!-- Revenue facts -->
  <valcr:GrossRevenue contextRef="ctx-current-period" unitRef="USD" decimals="0">
    480000
  </valcr:GrossRevenue>

  <valcr:NetRevenue contextRef="ctx-current-period" unitRef="USD" decimals="0">
    432000
  </valcr:NetRevenue>

  <!-- Margin facts -->
  <valcr:GrossMargin contextRef="ctx-current-period" unitRef="pure" decimals="4">
    0.5200
  </valcr:GrossMargin>

  <valcr:OperatingMargin contextRef="ctx-current-period" unitRef="pure" decimals="4">
    0.1400
  </valcr:OperatingMargin>

  <valcr:NetMargin contextRef="ctx-current-period" unitRef="pure" decimals="4">
    0.0900
  </valcr:NetMargin>

  <!-- Customer economics -->
  <valcr:ActiveCustomers contextRef="ctx-current-period" unitRef="pure" decimals="0">
    3840
  </valcr:ActiveCustomers>

  <valcr:AverageOrderValue contextRef="ctx-current-period" unitRef="USD" decimals="2">
    125.00
  </valcr:AverageOrderValue>

  <valcr:CustomerLifetimeValue contextRef="ctx-current-period" unitRef="USD" decimals="2">
    310.00
  </valcr:CustomerLifetimeValue>

  <valcr:CustomerAcquisitionCost contextRef="ctx-current-period" unitRef="USD" decimals="2">
    48.00
  </valcr:CustomerAcquisitionCost>

  <!-- Growth metrics -->
  <valcr:RevenueGrowthQoQ contextRef="ctx-current-period" unitRef="pure" decimals="4">
    0.1800
  </valcr:RevenueGrowthQoQ>

</xbrl>
```

---

## Taxonomy mappings

The Valcr XBRL taxonomy (`valcr-core`) maps directly to VCFS fields:

| VCFS field | XBRL element | Unit |
|---|---|---|
| `revenue.gross_revenue` | `valcr:GrossRevenue` | Currency |
| `revenue.net_revenue` | `valcr:NetRevenue` | Currency |
| `margins.gross_margin` | `valcr:GrossMargin` | Pure (ratio) |
| `margins.operating_margin` | `valcr:OperatingMargin` | Pure |
| `margins.net_margin` | `valcr:NetMargin` | Pure |
| `customers.active_customers` | `valcr:ActiveCustomers` | Pure (count) |
| `customers.average_order_value` | `valcr:AverageOrderValue` | Currency |
| `customers.customer_ltv` | `valcr:CustomerLifetimeValue` | Currency |
| `customers.customer_acquisition_cost` | `valcr:CustomerAcquisitionCost` | Currency |
| `customers.cart_abandonment_rate` | `valcr:CartAbandonmentRate` | Pure |
| `customers.repeat_purchase_rate` | `valcr:RepeatPurchaseRate` | Pure |
| `growth.revenue_growth_qoq` | `valcr:RevenueGrowthQoQ` | Pure |
| `growth.revenue_growth_yoy` | `valcr:RevenueGrowthYoY` | Pure |
| `operations.refund_rate` | `valcr:RefundRate` | Pure |

Cross-taxonomy mappings to `us-gaap` and `ifrs` are applied automatically when those taxonomies are requested.

---

## Downloading in Python

```python
import requests

r = requests.get(
    "https://api.valcr.site/data/v1/export/xbrl",
    headers={
        "Authorization": "Bearer vcr_live_your_key",
        "Accept": "application/xml",
    },
    params={
        "taxonomy":           "valcr-core",
        "include_benchmarks": False,
    },
)

r.raise_for_status()

# Save the XBRL file
with open("valcr-export-2024-Q4.xbrl", "wb") as f:
    f.write(r.content)

print(f"Exported {len(r.content):,} bytes")
```

---

## Validating the output

The exported document validates against the Valcr XBRL schema at:

```
https://taxonomy.valcr.site/2024/valcr-core.xsd
```

Use any XBRL-compliant validator (e.g. Arelle, XBRL Cloud) to verify the output before submission.

---

## Notes

- XBRL export requires a complete VCFS submission with at least 60% field completeness
- The `include_benchmarks` flag embeds percentile context as XBRL custom facts — useful for management reports
- JSON-LD format is in beta; structure may change across versions
- For bulk exports across multiple periods, contact [enterprise@valcr.site](mailto:enterprise@valcr.site)
