---
title: IAM in plain language
tier: beginner
platform: aws
position: 2
---

# IAM in plain language

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Beginner › IAM in plain language

**Goal**

After this page you will know what IAM is, why the root account isn't for daily work, and the three IAM terms you'll meet on the next page.

**Prerequisites**

- [What we'll build](./01-what-well-build.md)

## What IAM is

IAM (Identity and Access Management) is the AWS service that decides who can do what. Every API call, console click, and CLI command in AWS passes through IAM first.

Three terms you'll see on the next page:

- **User** — a long-lived identity for a human or a machine. Has credentials (password and/or access keys).
- **Policy** — a JSON document that lists allowed actions, like "can read any S3 bucket".
- **Group** — a bag of users that share the same policies, so you attach a policy once instead of per user.

## Why not just use the root account

The root account is the email you signed up with. It can do anything — close the account, change billing, delete everything. AWS treats it as the "break glass" identity, not the daily driver.

If the root account's credentials leak, every byte in your AWS account is at risk. If a regular IAM user's credentials leak, the blast radius is whatever that user was allowed to do.

The fix is what AWS itself recommends: create an IAM user, give it admin permissions, use that user for daily work, and lock the root account away with MFA already enabled (you did this on the [Getting started page](../introduction/getting-started.md)).

## What "admin" means here

The IAM user you create on the next page will have the `AdministratorAccess` policy attached. That's everything except billing and a few root-only actions. For this tier, admin is enough — narrowing permissions is a topic for the advanced tier.

For everything IAM can do, see the [official IAM user guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html). The pieces we need now are users, the `AdministratorAccess` policy, and access keys.

**Next** → [Create an admin IAM user](./03-create-iam-user.md)
