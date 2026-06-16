---
title: Verify the public URL
tier: beginner
platform: aws
position: 13
---

# Verify the public URL

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Beginner › Verify the public URL

**Goal**

After this page you will have proven your static site is reachable over HTTPS at the CloudFront URL and you'll know how to tear it down. This is the tier exit artifact.

**Prerequisites**

- [Distribution Deployed](./12-wait-for-deploy.md) with `$DIST` exported.

## Curl it

The first test is a plain HTTP GET:

```bash
curl -i "https://$DIST/"
```

Expected:

```
HTTP/2 200
content-type: text/html
…
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Hello from S3 + CloudFront</title>
  </head>
  <body>
    <h1>Hello from S3 + CloudFront</h1>
    <p>Deployed on 2026-06-15.</p>
  </body>
</html>
```

The `content-type: text/html` header confirms the `--content-type` flag from page 08 made it through. The `200` status confirms CloudFront fetched the object from S3 and is serving it.

## Open it in a browser

Print the URL and open it:

```bash
echo "https://$DIST/"
```

Paste into any browser. You should see the heading "Hello from S3 + CloudFront" and the deploy-date line.

That URL is now public. Anyone with it can load your page. This is the tier exit artifact.

## Tear it down (optional but recommended)

Both S3 and CloudFront have Free Tier, but the distribution stays billable beyond Free Tier limits. If you don't need the site live, tear it down in this order:

1. **Disable the distribution.** Console → CloudFront → your distribution → **Disable**. Wait until status is `Deployed` again (another 5–15 minutes).
2. **Delete the distribution.** Once disabled, the **Delete** button is no longer greyed out.
3. **Empty and delete the bucket.**

```bash
aws s3 rm s3://$BUCKET --recursive
aws s3 rb s3://$BUCKET
```

`rm --recursive` deletes every object; `rb` (remove bucket) deletes the empty bucket itself.

You're done with the beginner tier.

---

## You finished a beginner tier. What's next?

Two paths from here.

1. **Go deeper on the same platform.** The intermediate tier on this same site teaches you to ship a thing that persists, tests itself, and talks to the world. If you liked beginner, that's the natural next step.
2. **Pick up an adjacent platform.** The table below routes you across platforms based on what you actually want to build.

| You just finished | Natural next platform | Why |
|---|---|---|
| iOS beginner | iOS intermediate, then Android beginner | Stay native, then learn the other mobile platform with a head start on the Compose/SwiftUI mental model. |
| Android beginner | Android intermediate, then Golang beginner | Backend-for-frontend pairs naturally with a mobile client. |
| Golang beginner | AWS beginner, then Golang intermediate | Deploy your endpoint before adding persistence/tests. |
| Java beginner | Java intermediate, then AWS beginner | JVM persistence + validation first, then deploy. |
| AWS beginner | Golang beginner | Have a backend to deploy. AWS without a service to host is reference, not curriculum. |

Or jump back to the [Hub](https://alibaihaqi.github.io/learning-docs/) and pick a different goal.
