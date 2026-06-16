---
title: Write index.html locally
tier: beginner
platform: aws
position: 7
---

# Write index.html locally

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Beginner › Write index.html locally

**Goal**

After this page you will have an `index.html` file on disk that renders correctly when opened in a browser locally.

**Prerequisites**

- [S3 bucket created](./06-create-bucket.md)

## What the page needs to be

The minimum: a valid HTML document with a title and a heading. Nothing else. The point of this tier is the deploy pipeline, not the page.

## Create the file

Make a working directory and put the file in it:

```bash
mkdir -p ~/aws-beginner-site
cd ~/aws-beginner-site
```

Create `index.html` with this exact content:

```html
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

## Verify locally first

Open the file directly in your browser:

```bash
open index.html        # macOS
xdg-open index.html    # Linux
```

You should see the heading "Hello from S3 + CloudFront" and the deploy-date line. If the browser shows raw HTML or an error, fix that before uploading — the upload step doesn't transform the file.

The next page uploads this exact file to your bucket.

**Next** → [Upload index.html to S3](./08-upload-to-s3.md)
