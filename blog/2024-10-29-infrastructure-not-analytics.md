---
slug: infrastructure-not-analytics
title: Why Valcr Is Infrastructure, Not Analytics
authors: [glen]
tags: [product, strategy, infrastructure, positioning]
date: 2024-10-29
description: "Why Valcr is financial data infrastructure for commerce, not an analytics product — the Stripe/Plaid analogy and the compounding dataset thesis."
keywords: [commerce data infrastructure, financial data api, ecommerce intelligence platform, benchmark data infrastructure]
image: /img/valcr-social-card.png
---

# Why Valcr Is Infrastructure, Not Analytics

The most common misreading of what Valcr does is to categorise it as an analytics product. An ecommerce dashboard. A benchmarking tool. A reporting layer.

These descriptions are not wrong exactly — Valcr does produce analytics, benchmarks, and reports. But they point to the wrong part of the product. And that distinction matters enormously, because analytics and infrastructure are different businesses with different economics, different buyers, and different reasons to exist.

<!--truncate-->

## What analytics does

An analytics product takes your data and shows it back to you in a more useful form. A well-designed analytics product surfaces patterns you would have missed, answers questions faster than a spreadsheet would, and helps you make better decisions.

Analytics is valuable. But it has a characteristic problem: it is downstream of the data. The data exists somewhere. The analytics product reads it, transforms it, and displays it. The intelligence produced is, ultimately, a function of the input data — and the input data is almost always the customer's own.

This creates a ceiling. An analytics product can only tell you things that are knowable from your own data. And most of the most important questions in business cannot be answered from your own data alone.

"Is my gross margin good?" Your analytics product knows your gross margin. It does not know what a comparable business's gross margin looks like. It cannot tell you whether 44% is exceptional or mediocre without something to compare it against.

That something is what Valcr is.

## What infrastructure does

Infrastructure sits beneath other products and enables capabilities that those products could not economically build themselves.

Stripe is infrastructure. Every developer who integrates Stripe could, in principle, build their own payment processing system. Almost none of them do — because the build cost is enormous, the maintenance burden is ongoing, the regulatory complexity is significant, and Stripe's product is already better than anything a single engineering team would produce as a side project to their main product.

The result is that Stripe becomes embedded in thousands of products. The switching cost is real — moving payment infrastructure is a multi-month project. And Stripe's value compounds with scale because the fraud models, the bank relationships, and the reliability that come from processing trillions in volume cannot be replicated by a newer entrant.

Plaid is infrastructure. Plaid normalises bank data from thousands of financial institutions into a single API. Every application that builds on Plaid — budgeting apps, lending products, payroll tools — could theoretically negotiate direct data agreements with each bank. None of them do.

Valcr is in this category. The benchmark dataset that powers the API cannot be assembled by a SaaS accounting platform as a side project. Building a representative benchmark pool requires:

- Recruiting a sufficiently large, demographically representative merchant sample
- Designing a normalisation methodology that produces comparable numbers across merchants using different accounting approaches
- Maintaining the dataset as the sample grows and the merchant universe shifts
- Computing distributions per segment with sufficient sample depth to produce credible percentile data
- Updating it regularly enough to remain accurate

This is not analytics. This is data infrastructure — the kind of foundational capability that enables other products to offer analytics features they could not otherwise provide.

## The correct one-liner

> Valcr is financial benchmarking infrastructure for commerce — operator tools on the surface, proprietary financial dataset underneath.

The "operator tools on the surface" part — the dashboard, the benchmarking UI, the Valcr Score display — are the consumer interface. They are how direct users experience the product. They matter and they will keep improving.

The "proprietary financial dataset underneath" is the infrastructure layer. It is what the API serves. It is what compounds in value as the merchant pool grows. It is what gives Valcr the same characteristic that good infrastructure always has: it becomes more valuable to every user as the total number of users grows.

## Why this distinction matters for buyers

**For SaaS platforms and developers:** You are not buying a dashboard to embed. You are licensing access to a dataset and the normalisation infrastructure that makes it useful. The value proposition is the same as Stripe's or Plaid's — you get a capability that would cost you orders of magnitude more to build yourself, delivered via an API you can integrate in a day.

**For lenders and underwriters:** You are not buying a reporting tool. You are buying the ability to contextualise a merchant's financials against their actual peer group at the moment of underwriting. That context is not available anywhere else in a normalised, API-accessible form. It integrates into your existing pipeline; it does not replace it.

**For commerce operators:** The dashboard and the benchmarks are genuinely useful — but the deeper value is that your VCFS profile, once submitted, produces intelligence that improves as the benchmark pool grows. You contributed data to a system that makes the benchmarks more precise, and you benefit from every other merchant who does the same.

## The compounding dataset

This is the part that is hardest to communicate quickly but most important to understand about Valcr's long-term position.

Every merchant whose VCFS data enters the Valcr pipeline deepens the benchmark distributions — more observations, more precise percentiles, narrower confidence intervals, better sub-segment coverage. The benchmarks that the API serves in 2026 will be materially more credible than the benchmarks it serves today, because the dataset will be larger.

This compounding does not happen in analytics products. Adding a new user to a dashboarding tool makes the vendor's revenue larger. It does not make the product more valuable to existing users.

Adding a new merchant to the Valcr benchmark pool makes the platform more valuable to every lender, every developer, every operator who queries the API. That is the infrastructure model. And it is a fundamentally different business.

---

[Read more about the data model →](/guides/vcfs-schema) · [Start building with the API →](/quickstart)
