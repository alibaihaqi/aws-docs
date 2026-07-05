---
title: Create a DynamoDB table
tier: advanced
platform: aws
position: 2
---

# Create a DynamoDB table

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Advanced › Create a DynamoDB table

**Goal**

After this page you will have a DynamoDB table and a Lambda function that reads and writes items using the AWS SDK.

**Prerequisites**

- [Why DynamoDB](./01-why-dynamodb.md)
- The intermediate tier `items-api` Lambda function deployed.

## Create the table

DynamoDB tables need a primary key. For this project you will use a simple `pk` (partition key) of type string:

```bash
# PLACEHOLDER — replace 123456789012 with your account ID; never commit real values.
aws dynamodb create-table \
  --table-name items \
  --attribute-definitions AttributeName=pk,AttributeType=S \
  --key-schema AttributeName=pk,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

- `PAY_PER_REQUEST` — you pay per read/write request unit, no capacity planning.
- `HASH` — the partition key. DynamoDB distributes items across partitions based on a hash of this key.

## Update the Lambda to use DynamoDB

Replace `index.mjs` with this version that reads from DynamoDB:

```javascript
// index.mjs — Lambda (Node.js 20), reads items from DynamoDB
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "items";

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

The Lambda execution role needs `dynamodb:Scan` and `dynamodb:PutItem` on the `items` table. Attach this inline policy:

```bash
# PLACEHOLDER — replace with your account ID and function name.
aws iam put-role-policy \
  --role-name lambda-basic-execution \
  --policy-name dynamodb-items-access \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": ["dynamodb:Scan", "dynamodb:PutItem"],
      "Resource": "arn:aws:dynamodb:us-east-1:123456789012:table/items"
    }]
  }'
```

Redeploy the Lambda:

```bash
# PLACEHOLDER — use your own function ARN and role ARN.
zip function.zip index.mjs
aws lambda update-function-code --function-name items-api --zip-file fileb://function.zip
```

## Checkpoint test

After redeploying, call the API to verify it returns data:

```bash
# PLACEHOLDER — replace with your API Gateway invoke URL.
curl https://abcd1234.execute-api.us-east-1.amazonaws.com/items
```

Expected: a `200` with an empty array `[]` (the table is new). Then POST a new item:

```bash
# PLACEHOLDER — replace with your invoke URL.
curl -X POST https://abcd1234.execute-api.us-east-1.amazonaws.com/items \
  -H "Content-Type: application/json" \
  -d '{"id": "1", "name": "Notebook"}'
```

Expected: `201` with the created item. Run the GET again — the item now appears.

**Next** → [Cognito auth](./03-cognito-auth.md)
