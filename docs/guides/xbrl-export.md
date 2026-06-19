---
id: xbrl-export
title: XBRL Export Guide
sidebar_position: 2
---

# XBRL Export Guide

This guide explains how to generate, validate, and use Valcr's XBRL export — including how VCFS fields map to XBRL taxonomy elements and how to integrate the export into reporting workflows.

---

## What is XBRL?

**eXtensible Business Reporting Language (XBRL)** is the global standard for structured financial data exchange. It tags financial data with machine-readable metadata so systems can automatically process, compare, and validate it — without parsing prose.

Valcr's XBRL export transforms your VCFS data into an XBRL instance document using the `valcr-core` taxonomy, with optional cross-mapping to `us-gaap` and `ifrs`.

---

## Use cases

| Scenario | How XBRL helps |
|---|---|
| Investor data room | Structured financials that analysts can ingest directly |
| Regulatory filing preparation | Pre-formatted for SEC/EDGAR-compatible tools |
| Lender onboarding | Machine-readable for automated underwriting |
| Audit trail | Tamper-evident structured representation of period financials |
| ERP integration | Import into SAP, Oracle, NetSuite via XBRL |

---

## Step 1 — Submit complete VCFS data

XBRL export requires a VCFS completeness score of at least **0.85**. Check your current score:

```bash
GET /merchant/vcfs
```

Look for:

```json
{
  "completeness_score": 0.92,
  "missing_fields": ["vcfs.operations.average_delivery_days"]
}
```

Fill missing fields with a `POST /merchant/vcfs` submission.

---

## Step 2 — Request the export

```bash
curl -X GET "https://api.valcr.site/data/v1/export/xbrl" \
  -H "Authorization: Bearer vcr_live_your_key" \
  -H "Accept: application/xml" \
  --output "valcr-2024-Q4.xbrl"
```

### With benchmark context embedded

```bash
curl -X GET "https://api.valcr.site/data/v1/export/xbrl?include_benchmarks=true" \
  -H "Authorization: Bearer vcr_live_your_key" \
  -H "Accept: application/xml" \
  --output "valcr-2024-Q4-with-benchmarks.xbrl"
```

When `include_benchmarks=true`, the document includes custom elements like:

```xml
<valcr:GrossMarginBenchmarkP50 contextRef="ctx-current-period" unitRef="pure" decimals="4">
  0.4400
</valcr:GrossMarginBenchmarkP50>
<valcr:GrossMarginPercentile contextRef="ctx-current-period" unitRef="pure" decimals="1">
  71.4
</valcr:GrossMarginPercentile>
```

---

## Step 3 — Validate the document

### Using Arelle (recommended)

[Arelle](https://arelle.org) is the industry-standard open-source XBRL processor.

```bash
pip install arelle-release

# Validate against Valcr taxonomy
arelleCmdLine \
  --file valcr-2024-Q4.xbrl \
  --validate \
  --disclosureSystem https://taxonomy.valcr.site/2024
```

A valid document outputs:

```
INFO - Arelle version 2.x.x
INFO - Loaded schema https://taxonomy.valcr.site/2024/valcr-core.xsd
INFO - Document validated successfully: 0 errors, 0 warnings
```

### Python validation

```python
from arelle import Cntlr

ctrl = Cntlr.Cntlr()
modelXbrl = ctrl.modelManager.load("valcr-2024-Q4.xbrl")

errors = [e for e in modelXbrl.errors if e.severity == "ERROR"]
if errors:
    for e in errors:
        print(f"ERROR: {e.message}")
else:
    print("✓ Valid XBRL document")
```

---

## Step 4 — Parse the output

### Python — extracting facts

```python
import xml.etree.ElementTree as ET

tree = ET.parse("valcr-2024-Q4.xbrl")
root = tree.getroot()

NS = {
    "valcr": "https://taxonomy.valcr.site/2024",
    "xbrli": "http://www.xbrl.org/2003/instance",
}

# Extract all facts
facts = {}
for elem in root:
    tag = elem.tag.split("}")[-1] if "}" in elem.tag else elem.tag
    if elem.text and elem.text.strip():
        facts[tag] = {
            "value":      elem.text.strip(),
            "context":    elem.attrib.get("contextRef"),
            "unit":       elem.attrib.get("unitRef"),
            "decimals":   elem.attrib.get("decimals"),
        }

gross_margin = float(facts["GrossMargin"]["value"])
print(f"Gross margin: {gross_margin:.1%}")  # → 52.0%
```

### Node.js — with `fast-xml-parser`

```typescript
import { XMLParser } from 'fast-xml-parser'
import fs from 'fs'

const xml = fs.readFileSync('valcr-2024-Q4.xbrl', 'utf8')
const parser = new XMLParser({ ignoreAttributes: false })
const doc = parser.parse(xml)

const xbrl = doc['xbrl']
const grossMargin = parseFloat(xbrl['valcr:GrossMargin']['#text'])
console.log(`Gross margin: ${(grossMargin * 100).toFixed(1)}%`)
```

---

## Taxonomy reference

The Valcr taxonomy XSD is available at:

```
https://taxonomy.valcr.site/2024/valcr-core.xsd
```

### VCFS → XBRL element mapping

| VCFS field | XBRL element | Data type | Unit |
|---|---|---|---|
| `revenue.gross_revenue` | `valcr:GrossRevenue` | `monetaryItemType` | Currency |
| `revenue.net_revenue` | `valcr:NetRevenue` | `monetaryItemType` | Currency |
| `revenue.recurring_revenue` | `valcr:RecurringRevenue` | `monetaryItemType` | Currency |
| `margins.gross_margin` | `valcr:GrossMargin` | `pureItemType` | pure |
| `margins.operating_margin` | `valcr:OperatingMargin` | `pureItemType` | pure |
| `margins.net_margin` | `valcr:NetMargin` | `pureItemType` | pure |
| `growth.revenue_growth_qoq` | `valcr:RevenueGrowthQoQ` | `pureItemType` | pure |
| `growth.revenue_growth_yoy` | `valcr:RevenueGrowthYoY` | `pureItemType` | pure |
| `customers.active_customers` | `valcr:ActiveCustomers` | `integerItemType` | pure |
| `customers.average_order_value` | `valcr:AverageOrderValue` | `monetaryItemType` | Currency |
| `customers.customer_ltv` | `valcr:CustomerLifetimeValue` | `monetaryItemType` | Currency |
| `customers.customer_acquisition_cost` | `valcr:CustomerAcquisitionCost` | `monetaryItemType` | Currency |
| `customers.cart_abandonment_rate` | `valcr:CartAbandonmentRate` | `pureItemType` | pure |
| `customers.repeat_purchase_rate` | `valcr:RepeatPurchaseRate` | `pureItemType` | pure |
| `operations.refund_rate` | `valcr:RefundRate` | `pureItemType` | pure |
| `operations.fulfillment_rate` | `valcr:FulfillmentRate` | `pureItemType` | pure |
| `operations.average_delivery_days` | `valcr:AverageDeliveryDays` | `decimalItemType` | pure |

---

## Automating exports

Set up a scheduled export using a cron job or serverless function:

```python
import requests, boto3, datetime

def export_and_store():
    period = f"{datetime.date.today().year}-Q{(datetime.date.today().month - 1) // 3 + 1}"

    r = requests.get(
        "https://api.valcr.site/data/v1/export/xbrl",
        headers={"Authorization": f"Bearer {os.environ['VALCR_API_KEY']}"},
        params={"period": period},
    )
    r.raise_for_status()

    filename = f"valcr-{period}.xbrl"
    boto3.client("s3").put_object(
        Bucket="my-financial-exports",
        Key=filename,
        Body=r.content,
        ContentType="application/xml",
    )
    print(f"Exported {filename} ({len(r.content):,} bytes)")

export_and_store()
```

---

## Limitations

- XBRL export is available on **Enterprise** plans only
- Minimum VCFS completeness score of 0.85 required
- Exports are generated on demand; complex documents may take up to 5 seconds
- Historical period exports are available for all periods with VCFS submissions
- The `ifrs` taxonomy mapping is in beta — contact [enterprise@valcr.site](mailto:enterprise@valcr.site) for production use
