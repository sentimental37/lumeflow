# Contributing to LumeFlow

Thank you for helping make architecture diagrams clearer, more portable, and more
useful. Questions and early design ideas are welcome in
[GitHub Discussions](https://github.com/sentimental37/lumeflow/discussions).

## Set up the workspace

Use Node.js 20.19 or newer and npm 10 or newer.

```powershell
git clone https://github.com/sentimental37/lumeflow.git
cd lumeflow
npm install
npm run verify
```

Run the complete showcase and builder:

```powershell
npm run build:site
npm run preview:site
```

Open `http://127.0.0.1:4200/` and `/builder/`.

## Choose the correct layer

- Put schema, validation, layout, routing, themes, renderer, and export behavior in
  `packages/visual-flow`.
- Keep React, Angular, and Next.js packages focused on host lifecycle and framework
  integration.
- Put visual authoring behavior in `packages/visual-flow-studio`.
- Keep the CLI deterministic and suitable for CI.
- Update the agent skill when a public schema or authoring workflow changes.

Public contract changes require coordinated updates to TypeScript types, validation,
the CLI, framework adapters, examples, the agent skill reference, and documentation.

## Before opening a pull request

1. Add or update focused tests for behavior changes.
2. Run `npm run verify`.
3. For package changes, run `npm run pack` and `npm run verify:distribution`.
4. For site or Studio changes, check the affected view in dark and light modes and
   include screenshots.
5. Keep commits focused and explain compatibility or migration consequences.

Do not commit generated build output, package archives, credentials, customer data,
or private architecture. All examples and test data must be fictional.

## Reporting problems

Use the structured issue forms for bugs and feature proposals. Report vulnerabilities
privately according to [SECURITY.md](SECURITY.md), and follow the
[community code of conduct](CODE_OF_CONDUCT.md) in every project space.
