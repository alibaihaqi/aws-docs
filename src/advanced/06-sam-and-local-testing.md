---
title: SAM and local testing
tier: advanced
platform: aws
position: 6
---

# SAM and local testing

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Advanced › SAM and local testing

**Goal**

After this page you will be able to run and debug the Lambda function locally using AWS SAM, without deploying to AWS each time.

**Prerequisites**

- [IaC with CDK](./05-iac-with-cdk.md)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developergraph/sam-cli-command-reference.html) installed locally.

## Why SAM

The CDK stack from the previous page requires a full `cdk deploy` to test any code change. That cycle takes 2–5 minutes per iteration. AWS SAM (Serverless Application Model) lets you:

- Run Lambda functions locally with `sam local invoke`.
- Start a local HTTP server that emulates API Gateway with `sam local start-api`.
- Debug with breakpoints via `--debugger` or `--port`.

## Project structure

SAM works with a `template.yaml` file instead of CDK TypeScript. Create `template.yaml` in the project root:

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Timeout: 10
    Runtime: nodejs20.x
    Environment:
      Variables:
        TABLE_NAME: items

Resources:
  ItemsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: items
      AttributeDefinitions:
        - AttributeName: pk
          AttributeType: S
      KeySchema:
        - AttributeName: pk
          KeyType: HASH
      BillingMode: PAY_PER_REQUEST

  ItemsFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: lambda/
      Handler: index.handler
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref ItemsTable
      Events:
        Api:
          Type: HttpApi
          Properties:
            Path: /items
            Method: ANY
```

SAM requires the `AWS::Serverless-2016-10-31` transform. The `DynamoDBCrudPolicy` managed policy grants read/write access to the referenced table automatically.

## Run the API locally

```bash
# Start a local API Gateway emulator on port 3000.
sam local start-api --port 3000
```

In another terminal:

```bash
curl http://localhost:3000/items
```

Expected: `200` with data from the local DynamoDB (SAM downloads a DynamoDB local JAR on first run, or connects to a real table if your AWS credentials allow it).

## Invoke a single function

```bash
sam local invoke ItemsFunction \
  --event events/get-items.json
```

Create `events/get-items.json`:

```json
{
  "version": "2.0",
  "routeKey": "GET /items",
  "rawPath": "/items",
  "rawQueryString": "",
  "headers": {
    "Content-Type": "application/json"
  },
  "requestContext": {
    "http": {
      "method": "GET",
      "path": "/items",
      "protocol": "HTTP/1.1"
    }
  },
  "body": null,
  "isBase64Encoded": false
}
```

Create `events/post-item.json`:

```json
{
  "version": "2.0",
  "routeKey": "POST /items",
  "rawPath": "/items",
  "headers": {
    "Content-Type": "application/json"
  },
  "requestContext": {
    "http": {
      "method": "POST",
      "path": "/items",
      "protocol": "HTTP/1.1"
    }
  },
  "body": "{\"id\":\"test1\",\"name\":\"Test item\"}",
  "isBase64Encoded": false
}
```

Test the POST:

```bash
sam local invoke ItemsFunction --event events/post-item.json
```

## Hot-reload workflow

Use `sam local start-api` during development. Every save to `lambda/index.mjs` is picked up immediately — no rebuild required. Only deploy to AWS when the code is production-ready.

## Checkpoint

```bash
sam local start-api --port 3000 &  # start in background
curl -s http://localhost:3000/items | jq .
kill %1                            # stop the server
```

Expected: the same JSON response you would get from the live API, served entirely from your machine.

**Next** → [CloudFormation outputs](./07-cloudformation-outputs.md)
