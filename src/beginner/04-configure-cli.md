---
title: Configure the AWS CLI
tier: beginner
platform: aws
position: 4
---

# Configure the AWS CLI

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Beginner › Configure the AWS CLI

**Goal**

After this page you will run `aws sts get-caller-identity` from your terminal and see the `cli-admin` user echoed back.

**Prerequisites**

- [AWS CLI installed](../introduction/getting-started.md)
- [Access key CSV downloaded](./03-create-iam-user.md)

## Run aws configure

Open the access key CSV from the previous page. Then in your terminal:

```
aws configure
```

The CLI prompts for four values. Fill them in:

```
AWS Access Key ID [None]: <paste Access key ID from the CSV>
AWS Secret Access Key [None]: <paste Secret access key from the CSV>
Default region name [None]: ap-southeast-1
Default output format [None]: json
```

Pick the region you'll use for the rest of the tier. The S3 bucket and CloudFront distribution will live there. Common picks:

- `ap-southeast-1` — Singapore
- `us-east-1` — N. Virginia (cheapest CloudFront pricing, default for many AWS examples)
- `eu-west-1` — Ireland

If you don't have a preference, pick `us-east-1` — every AWS example you'll meet later defaults to it.

## Where the credentials live

`aws configure` wrote two files into `~/.aws/`:

```
~/.aws/credentials   # access key id + secret access key
~/.aws/config        # default region + output format
```

The CLI reads these on every command. The CSV from the previous page can now be deleted from your Downloads folder — the credentials live in `~/.aws/credentials`.

## Verify

```
aws sts get-caller-identity
```

Expected output (your numbers will differ):

```json
{
    "UserId": "AIDAEXAMPLEUSERID",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/cli-admin"
}
```

The `Arn` ending in `user/cli-admin` confirms you're signed in as the new user, not the root account. STS (Security Token Service) is the AWS service that answers "who am I?" — `get-caller-identity` is the canonical sanity check.

**Next** → [S3 in plain language](./05-s3-basics.md)
