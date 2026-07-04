# Changelog

All notable changes to the AWS learning-docs site. Newest first.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## 2026-07-04 — Intermediate tier + CI

### Added
- **Intermediate tier** (`src/intermediate/`, 6 pages): extends the beginner
  static S3 + CloudFront site into a dynamic one — an API Gateway (HTTP API) +
  Lambda `/items` endpoint returning JSON, the page fetching it client-side, and
  a CloudFront cache-invalidation step. Documentation only (no live deploy); all
  identifiers are placeholders. Wired into the sidebar, nav, and home feature
  card.
- **`CLAUDE.md`** — public-safe repo conventions with AWS-specific emphasis:
  never commit a real account ID, ARN, bucket, or distribution ID; placeholders
  only (`123456789012`, `EXAMPLE123DIST`, `example.com`).

### Changed
- **CI:** pinned Node to `26.4.0` (`.node-version` + `deploy` workflow; was
  `22.21`).

## 2026-06 — Beginner tier + refresh

### Added
- **Beginner tier**: numbered ladder building a one-page static site hosted in
  S3 and served over HTTPS by CloudFront (exit artifact is a shareable URL).

### Changed
- Bumped deprecated GitHub Actions; auto-enable GitHub Pages via
  configure-pages; Node version chore.
- Fixups: macOS duplicate-file cleanup, screenshot TODO.

## 2023 — Initial

### Added
- Repository initialized.
