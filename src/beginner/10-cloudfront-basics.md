---
title: CloudFront in plain language
tier: beginner
platform: aws
position: 10
---

# CloudFront in plain language

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Beginner › CloudFront in plain language

**Goal**

After this page you will know what a CloudFront distribution is, why it sits in front of S3, and what an origin is.

**Prerequisites**

- [S3 object reachable over HTTP](./09-public-bucket.md)

## What CloudFront is

CloudFront is AWS's CDN (content delivery network — a fleet of edge servers worldwide that cache responses near your users). Instead of every browser fetching `index.html` from a single S3 bucket in Singapore, CloudFront caches the file at the edge server closest to each visitor.

For a one-file site, the speed difference barely matters. What matters for this tier is the other half of what CloudFront does:

- It gives you HTTPS, on a hostname AWS provides (`d1abc23def4ghi.cloudfront.net`), for free.
- It hides the long ugly S3 URL behind a shorter one.

## Origin, distribution, behavior

Three terms you'll see on the next page:

- **Origin** — where CloudFront fetches from when the cache misses. For us, the S3 bucket.
- **Distribution** — the CloudFront resource itself. One distribution = one public URL.
- **Behavior** — a rule that says "for requests matching this path pattern, hit this origin with these settings". A distribution has at least one default behavior.

We will create one distribution, with one origin (your S3 bucket), and the default behavior. No custom domain, no custom certificate.

## How requests flow

```
browser
  → https://d1abc23def4ghi.cloudfront.net/
    → CloudFront edge (cache HIT? serve from cache)
      → on MISS, fetch from S3 bucket
        → cache the response, serve to browser
```

The first request after deploy goes all the way to S3. Subsequent requests within the cache TTL (time-to-live — how long the edge keeps a cached copy) are served from the edge.

## How long deploy takes

When you create or change a distribution, CloudFront pushes the config to every edge location worldwide. This takes 5–15 minutes. The distribution status moves from `InProgress` to `Deployed`. You can't test the URL until it's `Deployed`.

For everything CloudFront can do, see the [official CloudFront developer guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html). The pieces we need are: one distribution, S3 origin, default root object set to `index.html`.

**Next** → [Create a CloudFront distribution](./11-create-distribution.md)
