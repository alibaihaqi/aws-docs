---
title: The Lambda function
tier: intermediate
platform: aws
position: 2
---

# The Lambda function

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Intermediate › The Lambda function

**Goal**

After this page you will have a Lambda handler that returns a JSON list of items, and you will have smoke-tested it locally before touching AWS.

**Prerequisites**

- [Why go dynamic](./01-why-dynamic.md)
- Node.js 20 installed locally.

## What Lambda is

AWS Lambda runs a function in response to an event. You upload code; AWS manages the server, scaling, and availability. For this tier the event is an HTTP request routed through API Gateway.

Lambda functions are billed per invocation and per millisecond of execution. For low-traffic APIs the free tier (1 million invocations / month) is more than enough.

## The handler

Create a file called `index.mjs` anywhere on your machine (this file is for the Lambda deployment package — it does not live in the VitePress repo):

```javascript
// index.mjs — AWS Lambda (Node.js 20), HTTP API payload v2.0
export const handler = async () => {
  const items = [
    { id: 1, name: "Notebook" },
    { id: 2, name: "Pen" },
    { id: 3, name: "Sticky notes" },
  ];
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // tighten to your domain in production
    },
    body: JSON.stringify(items),
  };
};
```

### Key points

- **`.mjs` extension** — Lambda Node.js 20 supports ES modules. The `.mjs` extension tells Node to treat the file as an ES module without a `package.json` `"type"` field.
- **`statusCode`, `headers`, `body`** — this is the HTTP API payload format v2.0 response shape. API Gateway reads these fields and constructs the HTTP response.
- **`Access-Control-Allow-Origin: "*"`** — allows any origin to call the API. Tighten this to `https://example.com` (your real domain) before going to production. The placeholder domain used throughout this tier is `example.com`.

## Local smoke test

You can verify the handler works before creating anything in AWS:

```bash
node -e "import('./index.mjs').then(m => m.handler().then(r => console.log(r.statusCode, r.body)))"
```

Expected output:

```
200 [{"id":1,"name":"Notebook"},{"id":2,"name":"Pen"},{"id":3,"name":"Sticky notes"}]
```

If you see `200` and the JSON array, the handler is syntactically valid and its return shape is correct. Fix any errors here before deploying — a broken handler in Lambda still costs an invocation.

## Deploy the function

Once the local test passes, zip the file and create the Lambda function:

```bash
# PLACEHOLDERS — replace with your own values; never commit real ARNs or account IDs.
zip function.zip index.mjs

aws lambda create-function \
  --function-name items-api \
  --runtime nodejs20.x \
  --zip-file fileb://function.zip \
  --handler index.handler \
  --role arn:aws:iam::123456789012:role/lambda-basic-execution
```

`arn:aws:iam::123456789012:role/lambda-basic-execution` is a placeholder. You need an IAM execution role that grants Lambda permission to write logs to CloudWatch. Create one in the IAM console (or CLI) and paste your real role ARN in its place.

**Next** → [The HTTP API](./03-http-api.md)
