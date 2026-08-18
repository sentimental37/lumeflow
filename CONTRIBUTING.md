# Contributing

1. Use Node.js 20.19 or newer.
2. Run `npm install` from the repository root.
3. Keep diagram behavior in the framework-neutral core unless it truly belongs to a host framework lifecycle.
4. Add or update tests with every model, renderer, adapter, CLI, or Studio behavior change.
5. Run `npm run verify`, `npm run pack`, and `npm run verify:distribution` before proposing a release.
6. Keep example and test data fictional. Never place credentials, customer data, or private architecture in diagram sources.

Public contract changes require coordinated updates to the core schema, TypeScript types, validator, CLI, framework adapters, examples, agent skill reference, and documentation.
