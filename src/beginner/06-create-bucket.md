---
title: Create your first S3 bucket
tier: beginner
platform: aws
position: 6
---

# Create your first S3 bucket

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Beginner › Create your first S3 bucket

**Goal**

After this page you will have an empty S3 bucket in your chosen region, listed by `aws s3 ls`.

**Prerequisites**

- [AWS CLI configured](./04-configure-cli.md)
- [S3 in plain language](./05-s3-basics.md)

## Pick a bucket name

Bucket names are globally unique. A safe pattern is `<your-name>-<purpose>-<year>`. Pick something with no chance of collision.

Throughout the rest of this tier we'll write `BUCKET=aarav-beginner-site-2026` — substitute your own name in.

Save it as a shell variable so the rest of the tier copy-pastes cleanly:

```bash
export BUCKET=aarav-beginner-site-2026
```

(Use your name, not Aarav's.)

## Create the bucket

For most regions, one command:

```bash
aws s3api create-bucket \
  --bucket "$BUCKET" \
  --region ap-southeast-1 \
  --create-bucket-configuration LocationConstraint=ap-southeast-1
```

If you picked `us-east-1` as your region, `us-east-1` is the only region that does NOT take `LocationConstraint`. Use this shorter form instead:

```bash
aws s3api create-bucket \
  --bucket "$BUCKET" \
  --region us-east-1
```

Expected output:

```json
{
    "Location": "/aarav-beginner-site-2026"
}
```

If you get `BucketAlreadyExists`, someone else owns that name globally. Pick a different one and re-export `BUCKET`.

## Verify

```
aws s3 ls
```

Output (lists every bucket in your account, oldest first):

```
2026-06-15 14:32:11 aarav-beginner-site-2026
```

The bucket is empty. The next page writes the file you'll put inside it.

**Next** → [Write index.html locally](./07-write-html.md)
