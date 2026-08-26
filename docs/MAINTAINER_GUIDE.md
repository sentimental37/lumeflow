# Maintainer guide

This is the operating checklist for LumeFlow issue triage, pull-request review,
merging, and contributor communication. The public contributor contract remains
[CONTRIBUTING.md](../CONTRIBUTING.md); project authority is defined in
[GOVERNANCE.md](../GOVERNANCE.md).

## Intake and triage

Aim to acknowledge a new issue or external pull request within five business days.
An acknowledgement is not a commitment to implement or merge it.

1. Confirm the report belongs in Issues rather than Discussions or a private
   security advisory.
2. Remove exposed credentials or private data immediately and follow the security
   process if needed.
3. Add one product-area label and the most accurate type/status labels.
4. Ask for a minimal reproduction when a bug cannot be evaluated.
5. Link duplicates instead of splitting context across threads.
6. Mark small, well-defined, low-risk work `good first issue`; add `help wanted`
   only when the direction is sufficiently clear for an external contributor.

Do not use inactivity automation to close valid reports. Close an issue when it is
fixed, duplicated, out of scope, unreproducible after reasonable follow-up, or
superseded, and record the reason.

## Label model

- Type: `bug`, `enhancement`, `documentation`, `dependencies`, `accessibility`
- Area: `area: core`, `area: react`, `area: next`, `area: angular`, `area: cli`,
  `area: studio`, `area: showcase`, `area: agent-skill`, `area: repository`
- Status: `triage`, `status: needs-reproduction`, `status: needs-decision`,
  `status: blocked`
- Contributor: `good first issue`, `help wanted`
- Risk: `breaking change`, `security`

Remove `triage` after the scope and next action are clear. Avoid using labels as a
substitute for a written response.

## Pull-request review

Review in this order:

1. **Purpose and scope:** the change solves the stated problem without unrelated
   refactoring.
2. **Public contract:** schemas, types, exports, packages, adapters, CLI, examples,
   skill files, and documentation remain aligned.
3. **Security and privacy:** untrusted labels and metadata stay data; exports do not
   introduce execution; credentials and private diagrams are absent.
4. **Compatibility:** Node, browsers, Angular, React, Next.js, SSR, and existing
   diagram source behave as documented.
5. **Accessibility and visuals:** titles/descriptions, reduced motion, contrast,
   keyboard behavior, dark/light themes, and routing quality are checked where
   relevant.
6. **Evidence:** focused regression tests and the applicable distribution or visual
   evidence are present.
7. **Maintainability:** the implementation belongs in the correct layer, avoids
   unnecessary dependencies, and is understandable to the next contributor.

Use blocking review comments for correctness, security, compatibility, missing
tests, or project-boundary problems. Mark optional improvements clearly as
non-blocking. Never approve solely because CI is green.

## Merge checklist

- PR metadata and CI checks pass against the current `main` branch.
- Required evidence matches the change type in `CONTRIBUTING.md`.
- Review conversations are resolved with an explicit outcome.
- The title follows the conventional format and describes the user-visible result.
- Breaking or migration notes are present when required.
- Documentation, changelog, and roadmap changes are included when applicable.
- The squash commit is coherent and contains no credentials or generated archives.

Squash-merge through GitHub. Do not push directly to `main`, bypass required checks,
or use an administrator override for routine work. Branch deletion after merge is
automatic.

## Dependency pull requests

Dependabot pull requests are proposals, not automatic upgrades. Review release
notes for major changes, ensure peer/tooling versions move together, and run the
same package and distribution checks as a human-authored update. Split grouped
updates when a failure cannot be attributed confidently.

## Releases and security

Follow [docs/RELEASING.md](RELEASING.md) for every release. Do not store npm tokens;
use the protected `npm` environment and trusted publishing.

Follow [SECURITY.md](../SECURITY.md) for vulnerability reports. Do not copy private
advisory details into public issues, pull requests, logs, or AI tools before the
coordinated disclosure point.
