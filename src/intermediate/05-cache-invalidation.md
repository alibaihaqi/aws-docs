---
title: Cache invalidation
tier: intermediate
platform: aws
position: 5
---

# Cache invalidation

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Intermediate › Cache invalidation

**Goal**

After this page you will know why CloudFront caches the old page and how to flush it with one CLI command after redeploying `index.html`.

**Prerequisites**

- [Fetch from the page](./04-fetch-from-page.md) — the updated `index.html` is uploaded to S3.

## Why the old page stays

CloudFront is a CDN — it stores a copy of your files at dozens of edge locations around the world so readers get them from the nearest server rather than reaching all the way to S3 in `us-east-1`. That copy is called a **cache entry**.

When you upload a new `index.html` to S3, the edge caches do not know about it. They keep serving the old copy until one of two things happens:

- The **TTL** (time-to-live) on the cached object expires and the edge fetches a fresh copy from S3.
- You send an **invalidation request** that tells CloudFront to discard the cached copy immediately.

The default TTL for an S3-origin distribution can be 24 hours. Waiting that long after every redeploy is impractical. Use an invalidation instead.

## Invalidate the cache

```bash
# EXAMPLE123DIST is a PLACEHOLDER distribution id — use your own.
aws cloudfront create-invalidation \
  --distribution-id EXAMPLE123DIST \
  --paths "/index.html"
```

`EXAMPLE123DIST` is a placeholder. Find your real distribution ID in the CloudFront console (it looks like `E1ABCD2EFGHIJK`) or by running:

```bash
aws cloudfront list-distributions --query 'DistributionList.Items[*].[Id,DomainName]' --output table
```

After the invalidation completes (usually under 60 seconds), all edge locations will fetch the new `index.html` from S3 on the next request.

## Cost

Each invalidation request is free for the first 1,000 paths per month. One path (`/index.html`) counts as one. For the low deployment frequency of a learning project this is always free.

## Verify

Open your CloudFront URL in a browser (or use `curl`). You should see the updated page that calls the API and renders the item list. If you see the old static content, wait 30 seconds and try again — the invalidation may still be propagating.

**Next** → [Safety and placeholders](./06-safety-and-placeholders.md)
