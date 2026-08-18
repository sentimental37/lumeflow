# Releasing LumeFlow

This runbook separates verification, npm publication, and the GitHub release so
a failed step cannot create an ambiguous partial release.

## Release prerequisites

- Work from a clean `main` branch containing the intended release commit.
- Use Node.js 20.19 or newer and npm 10 or newer.
- Confirm the same version is present in all five public package manifests.
- Be authenticated to the npm account or organization that owns `@lumeflow`.
- Require two-factor authentication for package publication.

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

## 2. Publish the first release

The first release establishes package ownership and cannot be completed without
the npm owner's interactive authentication and 2FA approval.

```powershell
npm login
npm whoami

npm publish ./packages/visual-flow --access public
npm publish ./packages/visual-flow-react --access public
npm publish ./packages/visual-flow-angular/dist --access public
npm publish ./packages/visual-flow-next --access public
npm publish ./packages/visual-flow-cli --access public
```

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

After npm publication, remove the source-release warning in the root README and
update the Status section in the same release PR or an immediate documentation PR.

## 4. Configure trusted publishing for future releases

After the packages exist, configure each package's npm **Trusted Publisher** as:

- Provider: GitHub Actions
- Organization or user: `sentimental37`
- Repository: `lumeflow`
- Workflow filename: `publish.yml`
- Environment: `npm`
- Allowed action: `npm publish`

Trusted publishing uses GitHub OIDC instead of a long-lived npm token and creates
provenance for public packages from public repositories. Add the protected GitHub
`npm` environment before enabling the workflow for a later release.

Reference: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).

## Roll-forward policy

npm package versions cannot be replaced. If published contents are wrong, deprecate
the affected version when appropriate, fix the source, increment the version, rerun
the complete release gate, and publish a new version. Do not delete or overwrite
release history to make the mistake less visible.
