# Releasing LumeFlow

This runbook separates verification, npm publication, and the GitHub release so
a failed step cannot create an ambiguous partial release.

## Release prerequisites

- Work from a clean `main` branch containing the intended release commit.
- Use Node.js 20.19 or newer and npm 10 or newer.
- Confirm the same version is present in all five public package manifests.
- Confirm all five packages trust `sentimental37/lumeflow`, `publish.yml`, and
  the GitHub `npm` environment for `npm publish`.
- Keep package publishing access on the strict two-factor policy that disallows
  bypass 2FA tokens.

Never place an npm token, one-time password, or `.npmrc` in the repository.

## 1. Verify from a clean checkout

```powershell
npm ci
npm run release:check
git status --short
```

`release:check` builds and tests every workspace, assembles the public site, packs
all five public packages, and inspects their distribution manifests.

Review the exact package contents before publication:

```powershell
npm pack ./packages/visual-flow --dry-run
npm pack ./packages/visual-flow-react --dry-run
npm pack ./packages/visual-flow-angular/dist --dry-run
npm pack ./packages/visual-flow-next --dry-run
npm pack ./packages/visual-flow-cli --dry-run
```

## 2. Publish packages with GitHub OIDC

The `0.1.0` package set was bootstrapped interactively. Later releases use the
`Publish packages` GitHub Actions workflow and npm trusted publishing, without a
long-lived npm token.

```powershell
git tag -a v0.2.0 -m "LumeFlow 0.2.0"
git push origin v0.2.0
```

Then open **Actions → Publish packages → Run workflow** and provide:

- `version`: the exact version without the `v` prefix
- `confirmation`: `publish @lumeflow`

The workflow checks out the matching tag, verifies every manifest and package,
then publishes core, React, Angular, Next.js, and the CLI in dependency order.
The `npm` environment and package-level trusted-publisher rules bind the OIDC
identity to this repository and workflow.

Use direct `npm publish` only as a documented recovery procedure. It requires
the npm owner's interactive authentication and a current second factor; never
store that credential in GitHub or the repository.

The order is intentional: core is published first, React before Next.js, and all
package dependencies are available before their consumers.

Verify every package from the public registry:

```powershell
npm view @lumeflow/core version
npm view @lumeflow/react version
npm view @lumeflow/angular version
npm view @lumeflow/next version
npm view @lumeflow/cli version
```

If one publication fails, stop and diagnose it. Never bump or republish packages
that already succeeded merely to hide a partial failure.

## 3. Publish the GitHub release

1. Confirm the five registry versions match the intended release.
2. Open the prepared draft release.
3. Recheck its target commit, title, notes, and attached archives.
4. Publish it as the latest release.
5. Verify the release page and all five npm package pages anonymously.

After npm publication, update the root README, changelog, and status text in the
same release PR or an immediate documentation PR.

## 4. Audit trusted publishing

Each package's npm **Trusted Publisher** must remain configured as:

- Provider: GitHub Actions
- Organization or user: `sentimental37`
- Repository: `lumeflow`
- Workflow filename: `publish.yml`
- Environment: `npm`
- Allowed action: `npm publish`

Trusted publishing uses GitHub OIDC instead of a long-lived npm token and creates
provenance for public packages from public repositories. The repository already
contains the `npm` environment and the OIDC-enabled workflow; verify both before
each release and after any repository, workflow, or package rename.

Reference: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).

## Roll-forward policy

npm package versions cannot be replaced. If published contents are wrong, deprecate
the affected version when appropriate, fix the source, increment the version, rerun
the complete release gate, and publish a new version. Do not delete or overwrite
release history to make the mistake less visible.
