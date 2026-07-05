---
title: CloudWatch logs and alarms
tier: advanced
platform: aws
position: 9
---

# CloudWatch logs and alarms

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Advanced › CloudWatch logs and alarms

**Goal**

After this page you will have structured logging in your Lambda, a CloudWatch dashboard showing key metrics, and an SNS alarm that notifies you when errors exceed a threshold.

**Prerequisites**

- [CI/CD with CodePipeline](./08-ci-cd-codepipeline.md)
- A deployed Lambda function (`items-api`).

## Structured logging

Replace `console.log` with structured JSON logs. CloudWatch Logs parses JSON fields automatically, making them searchable and filterable:

```javascript
// Log as JSON so CloudWatch Logs Insights can query fields.
const logger = {
  info: (message, data = {}) => console.log(JSON.stringify({ level: "INFO", message, ...data, timestamp: new Date().toISOString() })),
  error: (message, error, data = {}) => console.error(JSON.stringify({ level: "ERROR", message, error: error.message, stack: error.stack, ...data, timestamp: new Date().toISOString() })),
};

export const handler = async (event) => {
  logger.info("Handler invoked", { method: event.requestContext?.http?.method, path: event.requestContext?.http?.path });

  try {
    if (event.requestContext?.http?.method === "POST") {
      const body = JSON.parse(event.body);
      const item = {
        pk: body.id?.toString() || crypto.randomUUID(),
        name: body.name || "untitled",
        createdAt: new Date().toISOString(),
      };
      // ... PutCommand ...
      logger.info("Item created", { pk: item.pk, name: item.name });
      return { statusCode: 201, headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) };
    }
    // ... ScanCommand ...
    logger.info("Items scanned");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(items),
    };
  } catch (err) {
    logger.error("Handler failed", err);
    return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: err.message }) };
  }
};
```

## Query logs with CloudWatch Logs Insights

```bash
# PLACEHOLDER — replace with your log group name (default: /aws/lambda/items-api).
aws logs start-query \
  --log-group-name /aws/lambda/items-api \
  --start-time $(date -d "-1 hour" +%s) \
  --end-time $(date +%s) \
  --query-string 'fields @timestamp, level, message | filter level = "ERROR" | sort @timestamp desc | limit 20'
```

Use the query ID from the response to poll for results:

```bash
aws logs get-query-results --query-id <query-id>
```

## Create a metric filter

A metric filter turns log lines into CloudWatch metrics:

```bash
# PLACEHOLDER — run this in your terminal.
aws logs put-metric-filter \
  --log-group-name /aws/lambda/items-api \
  --filter-name errors \
  --filter-pattern '{ $.level = "ERROR" }' \
  --metric-transformations metricName=LambdaErrors,metricNamespace=ItemsApi,metricValue=1
```

Now every `"level": "ERROR"` log line increments the `ItemsApi/LambdaErrors` metric.

## Create an SNS topic and alarm

```bash
# PLACEHOLDER — replace email; commands need real values.
TOPIC_ARN=$(aws sns create-topic --name items-api-alerts --query TopicArn --output text)

aws sns subscribe \
  --topic-arn $TOPIC_ARN \
  --protocol email \
  --notification-endpoint alerts@example.com

aws cloudwatch put-metric-alarm \
  --alarm-name items-api-error-alarm \
  --alarm-description "Alert when Lambda errors exceed 5 in 5 minutes" \
  --metric-name LambdaErrors \
  --namespace ItemsApi \
  --statistic Sum \
  --period 300 \
  --evaluation-periods 1 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions $TOPIC_ARN
```

## CloudWatch dashboard

Create a one-page dashboard showing key metrics:

```bash
# PLACEHOLDER — replace with your API ID and Lambda name.
aws cloudwatch put-dashboard \
  --dashboard-name ItemsApi \
  --dashboard-body '{
    "widgets": [
      {
        "type": "metric",
        "properties": {
          "metrics": [
            ["AWS/Lambda", "Invocations", "FunctionName", "items-api"],
            ["AWS/Lambda", "Errors", "FunctionName", "items-api"],
            ["AWS/Lambda", "Duration", "FunctionName", "items-api", { "stat": "Average" }]
          ],
          "period": 300,
          "stat": "Sum",
          "region": "us-east-1",
          "title": "Lambda Metrics"
        }
      },
      {
        "type": "metric",
        "properties": {
          "metrics": [
            ["AWS/ApiGateway", "Count", "ApiId", "abcd1234"],
            ["AWS/ApiGateway", "4XXError", "ApiId", "abcd1234"],
            ["AWS/ApiGateway", "5XXError", "ApiId", "abcd1234"],
            ["AWS/ApiGateway", "Latency", "ApiId", "abcd1234", { "stat": "Average" }]
          ],
          "period": 300,
          "stat": "Sum",
          "region": "us-east-1",
          "title": "API Gateway Metrics"
        }
      }
    ]
  }'
```

## Checkpoint

Invoke the API a few times, then open the CloudWatch dashboard:

```bash
aws cloudwatch get-dashboard --dashboard-name ItemsApi
```

Confirm the dashboard renders. Then check that the metric filter is counting errors:

```bash
aws logs describe-metric-filters --log-group-name /aws/lambda/items-api
```

Expected: one metric filter named `errors` targeting `ItemsApi/LambdaErrors`.

**Next** → [Production hardening](./10-production-hardening.md)
