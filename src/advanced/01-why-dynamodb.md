---
title: Why DynamoDB
tier: advanced
platform: aws
position: 1
---

# Why DynamoDB

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Advanced › Why DynamoDB

**Goal**

After this page you will understand why a Lambda function returning hardcoded JSON is not enough for a real application, and why DynamoDB is a natural next step.

**Prerequisites**

- [AWS Intermediate tier](../intermediate/index.md) — you have a Lambda function behind API Gateway serving JSON from memory.

## The problem with in-memory data

The intermediate tier Lambda returns a hardcoded array:

```javascript
const items = [
  { id: 1, name: "Notebook" },
  { id: 2, name: "Pen" },
  { id: 3, name: "Sticky notes" },
];
```

Every invocation returns the same data. Nothing persists between calls, and no other client or Lambda can write to it. This is fine for a demo, but any real application needs:

- **Durability** — data survives Lambda cold starts and redeploys.
- **Shared state** — multiple Lambda invocations read and write the same data.
- **Queryability** — filter, sort, and paginate through records.

## The three database options on AWS

| Service | Best for | Managed? |
|---|---|---|
| DynamoDB | Key-value + document, single-digit-millisecond, serverless | Yes |
| RDS (Aurora) | Relational, joins, complex queries | Yes (provisioned or serverless) |
| MemoryDB / ElastiCache | Sub-millisecond cache, session store | Yes |

DynamoDB wins for this stack because:

- **Fully serverless** — no servers to provision, scales to zero.
- **Pay-per-request** — no charge when idle.
- **Single-digit-millisecond** latency at any scale.
- **Tight AWS integration** — the AWS SDK DynamoDB client is available in every Lambda runtime.

## What this tier adds

Seven new pieces compared to the intermediate tier:

- **DynamoDB table** — persistent item storage.
- **Cognito User Pool** — user sign-up, sign-in, JWT tokens.
- **Lambda authorizer** — protects the API with Cognito JWTs.
- **CDK** — Infrastructure as Code (TypeScript) for repeatable deployments.
- **SAM** — local Lambda development and testing.
- **CodePipeline** — CI/CD from GitHub to deploy.
- **CloudWatch alarms** — monitor errors and latency.
- **Production hardening** — WAF, rate limiting, multi-region.

You build each piece in order across the next nine pages.

**Next** → [Create a DynamoDB table](./02-dynamodb-table.md)
