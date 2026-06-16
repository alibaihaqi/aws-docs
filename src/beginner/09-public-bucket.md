---
title: Make the bucket publicly readable
tier: beginner
platform: aws
position: 9
---

# Make the bucket publicly readable

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Beginner › Make the bucket publicly readable

**Goal**

After this page anyone on the internet can `GET` your `index.html` directly from S3, and `curl` will return the HTML body instead of an `AccessDenied` error.

**Prerequisites**

- [index.html uploaded](./08-upload-to-s3.md)

## Two things AWS makes you do

S3 has two independent locks on public access. You need to unlock both:

1. **Block Public Access** (account-and-bucket-level switch) — must be turned off.
2. **Bucket policy** (JSON document on the bucket) — must explicitly allow anonymous `s3:GetObject`.

If either one is missing, the object stays private.

## Unblock public access

```bash
aws s3api put-public-access-block \
  --bucket "$BUCKET" \
  --public-access-block-configuration \
    BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false
```

No output on success. This switch is what protects you from accidentally exposing a bucket — for production data you keep it on. For a static site that is meant to be public, you turn it off explicitly.

## Add the bucket policy

Create `policy.json` in your `~/aws-beginner-site` directory:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::REPLACE_BUCKET/*"
    }
  ]
}
```

Replace `REPLACE_BUCKET` with your bucket name. Then attach the policy:

```bash
sed "s/REPLACE_BUCKET/$BUCKET/" policy.json > policy.expanded.json
aws s3api put-bucket-policy \
  --bucket "$BUCKET" \
  --policy file://policy.expanded.json
```

`Principal: "*"` means anyone, including unauthenticated requests. `Action: s3:GetObject` is read-only — nobody can upload, delete, or list.

## Verify with curl

S3 exposes every object at a URL of the form `https://<bucket>.s3.<region>.amazonaws.com/<key>`:

```bash
curl -i "https://$BUCKET.s3.ap-southeast-1.amazonaws.com/index.html"
```

(Substitute your region.) You should see `HTTP/1.1 200 OK` and the HTML body. If you get `403 Forbidden`, recheck both steps above.

This URL works, but it's HTTP over a long ugly hostname and S3 doesn't give you HTTPS on a custom domain. The next page introduces CloudFront, which fixes both.

**Next** → [CloudFront in plain language](./10-cloudfront-basics.md)
