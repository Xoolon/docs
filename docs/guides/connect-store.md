---
id: connect-store
title: "Connect a Store"
sidebar_position: 1
description: "How to connect your Shopify or Etsy store to Valcr, or upload a CSV/Excel file manually. Step-by-step guide for all connection methods."
keywords: [connect shopify valcr, connect etsy valcr, upload csv valcr, store connection, vcfs data import]
image: /img/valcr-social-card.png
---

# Connect a Store

Valcr can pull your financial data automatically from Shopify and Etsy via OAuth, or you can upload a CSV or Excel file directly. This guide covers all three methods.

---

## Method 1 — Shopify

### What gets imported

Once connected, Valcr reads:
- Gross revenue and net revenue (after refunds and discounts)
- Order count and average order value
- Returns and refunds
- Product-level cost data (if COGS is set in Shopify)
- Shipping revenue

The data is normalised into VCFS format automatically. You can see the field mapping in the [VCFS Schema guide](/guides/vcfs-schema).

### How to connect

1. **Go to your Valcr dashboard** → click **Connect Store** → select **Shopify**
2. Enter your store URL in the format `yourstore.myshopify.com`  
   *(You can also enter just `yourstore` and Valcr will append `.myshopify.com` automatically)*
3. Click **Connect with Shopify** — you'll be redirected to Shopify's OAuth consent screen
4. Review the permissions Valcr requests and click **Install app**
5. You'll be redirected back to Valcr — your store data will begin importing immediately

### Permissions Valcr requests

| Permission | Why |
|---|---|
| `read_orders` | Revenue, order count, AOV |
| `read_products` | COGS if set in Shopify |
| `read_customers` | Customer count, LTV calculation |
| `read_analytics` | Session and conversion data (if available) |

Valcr requests **read-only** access. We cannot modify your store, create orders, or change product listings.

### Shopify plan requirements

Shopify OAuth works on all Shopify plans including Basic. Shopify Plus merchants have access to additional reporting endpoints that improve the accuracy of COGS calculations.

### Troubleshooting Shopify

**"Invalid shop domain"** — ensure your URL ends in `.myshopify.com`. Custom domains like `yourbrand.com` won't work for the OAuth flow.

**"App installation failed"** — check that your Shopify account has the "Manage apps" permission. Sub-accounts without this permission cannot install third-party apps.

**Data not appearing after connection** — initial import can take 2–5 minutes for stores with large order histories. Refresh your Valcr dashboard after 5 minutes.

---

## Method 2 — Etsy

### What gets imported

- Gross revenue and net revenue
- Transaction fees and payment processing fees
- Shipping revenue
- Product listings (for category classification)
- Order count and average order value

### How to connect

1. Go to **Connect Store** → select **Etsy**
2. You'll be redirected to Etsy's OAuth screen
3. Click **Allow Access**
4. Valcr imports your last 12 months of transaction data immediately

### Note on Etsy data

Etsy's API does not expose COGS data — you'll need to provide this manually in your Valcr profile settings for accurate gross margin calculations. Valcr will prompt you for this after connection.

---

## Method 3 — Manual CSV / Excel Upload

The file upload method works for any platform — WooCommerce, Amazon, QuickBooks, custom exports, or any spreadsheet with financial data.

### Supported file formats

- `.csv` — any encoding (UTF-8, UTF-16)
- `.xlsx` — Excel 2007 and later
- `.xls` — older Excel format
- Maximum file size: **50MB**

### What columns Valcr looks for

Valcr auto-detects columns on upload. The following are recognised automatically:

| VCFS field | Common column names Valcr recognises |
|---|---|
| `gross_revenue` | Total Sales, Gross Revenue, Revenue, Sales |
| `net_revenue` | Net Sales, Net Revenue |
| `returns_and_refunds` | Returns, Refunds, Refund Amount |
| `cogs` | COGS, Cost of Goods, Product Cost |
| `ad_spend` | Ad Spend, Marketing, Advertising |
| `platform_fees` | Fees, Transaction Fees, Platform Fees |
| `order_count` | Orders, Order Count, # Orders |
| `units_sold` | Units, Quantity, Items Sold |

### Upload process

1. Go to **Connect Store** → **Upload File**
2. Drag and drop your file, or click to browse
3. Valcr previews the first 5 rows and detects column mappings automatically
4. Review the mapping — adjust any fields that were incorrectly detected
5. Select your platform (Shopify, Amazon, WooCommerce, Etsy, QuickBooks, or Custom)
6. Select your product category for accurate benchmark comparison
7. Click **Process file**

### Column mapping screen

After upload, you'll see a mapping screen with two columns:
- **Your file's column names** (left)
- **VCFS field they map to** (right — editable dropdown)

You only need to map `gross_revenue` at minimum. Every additional field you map improves your VCFS completeness score and unlocks more precise benchmarking.

### Confidence score

After processing, Valcr shows a **data confidence score** (0–100%):

| Score | Meaning |
|---|---|
| 70–100% | Sufficient for full benchmark comparison |
| 45–70% | Basic benchmarks available — map more fields to improve |
| Below 45% | Limited data — gross revenue is likely the only mapped field |

### Shopify export instructions

If you're using file upload for Shopify data (instead of OAuth), here's how to export:

1. Shopify Admin → **Analytics** → **Reports** → **Finances summary**
2. Set date range to the period you want to analyse
3. Click **Export** → **Export CSV**
4. Upload this file to Valcr

For COGS data: Shopify Admin → **Products** → export your product CSV, which includes cost per item.

### Amazon Seller Central export

1. Seller Central → **Reports** → **Business Reports** → **By Date**
2. Set date range → click **Download (.csv)**
3. Upload to Valcr — Valcr recognises Amazon's column names automatically

### WooCommerce export

1. WooCommerce → **Reports** → **Orders** → set date range → **Export CSV**
2. For more complete data: install the WooCommerce Cost of Goods plugin and include COGS in your export

---

## Managing connected stores

Once connected, you can:
- **Refresh** — pull the latest data from a connected store
- **Disconnect** — remove the OAuth connection (your existing VCFS data is preserved)
- **Re-connect** — reconnect after disconnecting to resume automatic updates

Go to **Dashboard** → **Settings** → **Connected Stores** to manage all connections.

---

## Data freshness

| Connection method | Data frequency |
|---|---|
| Shopify OAuth | Updated daily, automatically |
| Etsy OAuth | Updated daily, automatically |
| File upload | Static snapshot — re-upload to update |

---

## Questions?

If you have issues connecting a store, email [support@valcr.site](mailto:support@valcr.site) with your store URL and the error message you're seeing.
