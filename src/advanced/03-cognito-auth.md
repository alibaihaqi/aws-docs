---
title: Cognito auth
tier: advanced
platform: aws
position: 3
---

# Cognito auth

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Advanced › Cognito auth

**Goal**

After this page you will have a Cognito User Pool, a registered app client, and a working sign-up / sign-in flow that issues JWT tokens.

**Prerequisites**

- [Create a DynamoDB table](./02-dynamodb-table.md)
- AWS CLI configured with admin credentials.

## What Cognito is

Amazon Cognito provides authentication, authorization, and user management. The User Pool is a user directory that handles sign-up, sign-in, password recovery, and issues JWT tokens. You do not need to build a login screen yet — you will verify the flow from the CLI.

## Create a User Pool

```bash
# PLACEHOLDER — run in your terminal with real values.
aws cognito-idp create-user-pool \
  --pool-name items-api-users \
  --policies 'PasswordPolicy:{MinimumLength:8,RequireUppercase:true,RequireLowercase:true,RequireNumbers:true,RequireSymbols:false}' \
  --auto-verified-attributes email \
  --region us-east-1
```

Save the `UserPool.Id` from the output — it looks like `us-east-1_xxxxxxxxx`.

## Create an app client

```bash
# PLACEHOLDER — replace UserPoolId with your pool ID.
aws cognito-idp create-user-pool-client \
  --user-pool-id us-east-1_EXAMPLE \
  --client-name web-app \
  --generate-secret \
  --explicit-auth-flows ALLOW_REFRESH_TOKEN_AUTH ALLOW_USER_SRP_AUTH ALLOW_USER_PASSWORD_AUTH \
  --region us-east-1
```

Save the `ClientId` from the output.

## Sign up a test user

```bash
# PLACEHOLDER — replace UserPoolId, ClientId, and credentials.
aws cognito-idp sign-up \
  --client-id EXAMPLE_CLIENT_ID \
  --username testuser@example.com \
  --password "Test1234!" \
  --user-attributes Name=email,Value=testuser@example.com \
  --region us-east-1
```

Cognito sends a confirmation code to the email address. Confirm the user:

```bash
# PLACEHOLDER — replace with the actual code from the email.
aws cognito-idp confirm-sign-up \
  --client-id EXAMPLE_CLIENT_ID \
  --username testuser@example.com \
  --confirmation-code XXXX \
  --region us-east-1
```

Alternatively, for testing, you can auto-confirm by setting `--auto-verified-attributes email` or by running an admin command:

```bash
# PLACEHOLDER — replace UserPoolId.
aws cognito-idp admin-confirm-sign-up \
  --user-pool-id us-east-1_EXAMPLE \
  --username testuser@example.com \
  --region us-east-1
```

## Sign in and get tokens

```bash
# PLACEHOLDER — replace ClientId and credentials; the CLI tool will prompt for the SecretBlock manually
# if using generate-secret. A simpler approach for testing is a client without a secret:
# aws cognito-idp create-user-pool-client --user-pool-id us-east-1_EXAMPLE --client-name test --no-generate-secret --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH --region us-east-1
aws cognito-idp initiate-auth \
  --auth-flow USER_PASSWORD_AUTH \
  --client-id EXAMPLE_CLIENT_ID \
  --auth-parameters USERNAME=testuser@example.com,PASSWORD="Test1234!" \
  --region us-east-1
```

The response contains:

```
AuthenticationResult:
  AccessToken:  eyJ... (JWT)
  IdToken:      eyJ... (JWT)
  RefreshToken: eyJ... (opaque)
```

Save the `IdToken` — you will use it as the `Authorization` header when calling the API in the next page.

## Checkpoint

```bash
# Verify the token is valid by calling GetUser.
aws cognito-idp get-user \
  --access-token eyJ... \
  --region us-east-1
```

Expected output: the user's attributes (email, sub) confirming the token is live.

**Next** → [Lambda authorizer](./04-auth-lambda-authorizer.md)
