---
title: Lambda authorizer
tier: advanced
platform: aws
position: 4
---

# Lambda authorizer

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Advanced › Lambda authorizer

**Goal**

After this page you will have a Lambda authorizer that validates Cognito JWT tokens and attaches the user identity to the request context, protecting your API from unauthenticated callers.

**Prerequisites**

- [Cognito auth](./03-cognito-auth.md)
- A Cognito User Pool ID and a valid IdToken from sign-in.

## What a Lambda authorizer does

API Gateway can call a Lambda function before the main handler to decide whether to allow or deny a request. The authorizer receives the `Authorization` header, validates the JWT, and returns an IAM policy document.

If the token is valid, the authorizer returns `{"effect": "Allow"}` and the main Lambda runs. If invalid, it returns `{"effect": "Deny"}` and API Gateway returns `401` immediately — the main Lambda never runs.

## Create the authorizer Lambda

Create `authorizer.mjs`:

```javascript
// authorizer.mjs — Lambda authorizer for API Gateway HTTP API (payload v2.0)
import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-1_EXAMPLE",    // PLACEHOLDER — your User Pool ID
  tokenUse: "id",                       // validate the IdToken
  clientId: "EXAMPLE_CLIENT_ID",        // PLACEHOLDER — your app client ID
});

export const handler = async (event) => {
  try {
    const token = event.headers?.authorization?.replace("Bearer ", "");
    if (!token) throw new Error("No token");

    const payload = await verifier.verify(token);
    const principalId = payload.sub;

    return {
      principalId,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [{
          Effect: "Allow",
          Action: "execute-api:Invoke",
          Resource: event.routeArn,
        }],
      },
      context: { userId: principalId, email: payload.email || "" },
    };
  } catch {
    return {
      principalId: "unauthorized",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [{
          Effect: "Deny",
          Action: "execute-api:Invoke",
          Resource: event.routeArn,
        }],
      },
    };
  }
};
```

Deploy the authorizer:

```bash
# PLACEHOLDER — use your own role ARN; commands need real values.
zip authorizer.zip authorizer.mjs

aws lambda create-function \
  --function-name items-authorizer \
  --runtime nodejs20.x \
  --zip-file fileb://authorizer.zip \
  --handler authorizer.handler \
  --role arn:aws:iam::123456789012:role/lambda-basic-execution
```

The `aws-jwt-verify` dependency must be bundled. The simplest approach is to install it locally before zipping:

```bash
npm init -y && npm install aws-jwt-verify
cp -r node_modules nodejs/
zip -r authorizer.zip authorizer.mjs nodejs/
rm -rf nodejs/
```

## Wire the authorizer to the API

Get your HTTP API ID:

```bash
aws apigatewayv2 get-apis --region us-east-1
```

Then create the authorizer and attach it to the route:

```bash
# PLACEHOLDER — replace api-id and function ARN.
AUTHORIZER_ID=$(aws apigatewayv2 create-authorizer \
  --api-id abcd1234 \
  --authorizer-type REQUEST \
  --authorizer-uri arn:aws:lambda:us-east-1:123456789012:function:items-authorizer \
  --identity-source '["$request.header.Authorization"]' \
  --name items-authorizer \
  --query AuthorizerId \
  --output text \
  --region us-east-1)

aws apigatewayv2 update-route \
  --api-id abcd1234 \
  --route-id THE_ROUTE_ID \
  --authorizer-id $AUTHORIZER_ID \
  --authorization-type CUSTOM \
  --region us-east-1
```

Grant API Gateway permission to invoke the authorizer:

```bash
aws lambda add-permission \
  --function-name items-authorizer \
  --statement-id api-gateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn arn:aws:execute-api:us-east-1:123456789012:abcd1234/* \
  --region us-east-1
```

## Checkpoint

Test without a token:

```bash
curl -w "\n%{http_code}" https://abcd1234.execute-api.us-east-1.amazonaws.com/items
```

Expected: `401` Unauthorized.

Test with the IdToken from the previous page:

```bash
curl -H "Authorization: Bearer eyJ..." https://abcd1234.execute-api.us-east-1.amazonaws.com/items
```

Expected: `200` with the item list.

**Next** → [IaC with CDK](./05-iac-with-cdk.md)
