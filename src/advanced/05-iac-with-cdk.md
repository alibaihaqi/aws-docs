---
title: IaC with CDK
tier: advanced
platform: aws
position: 5
---

# IaC with CDK

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Advanced › IaC with CDK

**Goal**

After this page you will have an AWS CDK (TypeScript) application that defines the DynamoDB table, Lambda function, and API Gateway entirely in code, and you will deploy it with a single `cdk deploy` command.

**Prerequisites**

- [Lambda authorizer](./04-auth-lambda-authorizer.md)
- Node.js 20, AWS CLI configured.

## Why CDK

So far you have created every resource through the AWS CLI or console. That works for learning, but it is not repeatable. CDK lets you define all infrastructure as TypeScript code, review it, version it in git, and deploy it with one command. Benefits:

- **Self-documenting** — the code is the architecture.
- **Repeatable** — same stack every time, no click-ops.
- **Diffable** — `cdk diff` shows what will change before you deploy.
- **Destroyable** — `cdk destroy` tears everything down.

## Bootstrap

CDK needs a bootstrap stack (S3 bucket + IAM roles) in the target account. Run this once per account/region:

```bash
# PLACEHOLDER — use your own account ID.
npx aws-cdk bootstrap aws://123456789012/us-east-1
```

## Set up the project

```bash
mkdir items-cdk && cd items-cdk
npm init -y
npm install aws-cdk-lib constructs @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
npx aws-cdk init app --language typescript
```

## The CDK stack

Replace `lib/items-cdk-stack.ts`:

```typescript
import { Stack, StackProps } from "aws-cdk-lib";
import { Table, AttributeType, BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { HttpApi, HttpMethod, HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2";
import { Construct } from "constructs";

export class ItemsCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, "ItemsTable", {
      tableName: "items",
      partitionKey: { name: "pk", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    const handler = new Function(this, "ItemsHandler", {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset("./lambda"),
      handler: "index.handler",
      environment: { TABLE_NAME: table.tableName },
    });

    table.grantReadWriteData(handler);

    const api = new HttpApi(this, "ItemsApi", {
      apiName: "items-api",
    });

    const integration = new HttpLambdaIntegration("ItemsIntegration", handler);

    api.addRoutes({
      path: "/items",
      methods: [HttpMethod.GET, HttpMethod.POST],
      integration,
    });

    // Outputs — see page 07 for cross-stack references.
    new CfnOutput(this, "ApiUrl", { value: api.url! });
    new CfnOutput(this, "TableName", { value: table.tableName });
    new CfnOutput(this, "FunctionArn", { value: handler.functionArn });
  }
}
```

## Lambda source

Create `lambda/index.mjs`:

```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || "items";

export const handler = async (event) => {
  try {
    if (event.requestContext?.http?.method === "POST") {
      const body = JSON.parse(event.body);
      const item = {
        pk: body.id?.toString() || crypto.randomUUID(),
        name: body.name || "untitled",
        createdAt: new Date().toISOString(),
      };
      await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
      return { statusCode: 201, headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) };
    }
    const result = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(result.Items || []),
    };
  } catch (err) {
    return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: err.message }) };
  }
};
```

## Deploy

```bash
# PLACEHOLDER — ensure your AWS CLI is configured for the target account.
npx aws-cdk deploy
```

CDK will synthesize a CloudFormation template, compare it with the current deployed stack, and prompt for confirmation. After approval it creates or updates the resources.

## Checkpoint

After deployment completes, the terminal prints the `ApiUrl` output. Call it:

```bash
# PLACEHOLDER — replace with the output URL from cdk deploy.
curl https://abcd1234.execute-api.us-east-1.amazonaws.com/items
```

Expected: `200` with the items in the table (or `[]` if the table is empty).

**Next** → [SAM and local testing](./06-sam-and-local-testing.md)
