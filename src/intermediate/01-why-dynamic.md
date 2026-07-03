---
title: Why go dynamic
tier: intermediate
platform: aws
position: 1
---

# Why go dynamic

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Intermediate › Why go dynamic

**Goal**

After this page you will understand why a static page cannot change its content without a full redeployment, and why an API changes that equation.

**Prerequisites**

- [AWS Beginner tier](../beginner/index.md) — you have a static `index.html` served by S3 + CloudFront.

## The problem with static

The beginner tier produced a public URL that serves one file: `index.html`. Every byte on that page is baked in at upload time. To change any text you must:

1. Edit `index.html` locally.
2. Upload the new file to S3.
3. Invalidate the CloudFront cache.
4. Wait for the new version to propagate.

That four-step cycle is fine for content that rarely changes. But what if you want to show a list of items that updates frequently — a feed, a leaderboard, a product catalogue? Repeating those steps for every update is not sustainable.

## What an API buys you

An API is an endpoint your page can call at runtime — in the reader's browser, after the page has already loaded. The flow changes to:

1. Browser loads `index.html` from CloudFront (cached; fast).
2. JavaScript inside `index.html` calls the API.
3. The API returns the latest data as JSON.
4. JavaScript renders the data into the DOM.

Now updating the list means updating the API response — the HTML file itself stays the same.

## What this tier adds

Three new pieces sit behind CloudFront:

- **Lambda function** — a small Node.js function that returns JSON.
- **API Gateway HTTP API** — an HTTPS endpoint that triggers the Lambda on every GET request.
- **Cache invalidation** — a one-command step to flush the old `index.html` from CloudFront after you update it to call the API.

You build each piece in order across the next five pages.

## What you will not do

- Custom domain, Route 53, or ACM certificates — advanced tier.
- Authentication on the API — advanced tier.
- Infrastructure as code (Terraform/CDK) — advanced tier.

**Next** → [The Lambda function](./02-lambda-function.md)
