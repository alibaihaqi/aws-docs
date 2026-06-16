---
title: S3 in plain language
tier: beginner
platform: aws
position: 5
---

# S3 in plain language

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Beginner › S3 in plain language

**Goal**

After this page you will know what S3 buckets, objects, and regions are, and what makes an S3 bucket name unusual.

**Prerequisites**

- [AWS CLI configured](./04-configure-cli.md)

## What S3 is

S3 (Simple Storage Service) is file storage. You put files in, you get files out, by HTTPS. There are no folders, no file system, no drives — just a flat list of keys mapped to bytes.

Three terms:

- **Bucket** — the top-level container. You create one bucket per logical "site" or "project".
- **Object** — a single file inside a bucket. Has a key (the filename, e.g. `index.html`), bytes, and metadata.
- **Region** — the AWS data center where the bucket physically lives, like `ap-southeast-1`. Objects don't cross regions automatically.

## Bucket names are global

This is the one weird thing about S3: bucket names share a single global namespace across every AWS account on Earth. If someone else has `photos`, you can't have `photos`. Names must be:

- 3 to 63 characters.
- Lowercase letters, digits, and hyphens only.
- Globally unique.

The convention is to prefix with something specific to you, like `mei-beginner-site-2026`. We'll do that on the next page.

## What about folders

You'll see slashes in S3 keys (`photos/2026/06/cat.png`) and the console will render them as folders. They aren't folders. S3 stores the full string `photos/2026/06/cat.png` as one flat key. The folder UI is a console convenience, not a real structure.

For this tier we use exactly one object with the key `index.html` — no fake folders.

## Pricing shape

The Free Tier gives you 5 GB of storage, 20,000 GET requests, and 2,000 PUT requests per month for 12 months. A 1 KB HTML file with a handful of visits stays well inside that.

For everything S3 can do, see the [official S3 user guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html). The pieces we need now are creating a bucket, uploading one object, and reading it back.

**Next** → [Create your first S3 bucket](./06-create-bucket.md)
