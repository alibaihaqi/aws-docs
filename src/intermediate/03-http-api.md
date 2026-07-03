---
title: The HTTP API
tier: intermediate
platform: aws
position: 3
---

# The HTTP API

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Intermediate › The HTTP API

**Goal**

After this page you will have an API Gateway HTTP API wired to your Lambda function and a placeholder invoke URL you can `curl` to verify the connection.

**Prerequisites**

- [The Lambda function](./02-lambda-function.md) — your `items-api` Lambda is deployed.

## What API Gateway is

API Gateway is the AWS service that accepts HTTP requests and routes them to a backend — in this case, your Lambda function. The **HTTP API** type (as opposed to REST API) is the simpler, lower-cost option. It covers most use cases and is what this tier uses.

Every HTTP API gets a unique invoke URL. Requests to that URL trigger your Lambda and return whatever the Lambda returns.

## Create the HTTP API and wire the Lambda

```bash
# All identifiers below are PLACEHOLDERS — replace with your own; never commit real values.
aws apigatewayv2 create-api \
  --name items-api \
  --protocol-type HTTP \
  --target arn:aws:lambda:us-east-1:123456789012:function:items-api

# Grant API Gateway permission to invoke the function.
aws lambda add-permission \
  --function-name items-api \
  --statement-id apigw-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com
```

`--target` is a shortcut that creates a default route (`$default`) and integrates it with the Lambda ARN in one step. The ARN `arn:aws:lambda:us-east-1:123456789012:function:items-api` is a placeholder — use your real region, account ID, and function name.

The `add-permission` call is required: without it, API Gateway will receive a 403 when it tries to invoke the Lambda.

## The invoke URL

After `create-api` succeeds, the response includes an `ApiEndpoint` field. Your invoke URL follows this shape:

```
https://abcd1234.execute-api.us-east-1.amazonaws.com/items
```

- `abcd1234` — a random ID assigned by API Gateway. Yours will be different.
- `us-east-1` — the region you deployed into (placeholder).
- `/items` — the path. Because `--target` creates a `$default` catch-all route, any path works; `/items` is the convention used in this tier.

## Checkpoint

Paste your real invoke URL into a terminal:

```bash
curl https://abcd1234.execute-api.us-east-1.amazonaws.com/items
```

Expected response:

```json
[{"id":1,"name":"Notebook"},{"id":2,"name":"Pen"},{"id":3,"name":"Sticky notes"}]
```

The page ships only the placeholder URL above. Use your own real invoke URL when running this command — do not share it publicly or commit it to the docs repo.

**Next** → [Fetch from the page](./04-fetch-from-page.md)
