---
layout: home

hero:
  name: "AWS Documentation"
  text: "Curated step-by-step roadmap to learn AWS from zero."
  tagline: "Part of the Learning Docs hub."
  actions:
    - theme: brand
      text: Get started
      link: /introduction/getting-started
    - theme: alt
      text: Hub
      link: https://alibaihaqi.github.io/learning-docs/

features:
  - title: Roadmap-shaped
    details: Pages are ordered as a ladder. Each page assumes the previous and unlocks the next.
  - title: Plain language
    details: Every idiom is defined inline before it is used. No prior AWS experience assumed.
  - title: Ends in something runnable
    details: Each tier closes with a deployable artifact you can show off.
  - title: Beginner
    details: Static site on S3 + CloudFront. Build and deploy a public HTTPS page.
    link: /beginner/
  - title: Intermediate
    details: Add a Lambda + API Gateway backend. Fetch dynamic data from the page and invalidate the CloudFront cache.
    link: /intermediate/
  - title: Advanced
    details: DynamoDB persistence, Cognito auth, Lambda authorizer, CDK, SAM, CI/CD, CloudWatch alarms, and production hardening.
    link: /advanced/
---
