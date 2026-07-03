---
title: AWS Intermediate — a dynamic page backed by Lambda
tier: intermediate
platform: aws
---

# AWS Intermediate

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Intermediate

## What you'll build

You extend the beginner static S3 + CloudFront site into a dynamic one. You add a
Lambda function that returns JSON, expose it through an API Gateway HTTP API, and
change `index.html` to `fetch` the API and render the list in the browser. You
also learn to invalidate the CloudFront cache after redeploying. All identifiers
in this tier are placeholders — never paste a real account ID or ARN.

## The ladder

1. [01 Why go dynamic](./01-why-dynamic.md)
2. [02 The Lambda function](./02-lambda-function.md)
3. [03 The HTTP API](./03-http-api.md)
4. [04 Fetch from the page](./04-fetch-from-page.md)
5. [05 Cache invalidation](./05-cache-invalidation.md)
6. [06 Safety and placeholders](./06-safety-and-placeholders.md)
