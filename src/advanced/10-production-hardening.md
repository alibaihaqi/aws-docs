---
title: Production hardening
tier: advanced
platform: aws
position: 10
---

# Production hardening

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Advanced › Production hardening

**Goal**

After this page you will have added WAF, rate limiting, CORS hardening, a custom domain with HTTPS, and a multi-region disaster recovery plan to your stack.

**Prerequisites**

- [CloudWatch logs and alarms](./09-cloudwatch-logs-alarms.md)
- A deployed CDK stack with API Gateway, Lambda, DynamoDB, and CloudFront.

## WAF on the API Gateway

AWS WAF (Web Application Firewall) blocks common attack patterns before they reach your Lambda:

```bash
# PLACEHOLDER — replace abcd1234 with your API Gateway ID.
WAF_ARN=$(aws wafv2 create-web-acl \
  --name items-api-waf \
  --scope REGIONAL \
  --default-action 'Allow={}' \
  --rules '[
    {
      "Name": "RateLimit",
      "Priority": 1,
      "Statement": {
        "RateBasedStatement": {
          "Limit": 2000,
          "AggregateKeyType": "IP"
        }
      },
      "Action": { "Block": {} },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "RateLimitMetric"
      }
    },
    {
      "Name": "AWS-AWSManagedRulesCommonRuleSet",
      "Priority": 2,
      "Statement": {
        "ManagedRuleGroupStatement": {
          "VendorName": "AWS",
          "Name": "AWSManagedRulesCommonRuleSet"
        }
      },
      "OverrideAction": { "None": {} },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "AWSCommonRulesMetric"
      }
    }
  ]' \
  --region us-east-1 \
  --query Summary.ARN \
  --output text)

aws wafv2 associate-web-acl \
  --web-acl-arn $WAF_ARN \
  --resource-arn arn:aws:apigateway:us-east-1::/apis/abcd1234
```

The rules above:
- **Rate limit** — 2,000 requests per 5-minute window per IP.
- **AWS managed common rule set** — SQL injection, XSS, known exploit patterns.

## WAF on CloudFront

CloudFront distributions use `CLOUDFRONT` scope WAF ACLs instead of `REGIONAL`:

```bash
# PLACEHOLDER — replace EXAMPLE123DIST with your distribution ID.
CF_WAF_ARN=$(aws wafv2 create-web-acl \
  --name cloudfront-waf \
  --scope CLOUDFRONT \
  --default-action 'Allow={}' \
  --rules '[
    {
      "Name": "RateLimit",
      "Priority": 1,
      "Statement": {
        "RateBasedStatement": {
          "Limit": 5000,
          "AggregateKeyType": "IP"
        }
      },
      "Action": { "Block": {} },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "CFRateLimit"
      }
    },
    {
      "Name": "AWSManagedRulesCommonRuleSet",
      "Priority": 2,
      "Statement": {
        "ManagedRuleGroupStatement": {
          "VendorName": "AWS",
          "Name": "AWSManagedRulesCommonRuleSet"
        }
      },
      "OverrideAction": { "None": {} },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "CFAWSCommon"
      }
    }
  ]' \
  --query Summary.ARN \
  --output text)

aws cloudfront update-distribution \
  --id EXAMPLE123DIST \
  --web-acl-id $CF_WAF_ARN
```

## CORS hardening

Tighten the Lambda CORS header from `*` to your actual domain:

```javascript
const ALLOWED_ORIGIN = "https://example.com"; // PLACEHOLDER — your real domain

export const handler = async (event) => {
  const origin = event.headers?.origin || "";
  const allowedOrigin = origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : "null";

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
    body: JSON.stringify(items),
  };
};
```

API Gateway also needs an `OPTIONS` route for preflight requests. Add it in CDK:

```typescript
api.addRoutes({
  path: "/items",
  methods: [HttpMethod.OPTIONS],
  integration: new HttpLambdaIntegration("OptionsIntegration", new Function(this, "OptionsHandler", {
    runtime: Runtime.NODEJS_20_X,
    handler: "index.optionsHandler",
    code: Code.fromAsset("./lambda"),
  })),
});
```

## Custom domain with ACM

A custom domain (e.g. `api.example.com`) requires an ACM certificate in `us-east-1` and a Route 53 A record:

```bash
# PLACEHOLDER — replace with your domain.
CERT_ARN=$(aws acm request-certificate \
  --domain-name api.example.com \
  --validation-method DNS \
  --region us-east-1 \
  --query CertificateArn \
  --output text)

# Add the CNAME to Route 53 for domain validation (output from describe-certificate).
aws acm describe-certificate --certificate-arn $CERT_ARN --region us-east-1
```

After validation, create the API Gateway custom domain:

```bash
# PLACEHOLDER — replace with your certificate ARN and domain.
aws apigatewayv2 create-domain-name \
  --domain-name api.example.com \
  --domain-name-configurations CertificateArn=$CERT_ARN \
  --region us-east-1

aws apigatewayv2 create-api-mapping \
  --api-id abcd1234 \
  --domain-name api.example.com \
  --stage '$default'
```

## Multi-region disaster recovery

A simple DR plan: replicate DynamoDB to a second region with global tables, and deploy the CDK stack there with a CloudFront origin group as fallback.

Enable DynamoDB global tables:

```bash
# PLACEHOLDER — run after creating the table in the second region.
aws dynamodb create-global-table \
  --global-table-name items \
  --replication-group RegionName=us-east-1 RegionName=us-west-2
```

CDK stack in the second region:

```bash
# PLACEHOLDER — use your own account and region.
npx aws-cdk deploy --region us-west-2
```

CloudFront origin group with failover (via the console or CloudFront API):

```
Origin 1: us-east-1 API Gateway (primary)
Origin 2: us-west-2 API Gateway (failover)
Failover criteria: 5xx, 4xx
```

## Checkpoint

Verify WAF is active:

```bash
aws wafv2 get-web-acl \
  --name items-api-waf \
  --scope REGIONAL \
  --id $(aws wafv2 list-web-acls --scope REGIONAL --query "WebACLs[?Name=='items-api-waf'].Id" --output text) \
  --region us-east-1
```

Then verify the API still responds:

```bash
curl -H "Authorization: Bearer eyJ..." https://abcd1234.execute-api.us-east-1.amazonaws.com/items
```

The WAF is transparent to legitimate traffic but drops malformed requests before they reach your Lambda.

## What you built

Over 10 pages in this advanced tier you have:

1. Replaced hardcoded Lambda data with a **DynamoDB** table.
2. Added **Cognito** authentication and a **Lambda authorizer**.
3. Codified all infrastructure with **CDK**.
4. Enabled **local testing** with SAM.
5. Learned **cross-stack references**.
6. Set up **CI/CD** with CodePipeline.
7. Added **observability** with CloudWatch logs, metrics, and alarms.
8. **Hardened** production with WAF, rate limits, CORS, custom domain, and DR.

You have completed the advanced tier.
