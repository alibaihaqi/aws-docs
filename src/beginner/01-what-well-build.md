---
title: What we'll build
tier: beginner
platform: aws
position: 1
---

# What we'll build

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Beginner › What we'll build

**Goal**

After this page you will know the exact shape of the artifact this tier builds and the order of the rungs that get you there.

**Prerequisites**

- [AWS account + CLI installed](../introduction/getting-started.md)

## The artifact, concretely

One file (`index.html`, around 5 lines) lives in an S3 bucket. A CloudFront distribution serves that file at a public HTTPS URL. You will end with a URL like:

```
https://d1abc23def4ghi.cloudfront.net
```

Paste it into any browser and your page loads.

## Two AWS services, one path

This tier touches exactly two billable services:

- **S3** (Simple Storage Service) — file storage. Your `index.html` lives here.
- **CloudFront** — a CDN (content delivery network — a network of edge servers that cache your content close to your users). It sits in front of S3 and serves your file over HTTPS.

S3 alone can serve files over HTTP, but not HTTPS on a custom domain. CloudFront adds the HTTPS layer and caches the file globally.

## Cost shape

Both services have a Free Tier. For a single tiny HTML file with very low traffic, this tier should run at $0 for the first 12 months. The last page covers tear-down so you don't leave anything billable behind.

## What you won't do in this tier

- Custom domain (`yoursite.com`). Reserved for the advanced tier alongside Route 53.
- Multiple files, CSS, JS bundles. One file is enough to prove the pipeline.
- Automation. We click through the console where the console is faster, and use the CLI where it's faster. Terraform is the advanced tier.

**Next** → [IAM in plain language](./02-iam-basics.md)
