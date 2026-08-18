# Security policy

## Supported versions

LumeFlow is currently pre-1.0. Security fixes are applied to the latest published
minor release.

| Version | Supported |
| --- | --- |
| 0.1.x | Yes |
| Earlier source snapshots | No |

## Report a vulnerability privately

Do not open a public issue for a suspected vulnerability.

Use GitHub's **Report a vulnerability** form in the repository's
[Security advisories](https://github.com/sentimental37/lumeflow/security/advisories)
area. Include:

- Affected package, version, and entry point
- Reproduction steps or a minimal proof of concept
- Expected and observed behavior
- Potential impact
- Any suggested mitigation

You should receive an acknowledgement within five business days. The maintainer
will validate the report, coordinate a fix and disclosure timeline, and credit
the reporter when requested and appropriate.

## Security boundaries

The renderer treats diagram labels and metadata as untrusted data. Reports about
markup execution, unsafe URL handling, exported-document injection, filesystem
access in the CLI, dependency substitution, or package-release integrity are in
scope. Hosted applications that merely embed LumeFlow remain responsible for
their own authentication, authorization, storage, and content policies.
