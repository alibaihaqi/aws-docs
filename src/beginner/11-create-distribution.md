---
title: Create a CloudFront distribution
tier: beginner
platform: aws
position: 11
---

# Create a CloudFront distribution

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Beginner › Create a CloudFront distribution

**Goal**

After this page you will have a CloudFront distribution in the `InProgress` state, pointing at your S3 bucket, with the distribution's domain name saved as `$DIST`.

**Prerequisites**

- [CloudFront concepts](./10-cloudfront-basics.md)
- [Public S3 bucket](./09-public-bucket.md)

## Use the console

CloudFront's create-distribution CLI form takes 30+ fields. The console fills sensible defaults for most. We'll use the console once, then go back to the CLI to fetch what we need.

1. Console search → **CloudFront** → **Create distribution**.
2. **Origin domain**: click the box and select your bucket. Pick the one with `<bucket>.s3.<region>.amazonaws.com` (the "website endpoint" entry is a different thing — don't pick that).
3. **Origin access**: select **Public**. This tier uses the public S3 endpoint you set up on page 09. (The other option, OAC, is covered in the advanced tier.)
4. **Viewer protocol policy**: pick **Redirect HTTP to HTTPS**.
5. **Allowed HTTP methods**: leave as `GET, HEAD`.
6. **Cache policy**: leave as the default (`CachingOptimized`).
7. **Web Application Firewall**: pick **Do not enable security protections** for this tier. (Free Tier doesn't include WAF.)
8. **Default root object**: type `index.html`. This makes the bare URL (no path) serve `index.html`.
9. **Description**: anything memorable, like `beginner-site`.
10. Click **Create distribution**.

You land on the distribution detail page. The **Status** column reads `InProgress`. The **Distribution domain name** column shows something like `d1abc23def4ghi.cloudfront.net` — that is your future public URL.

## Save the distribution domain

From the terminal, grab the domain so the next page can curl it:

```bash
aws cloudfront list-distributions \
  --query "DistributionList.Items[?Comment=='beginner-site'].DomainName" \
  --output text
```

Output (yours will differ):

```
d1abc23def4ghi.cloudfront.net
```

Export it so the next page picks it up:

```bash
export DIST=d1abc23def4ghi.cloudfront.net
```

The distribution isn't ready yet. The next page waits for it to finish deploying.

**Next** → [Wait for deploy](./12-wait-for-deploy.md)
