---
title: AWS Beginner — Static site on S3 + CloudFront
tier: beginner
platform: aws
---

# AWS Beginner

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Beginner

## What you'll build

A one-page static site (`index.html`) hosted in an S3 bucket and served over HTTPS by a CloudFront distribution. By the end you will paste a CloudFront URL like `https://d1abc23def4ghi.cloudfront.net` into any browser and see your page. The exit artifact is a public URL you can share. Building this is the point of every page in this tier.

## The ladder

1. [01 What we'll build](./01-what-well-build.md) — concrete picture of the exit artifact and the route to it.
2. [02 IAM in plain language](./02-iam-basics.md) — why the root account isn't for daily work.
3. [03 Create an admin IAM user](./03-create-iam-user.md) — a non-root identity for everything that follows.
4. [04 Configure the AWS CLI](./04-configure-cli.md) — wire the new user's keys into your terminal.
5. [05 S3 in plain language](./05-s3-basics.md) — the vocabulary for buckets, objects, and regions.
6. [06 Create your first S3 bucket](./06-create-bucket.md) — the place your file will live.
7. [07 Write index.html locally](./07-write-html.md) — the artifact you'll upload.
8. [08 Upload index.html to S3](./08-upload-to-s3.md) — get the file into the bucket via CLI.
9. [09 Make the bucket publicly readable](./09-public-bucket.md) — allow anonymous GETs on the object.
10. [10 CloudFront in plain language](./10-cloudfront-basics.md) — why HTTPS + edge cache matter.
11. [11 Create a CloudFront distribution](./11-create-distribution.md) — point the CDN at your bucket.
12. [12 Wait for deploy](./12-wait-for-deploy.md) — what "Deployed" means and how to watch for it.
13. [13 Verify the public URL](./13-verify-and-finish.md) — the tier exit artifact.

**Start** → [01 What we'll build](./01-what-well-build.md)
