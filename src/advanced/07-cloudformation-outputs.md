---
title: CloudFormation outputs
tier: advanced
platform: aws
position: 7
---

# CloudFormation outputs

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Advanced › CloudFormation outputs

**Goal**

After this page you will understand how to export values from one CloudFormation/CDK stack and import them into another, enabling cross-stack references.

**Prerequisites**

- [IaC with CDK](./05-iac-with-cdk.md) — you have a deployed CDK stack.

## Why cross-stack references

As your infrastructure grows, you will split resources across multiple stacks:

| Stack | Resources |
|---|---|
| `DatabaseStack` | DynamoDB tables |
| `AuthStack` | Cognito User Pool |
| `ApiStack` | Lambda, API Gateway, authorizer |
| `FrontendStack` | S3 bucket, CloudFront |

Stack A (e.g. `DatabaseStack`) exports values (table name, ARN). Stack B (e.g. `ApiStack`) imports them. This keeps each stack focused and independently deployable.

## Export an output in CDK

In your CDK stack, use `CfnOutput` with `exportName`:

```typescript
import { CfnOutput } from "aws-cdk-lib";

// Inside the stack constructor:
new CfnOutput(this, "ItemsTableName", {
  value: table.tableName,
  exportName: "ItemsTableName",
});

new CfnOutput(this, "ItemsTableArn", {
  value: table.tableArn,
  exportName: "ItemsTableArn",
});
```

When you deploy, CloudFormation registers these as exports visible to other stacks in the same account and region.

## Import in another stack

```typescript
import { Fn } from "aws-cdk-lib";

// Inside a different stack:
const tableName = Fn.importValue("ItemsTableName");
const tableArn = Fn.importValue("ItemsTableArn");
```

The import creates a cross-stack reference. The exporting stack cannot be deleted as long as any importing stack references it.

## View exports via CLI

```bash
# List all exported outputs in the region.
aws cloudformation list-exports --region us-east-1
```

Output example:

```json
{
  "Exports": [
    {
      "Name": "ItemsTableName",
      "Value": "items",
      "ExportingStackId": "arn:aws:cloudformation:us-east-1:123456789012:stack/ItemsCdkStack/..."
    },
    {
      "Name": "ItemsTableArn",
      "Value": "arn:aws:dynamodb:us-east-1:123456789012:table/items",
      "ExportingStackId": "arn:aws:cloudformation:us-east-1:123456789012:stack/ItemsCdkStack/..."
    }
  ]
}
```

## CloudFormation outputs vs SSM Parameter Store

| Approach | Best for |
|---|---|
| `Fn::ImportValue` / `CfnOutput` | Cross-stack references within one account/region |
| SSM Parameter Store | Cross-account, cross-region, or non-CloudFormated resources |
| Secrets Manager | Secrets (database passwords, API keys) |

SSM Parameter Store example:

```bash
# Write a parameter.
aws ssm put-parameter --name /items-api/table-name --value items --type String

# Read it in CDK:
import { StringParameter } from "aws-cdk-lib/aws-ssm";
const tableName = StringParameter.fromStringParameterName(this, "TableName", "/items-api/table-name");
```

## Checkpoint

Add a `CfnOutput` with `exportName` to your CDK stack, redeploy, and verify the export appears:

```bash
# PLACEHOLDER — use your own region.
aws cloudformation list-exports --region us-east-1 --query "Exports[?starts_with(Name, 'Items')]"
```

Expected: at least one export with `Name` starting with `"Items"` and the corresponding `Value` and `ExportingStackId`.

**Next** → [CI/CD with CodePipeline](./08-ci-cd-codepipeline.md)
