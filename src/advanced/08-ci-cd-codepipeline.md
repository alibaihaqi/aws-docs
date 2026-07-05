---
title: CI/CD with CodePipeline
tier: advanced
platform: aws
position: 8
---

# CI/CD with CodePipeline

[Hub](https://alibaihaqi.github.io/learning-docs/) › AWS › Advanced › CI/CD with CodePipeline

**Goal**

After this page you will have a CodePipeline that pulls source from GitHub, builds the Lambda package, and deploys via CloudFormation/CDK whenever you push to the main branch.

**Prerequisites**

- [CloudFormation outputs](./07-cloudformation-outputs.md)
- A GitHub repository containing your CDK app and Lambda code.
- A GitHub personal access token (classic) with `repo` scope.

## Pipeline overview

```
GitHub push → CodePipeline → CodeBuild → cdk deploy
```

Each push to `main` triggers:

1. **Source stage** — CodePipeline pulls the latest code from GitHub (using a stored token).
2. **Build stage** — CodeBuild runs `npm ci`, `npm run build`, and `npx aws-cdk synth`.
3. **Deploy stage** — CodePipeline deploys the synthesized CloudFormation template.

## Create the build project

Create `buildspec.yml` in the repo root:

```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 20
    commands:
      - npm ci
  build:
    commands:
      - npm run build        # tsc compilation
      - npx aws-cdk synth     # synthesize CloudFormation template
artifacts:
  base-directory: cdk.out
  files: "**/*"
```

## Create the pipeline (CLI)

```bash
# PLACEHOLDER — replace with your GitHub repo, branch, and token secret name.
aws codepipeline create-pipeline \
  --pipeline-name items-api-pipeline \
  --pipeline-type V2 \
  --role-arn arn:aws:iam::123456789012:role/service-role/codepipeline-service-role \
  --artifact-store type=S3,location=my-artifact-bucket-name \
  --stages '[
    {
      "name": "Source",
      "actions": [{
        "name": "GitHubSource",
        "actionTypeId": { "category": "Source", "owner": "ThirdParty", "provider": "GitHub", "version": "1" },
        "configuration": {
          "Owner": "your-github-username",
          "Repo": "items-cdk",
          "Branch": "main",
          "OAuthToken": "your-github-token"
        },
        "outputArtifacts": [{ "name": "SourceArtifact" }],
        "runOrder": 1
      }]
    },
    {
      "name": "Build",
      "actions": [{
        "name": "CodeBuild",
        "actionTypeId": { "category": "Build", "owner": "AWS", "provider": "CodeBuild", "version": "1" },
        "configuration": {
          "ProjectName": "items-api-build"
        },
        "inputArtifacts": [{ "name": "SourceArtifact" }],
        "outputArtifacts": [{ "name": "BuildArtifact" }],
        "runOrder": 1
      }]
    },
    {
      "name": "Deploy",
      "actions": [{
        "name": "DeployToCloudFormation",
        "actionTypeId": { "category": "Deploy", "owner": "AWS", "provider": "CloudFormation", "version": "1" },
        "configuration": {
          "ActionMode": "CREATE_UPDATE",
          "StackName": "ItemsCdkStack",
          "TemplatePath": "BuildArtifact::Assembly-Manifest.json",
          "Capabilities": "CAPABILITY_IAM"
        },
        "inputArtifacts": [{ "name": "BuildArtifact" }],
        "runOrder": 1
      }]
    }
  ]'
```

## Pipeline as CDK

The better approach is to define the pipeline *in* CDK so it is version-controlled. Add a `PipelineStack` to your CDK app:

```typescript
import { Stack, StackProps, SecretValue } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Pipeline, Artifact } from "aws-cdk-lib/aws-codepipeline";
import { GitHubSourceAction, CodeBuildAction, CloudFormationCreateUpdateStackAction } from "aws-cdk-lib/aws-codepipeline-actions";
import { PipelineProject, BuildSpec } from "aws-cdk-lib/aws-codebuild";

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceOutput = new Artifact("SourceArtifact");
    const buildOutput = new Artifact("BuildArtifact");

    const project = new PipelineProject(this, "BuildProject", {
      buildSpec: BuildSpec.fromSourceFilename("buildspec.yml"),
    });

    new Pipeline(this, "ItemsPipeline", {
      pipelineName: "items-api-pipeline",
      stages: [
        {
          stageName: "Source",
          actions: [
            new GitHubSourceAction({
              actionName: "GitHubSource",
              owner: "your-github-username",
              repo: "items-cdk",
              branch: "main",
              oauthToken: SecretValue.secretsManager("github-token"),
              output: sourceOutput,
            }),
          ],
        },
        {
          stageName: "Build",
          actions: [
            new CodeBuildAction({
              actionName: "CodeBuild",
              project,
              input: sourceOutput,
              outputs: [buildOutput],
            }),
          ],
        },
        {
          stageName: "Deploy",
          actions: [
            new CloudFormationCreateUpdateStackAction({
              actionName: "DeployToCloudFormation",
              stackName: "ItemsCdkStack",
              templatePath: buildOutput.atPath("Assembly-Manifest.json"),
              adminPermissions: true,
            }),
          ],
        },
      ],
    });
  }
}
```

## Checkpoint

Push the pipeline CDK code to GitHub and deploy the pipeline stack:

```bash
# PLACEHOLDER — use your own stack name and region.
npx aws-cdk deploy PipelineStack
```

Then trigger the pipeline by pushing a change to `main`:

```bash
git push origin main
```

Monitor progress:

```bash
aws codepipeline get-pipeline-state --name items-api-pipeline
```

Expected: all three stages show `status: Succeeded`. The Lambda and API Gateway are now deployed by CI/CD on every push.

**Next** → [CloudWatch logs and alarms](./09-cloudwatch-logs-alarms.md)
