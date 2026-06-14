# Getting started

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Introduction › Getting started

**Goal**

After this page you will have an AWS Free Tier account and the AWS CLI installed and authenticated.

## What you'll need

- A credit or debit card (required for AWS account creation, even on Free Tier).
- A phone number for SMS verification.
- About 30 minutes.

## Create an AWS account

The official [AWS sign-up page](https://aws.amazon.com/) walks you through account creation. Use a personal email — you can transfer ownership later.

A few decisions you'll make:

- **Support plan**: pick **Basic** (free). The other tiers cost monthly.
- **Account name**: use something memorable. You'll see it in the console header.

## Set up the root user MFA

After account creation, immediately add multi-factor authentication to the root account.

Console → Security credentials → MFA → Assign MFA device. Use an authenticator app (1Password, Authy, Google Authenticator).

Do not use the root account for daily work. The beginner tier walks through creating an IAM user with restricted permissions.

## Install the AWS CLI

On macOS:

```
brew install awscli
```

On Linux, follow the [official install guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

Verify:

```
aws --version
```

You should see something like:

```
aws-cli/2.x.x …
```

## Next

The beginner tier (deploy a static site to S3 + CloudFront) ships next. Until then, this page is the entry point.
