# Contributing to LumeFlow

Thank you for helping make architecture diagrams clearer, more portable, and
more useful. Contributions can be code, tests, documentation, examples, design
feedback, bug reports, or help answering questions.

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md). Usage questions and
early design ideas belong in
[GitHub Discussions](https://github.com/sentimental37/lumeflow/discussions).
Reproducible bugs and scoped feature proposals belong in
[GitHub Issues](https://github.com/sentimental37/lumeflow/issues).

## Before you start

- Search existing issues, pull requests, Discussions, and the [roadmap](ROADMAP.md).
- Open an issue or Discussion before investing in a large feature, public API
  change, schema change, new dependency, or breaking change.
- Comment on an open issue before starting substantial work. A maintainer can
  confirm the direction and mark it as assigned.
- Small documentation, test, typo, and clearly isolated bug fixes may go directly
  to a pull request.
- Never include credentials, customer data, private architecture, or proprietary
  source in issues, examples, tests, or screenshots.

Maintainers may close proposals that conflict with LumeFlow's portable,
framework-neutral source model or that cannot be maintained sustainably.

## Set up your fork

Requirements: Node.js 20.19 or newer and npm 10 or newer.

```powershell
git clone https://github.com/YOUR-USER/lumeflow.git
cd lumeflow
git remote add upstream https://github.com/sentimental37/lumeflow.git
npm ci
npm run verify
```

Keep your branch current before opening or updating a pull request:

```powershell
git fetch upstream
git rebase upstream/main
```

Use a short branch name such as `feat/edge-labels`, `fix/angular-ssr`,
`docs/vue-example`, or `chore/dependency-audit`. Keep unrelated changes in
separate pull requests.

## Choose the correct layer

| Area | Location | Responsibility |
| --- | --- | --- |
| Core | `packages/visual-flow` | Schema, validation, layout, routing, themes, rendering, DOM mounting, and export |
| React | `packages/visual-flow-react` | React lifecycle, editable canvas, and interaction |
| Next.js | `packages/visual-flow-next` | Server/static rendering and the client entry point |
| Angular | `packages/visual-flow-angular` | Standalone component, Angular packaging, and SSR guards |
| CLI | `packages/visual-flow-cli` | Validation, inspection, rendering, schema output, and migration |
| Studio | `packages/visual-flow-studio` | Drag-and-drop authoring and the builder UI |
| Showcase | `apps/angular-demo`, `apps/gallery` | Documentation, API examples, and visual demonstrations |
| Agent skill | `agent-skills/create-lumeflow-diagram` | Agent authoring instructions, reference, starter, and rendering helper |

Public contract changes require coordinated updates to TypeScript types,
validation, the CLI, framework adapters, examples, the agent skill reference,
and documentation where applicable.

## Develop and verify

Common commands:

```powershell
npm run verify               # Build, typecheck, tests, and PR-policy tests
npm run build:site           # Assemble the complete showcase and builder
npm run preview:site         # Serve the assembled site on port 4200
npm run pack                 # Create all public package archives
npm run verify:distribution  # Inspect packed public-package contracts
```

Run the smallest relevant check while iterating, then run the complete required
gate before requesting review.

| Change | Required evidence |
| --- | --- |
| Documentation only | Review links, examples, spelling, and rendered Markdown |
| Behavior or bug fix | Focused regression test and `npm run verify` |
| Public package/API | Tests, documentation, `npm run pack`, and `npm run verify:distribution` |
| Renderer, Studio, or showcase UI | Dark and light checks plus before/after screenshots or a short recording |
| Schema or migration | Validation tests, compatibility notes, examples, CLI behavior, and agent-skill updates |
| Dependency update | Full verification and an explanation for major-version changes |

Generated build output, `site-dist`, package archives, and local caches must not
be committed.

## Commit and pull-request conventions

Use an imperative conventional title. Supported types are `feat`, `fix`, `docs`,
`refactor`, `perf`, `test`, `build`, `ci`, `chore`, and `revert`.

Examples:

```text
feat(core): add explicit edge port selection
fix(angular): preserve SSR-safe rendering
docs: add a Svelte integration example
```

Use `!` and explain the migration when a change is intentionally breaking, for
example `feat(core)!: revise the layout options`.

Every ready-for-review pull request must:

- Explain what changed and why.
- Link the relevant issue, or state why no issue was needed.
- Record exact verification commands and results.
- Include visual evidence for visible changes.
- Describe compatibility, security, dependency, and migration implications.
- Update tests and nearby documentation together with the behavior.
- Stay focused enough to review and revert safely.

Draft pull requests are welcome for early feedback. Mark the pull request ready
only after completing the template and the applicable local checks. Automated
checks validate the title and required sections; maintainers review behavior,
design, security, compatibility, and maintainability.

## Review and merge lifecycle

1. A maintainer triages the pull request and may request a linked issue or design
   discussion for broader changes.
2. CI and the PR metadata check must pass against the current `main` branch.
3. All review conversations must be resolved. Authors should explain disagreements
   rather than resolving maintainer comments without a response.
4. A maintainer performs the final merge. LumeFlow uses squash merging so the pull
   request title becomes the durable changelog-friendly commit title.
5. Merged branches are deleted automatically. Release notes credit contributors
   when their work ships.

Approval is not a guarantee of immediate release. Maintainers may batch compatible
changes and choose the release in which they ship.

## AI-assisted contributions

AI-assisted work is welcome, but the human contributor remains responsible for
the complete change. Review generated code, validate licenses and provenance,
remove fabricated APIs or tests, and disclose material AI assistance in the pull
request. Do not paste private source, customer diagrams, credentials, or security
reports into third-party models.

## Licensing and security

By submitting a contribution, you confirm that you have the right to submit it
and agree that it will be distributed under the repository's [MIT License](LICENSE).
No separate contributor license agreement is currently required.

Do not report vulnerabilities in public issues or pull requests. Follow the
private process in [SECURITY.md](SECURITY.md).

Project decision-making and maintainer responsibilities are described in
[GOVERNANCE.md](GOVERNANCE.md). Maintainer triage and merge operations are
documented in [docs/MAINTAINER_GUIDE.md](docs/MAINTAINER_GUIDE.md).
