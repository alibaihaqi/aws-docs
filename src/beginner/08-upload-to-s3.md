---
title: Upload index.html to S3
tier: beginner
platform: aws
position: 8
---

# Upload index.html to S3

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Beginner › Upload index.html to S3

**Goal**

After this page your `index.html` will exist as an object in your bucket and `aws s3 ls s3://$BUCKET` will list it.

**Prerequisites**

- [index.html on disk](./07-write-html.md)
- [Bucket created and `$BUCKET` exported](./06-create-bucket.md)

## Upload

From the directory holding `index.html`:

```bash
aws s3 cp index.html s3://$BUCKET/index.html \
  --content-type text/html
```

The `--content-type text/html` flag tells S3 to label the object as HTML. Without it, browsers may download the file instead of rendering it.

Expected output:

```
upload: ./index.html to s3://aarav-beginner-site-2026/index.html
```

## Verify the object exists

```bash
aws s3 ls s3://$BUCKET/
```

Output:

```
2026-06-15 14:45:02        220 index.html
```

The columns are date, time, byte size, and key. A non-zero size means S3 received the bytes.

## Why we can't browse it yet

At this point the file is uploaded but not readable by anyone except you. S3 buckets are private by default — every object inherits "block all public access". If you try the S3 object URL right now, you'll get an `AccessDenied` XML response.

The next page flips the bucket's settings so anonymous GETs work.

**Next** → [Make the bucket publicly readable](./09-public-bucket.md)
