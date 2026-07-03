---
title: Safety and placeholders
tier: intermediate
platform: aws
position: 6
---

# Safety and placeholders

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Intermediate › Safety and placeholders

**Goal**

After this page you will know the placeholder convention used throughout this tier and the rule about what never goes into a public repo or document.

## Placeholder convention

Every AWS identifier in this tier is a stand-in. The table below lists each placeholder and what it represents:

| Placeholder | What it stands for |
|---|---|
| `123456789012` | Your 12-digit AWS account ID |
| `us-east-1` | The AWS region you deploy into |
| `EXAMPLE123DIST` | Your CloudFront distribution ID |
| `example.com` | Your real domain name |
| `arn:aws:lambda:us-east-1:123456789012:function:items-api` | Your Lambda function ARN |
| `abcd1234.execute-api.us-east-1.amazonaws.com` | Your API Gateway invoke hostname |

When you follow the steps in this tier, substitute your real values for these placeholders in your terminal. Never paste the real values into this documentation or any public file.

## The rule

This repo is public. The following must never appear in a commit, a doc page, or a comment:

- Real AWS account IDs (12-digit numbers other than `123456789012`)
- Real ARNs containing your account ID
- AWS access key IDs (`AKIA...`)
- AWS secret access keys
- Real bucket names you own
- Real distribution IDs
- Any credential, token, or password

If you accidentally commit one, rotate the credential immediately (access keys can be deleted in IAM; distributions and bucket names cannot be changed, but you can delete and recreate them). Then use `git filter-repo` or contact GitHub support to scrub the history.

## CORS in production

The Lambda handler in this tier sets:

```
"Access-Control-Allow-Origin": "*"
```

The `*` wildcard allows any website to call your API. That is fine for a learning project, but in production tighten it to your real domain:

```
"Access-Control-Allow-Origin": "https://example.com"
```

Replace `example.com` with your actual domain. This prevents other sites from using your API endpoint.

## Tear-down

If you no longer need the resources from this tier, delete them to avoid unexpected charges:

```bash
# Delete the HTTP API (PLACEHOLDER api-id — use your own).
aws apigatewayv2 delete-api --api-id abcd1234

# Delete the Lambda function.
aws lambda delete-function --function-name items-api

# The S3 bucket and CloudFront distribution carry over from the beginner tier.
# See the beginner tier's last page for tear-down instructions.
```

**You have completed the intermediate tier.** The dynamic page is live, the API is wired up, and you know how to flush the cache on every redeploy.
