# AWS Learning Docs

> Public VitePress documentation site published to GitHub Pages. Part of the
> learning-docs hub.

## Content model
- Content lives in `src/`. Tiers: `introduction`, `beginner`, `intermediate`.
  Each tier is a numbered ladder building ONE concrete artifact.
- Tier `index.md` frontmatter: `title`, `tier`, `platform: aws`.

## Add a page
1. Create `src/<tier>/NN-title.md` with a goal, steps with complete code, and a
   runnable checkpoint (local command or clearly-marked placeholder AWS command).
2. Add it to the tier `index.md` ladder and the sidebar in `.vitepress/config.mts`.

## Add a tier
New `src/<tier>/` + `index.md` (frontmatter) + sidebar group + home feature card.

## Build
- `pnpm install`
- `pnpm docs:build`   # must pass; checks dead links
- `pnpm docs:preview`

## RULE — this repo is PUBLIC (AWS-specific)
Never commit secrets, access keys, credentials, or personal data. NEVER paste a
real AWS account ID, ARN, bucket name, distribution id, or invoke URL tied to a
real account. Use placeholders ONLY:
- account id: `123456789012`
- region: `us-east-1`
- distribution: `EXAMPLE123DIST`
- domain: `example.com`
- function ARN: `arn:aws:lambda:us-east-1:123456789012:function:items-api`
No live deployment happens from this repo — pages document steps only.
