---
title: Wait for deploy
tier: beginner
platform: aws
position: 12
---

# Wait for deploy

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Beginner › Wait for deploy

**Goal**

After this page your CloudFront distribution will report status `Deployed` and be ready for traffic.

**Prerequisites**

- [Distribution created](./11-create-distribution.md) with `$DIST` exported.

## What "Deployed" means

CloudFront pushes config to every edge location on the planet. Until that finishes, some edges serve the new config and some don't. The status changes from `InProgress` to `Deployed` only when every edge has the new config.

Typical time: 5–15 minutes. First-ever distributions sometimes take longer.

## Poll from the CLI

The fastest way to watch this is one CLI call in a loop:

```bash
aws cloudfront list-distributions \
  --query "DistributionList.Items[?DomainName=='$DIST'].Status" \
  --output text
```

Run it every minute or two. You'll see:

```
InProgress
```

…then eventually:

```
Deployed
```

If you want the shell to wait for you, a one-liner that polls every 30 seconds:

```bash
until [ "$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?DomainName=='$DIST'].Status" \
  --output text)" = "Deployed" ]; do
  echo "still InProgress, sleeping 30s"
  sleep 30
done
echo "Deployed"
```

When this exits with `Deployed`, move to the next page.

## What if it's stuck

If 30 minutes passes and the status is still `InProgress`, the most common cause is the AWS service status page reporting a CloudFront incident. Check [status.aws.amazon.com](https://status.aws.amazon.com/) and wait it out. The distribution will finish on its own — there's nothing to retry.

**Next** → [Verify the public URL](./13-verify-and-finish.md)
