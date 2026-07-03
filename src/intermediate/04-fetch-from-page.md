---
title: Fetch from the page
tier: intermediate
platform: aws
position: 4
---

# Fetch from the page

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Intermediate › Fetch from the page

**Goal**

After this page you will have an updated `index.html` that calls the API at runtime and renders the item list in the browser.

**Prerequisites**

- [The HTTP API](./03-http-api.md) — your invoke URL returns JSON.

## Updating index.html

Replace the static content in the `index.html` from the beginner tier with this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Items</title>
  </head>
  <body>
    <h1>Items</h1>
    <ul id="items"></ul>
    <script>
      // Replace with your own API Gateway invoke URL.
      const API_URL = "https://abcd1234.execute-api.us-east-1.amazonaws.com/items";
      fetch(API_URL)
        .then((r) => r.json())
        .then((items) => {
          const ul = document.getElementById("items");
          for (const it of items) {
            const li = document.createElement("li");
            li.textContent = it.name;
            ul.appendChild(li);
          }
        })
        .catch((e) => {
          document.getElementById("items").textContent = "Failed to load: " + e.message;
        });
    </script>
  </body>
</html>
```

`API_URL` is a placeholder. Paste your real invoke URL from the previous page before uploading.

## How it works

1. The browser loads `index.html` from CloudFront (cached static file — fast).
2. The `<script>` runs: `fetch(API_URL)` sends a GET request to API Gateway.
3. API Gateway invokes the Lambda; the Lambda returns the JSON array.
4. `.then((items) => { ... })` iterates over the array and appends a `<li>` for each item.
5. If the fetch fails, the `.catch` handler shows the error in place of the list.

## Local checkpoint

To verify the JavaScript before uploading:

1. Save the file above as `index.html` with `API_URL` set to your real invoke URL.
2. Serve it locally:

```bash
python3 -m http.server 8080
```

3. Open `http://localhost:8080` in a browser. The list should render.

The `fetch` call goes out to your real API Gateway URL, so this test requires a live Lambda. If you prefer a fully offline test, point `API_URL` at a local stub:

```bash
# In a separate terminal: serve a static items.json
echo '[{"id":1,"name":"Notebook"},{"id":2,"name":"Pen"},{"id":3,"name":"Sticky notes"}]' > items
python3 -m http.server 9090
```

Then set `API_URL = "http://localhost:9090/items"` temporarily, reload, and verify the list. Reset `API_URL` to your real invoke URL before uploading.

## Upload to S3

```bash
# PLACEHOLDER bucket name — use your own from the beginner tier.
aws s3 cp index.html s3://your-bucket-name/index.html
```

After uploading, the old `index.html` may still be cached at the CloudFront edge. The next page covers how to flush it.

**Next** → [Cache invalidation](./05-cache-invalidation.md)
