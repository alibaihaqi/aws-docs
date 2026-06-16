---
title: Create an admin IAM user
tier: beginner
platform: aws
position: 3
---

# Create an admin IAM user

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Beginner › Create an admin IAM user

**Goal**

After this page you will have an IAM user named `cli-admin` with `AdministratorAccess` attached and a pair of access keys saved locally.

**Prerequisites**

- [IAM in plain language](./02-iam-basics.md)
- Signed in to the AWS console as the root user.

## Open IAM

In the console search bar, type `IAM` and open the IAM service. Make sure the top-right region selector is set to a region near you (for example `ap-southeast-1` for Singapore). IAM itself is global, but the region you set here affects every other service in this tier.

## Create the user

1. Left sidebar → **Users** → **Create user**.
2. **User name**: `cli-admin`.
3. Leave **Provide user access to the AWS Management Console** unchecked. This user is for the CLI only.
4. Click **Next**.

## Attach the admin policy

1. **Permissions options**: pick **Attach policies directly**.
2. In the policy search box, type `AdministratorAccess`.
3. Tick the checkbox next to the `AdministratorAccess` policy.
4. Click **Next**, then **Create user**.

## Create the access key

A user without credentials can't sign anything. Create an access key pair:

1. From the user list, click `cli-admin`.
2. Top tabs → **Security credentials**.
3. Scroll to **Access keys** → **Create access key**.
4. Pick **Command Line Interface (CLI)** as the use case. Tick the acknowledgement.
5. Skip the description tag → **Create access key**.
6. On the success screen, click **Download .csv file**. This file is shown once. If you lose it, you'll create a new key.

The CSV contains two strings:

```
Access key ID: AKIA...                  (20 chars, public-ish)
Secret access key: wJalrXUtnFEMI...     (40 chars, secret)
```

Keep the CSV in a password manager. The next page wires these into the AWS CLI.

**Next** → [Configure the AWS CLI](./04-configure-cli.md)
