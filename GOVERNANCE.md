# LumeFlow governance

LumeFlow is an open-source project maintained in public. This document explains
how contributions become project decisions and how stewardship can expand as the
community grows.

## Principles

- Portable diagram source and deterministic output take priority over framework-
  specific convenience.
- Decisions are documented in issues, Discussions, pull requests, release notes,
  or the roadmap rather than private channels.
- Compatibility, security, accessibility, and long-term maintenance are part of
  feature design, not follow-up work.
- Authority follows sustained responsibility. A title is not a substitute for
  review, maintenance, and respectful community participation.

## Roles

### Contributor

Anyone who reports, discusses, documents, tests, designs, reviews, or submits a
change is a contributor. Contributors do not need prior permission for small,
well-scoped work that follows [CONTRIBUTING.md](CONTRIBUTING.md).

### Maintainer

Maintainers triage issues, guide design, review pull requests, manage releases,
enforce community standards, and protect package and repository integrity. The
current maintainer is `@sentimental37`.

Maintainers are expected to recuse themselves when a personal conflict would make
an impartial decision difficult. Security reports and conduct reports may require
private handling even though the eventual technical decision is documented.

### Repository owner

The repository owner controls GitHub and npm access, appoints or removes
maintainers, handles emergency security actions, and resolves decisions that
cannot reach consensus. This authority must be used to preserve the project's
published mission and contributor trust.

## How decisions are made

- Routine fixes, documentation, tests, and compatible features are decided through
  pull-request review.
- Significant APIs, schema changes, new runtime dependencies, new package surfaces,
  and major Studio behavior begin with an issue or Discussion.
- Breaking changes require a written motivation, alternatives, compatibility plan,
  migration path, documentation impact, and intended release boundary.
- Maintainers seek practical consensus. When consensus is not possible, the owner
  records the decision and reasoning in the relevant public thread.
- Accepted design direction can still change when implementation or verification
  reveals new compatibility, security, accessibility, or maintenance costs.

## Review and release authority

Only maintainers merge pull requests and publish releases. Required checks and
resolved review conversations are enforced on `main`. The project uses squash
merges to keep one reviewable commit per pull request.

The maintainer who publishes a release is responsible for the complete release
gate, npm trusted-publisher approval, registry verification, GitHub release, and
rollback or roll-forward communication. npm versions are immutable; corrections
are published as a new version.

## Becoming a maintainer

A contributor may be invited to become a maintainer after demonstrating sustained
work across several of these areas:

- High-quality contributions and reviews over time
- Sound judgment about compatibility, security, and project scope
- Constructive issue triage and community support
- Reliable follow-through on maintenance and release work
- Consistent adherence to the Code of Conduct

The owner documents an appointment publicly and grants the minimum access needed.
Package publication and security-advisory access may be added separately after
additional trust and operational experience.

Maintainers who step away should say so when practical. Access may be removed after
extended inactivity, repeated failure to protect project boundaries, or a serious
Code of Conduct or security violation. Removal decisions and public explanations
must respect private conduct and security reports.

## Changes to governance

Governance changes use the same pull-request process as code changes and should be
announced in Discussions when they materially change contributor or maintainer
expectations.
