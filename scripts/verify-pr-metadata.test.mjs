import assert from "node:assert/strict";
import test from "node:test";

import { pullRequestFromEvent, validatePullRequest } from "./verify-pr-metadata.mjs";

const completeBody = `
## Related issue

Fixes #42

## What changed

Added deterministic edge ports and focused regression coverage.

## Why

Explicit ports keep large architecture diagrams readable.

## Verification

npm run verify — PASS

## Compatibility and risk

No known compatibility impact. Existing diagrams retain automatic ports.
`;

test("accepts a complete ready pull request", () => {
  assert.deepEqual(
    validatePullRequest({
      title: "feat(core): add explicit edge ports",
      body: completeBody,
      author: "contributor",
    }),
    [],
  );
});

test("accepts a breaking-change marker", () => {
  assert.deepEqual(
    validatePullRequest({
      title: "feat(core)!: revise layout options",
      body: completeBody,
      author: "contributor",
    }),
    [],
  );
});

test("reports an invalid title and missing sections", () => {
  const errors = validatePullRequest({
    title: "Added some things",
    body: "Too short",
    author: "contributor",
  });

  assert.equal(errors.length, 7);
  assert.match(errors[0], /conventional PR title/);
  assert.ok(errors.some((error) => error.includes("## Verification")));
});

test("drafts require only a valid title", () => {
  assert.deepEqual(
    validatePullRequest({
      title: "docs: sketch a contributor guide",
      body: "",
      draft: true,
      author: "contributor",
    }),
    [],
  );
});

test("bots are exempt from human metadata conventions", () => {
  assert.deepEqual(
    validatePullRequest({ title: "Bump actions/checkout", body: "", author: "dependabot[bot]" }),
    [],
  );
});

test("reads pull-request fields from a GitHub event", () => {
  assert.deepEqual(
    pullRequestFromEvent({
      pull_request: {
        title: "fix(cli): preserve output paths",
        body: completeBody,
        draft: false,
        user: { login: "contributor" },
      },
    }),
    {
      title: "fix(cli): preserve output paths",
      body: completeBody,
      draft: false,
      author: "contributor",
    },
  );
});

test("rejects non-pull-request event payloads", () => {
  assert.throws(() => pullRequestFromEvent({}), /does not contain a pull_request/);
});
