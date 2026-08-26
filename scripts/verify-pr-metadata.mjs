import fs from "node:fs";
import { pathToFileURL } from "node:url";

const TITLE_PATTERN = /^(feat|fix|docs|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9][a-z0-9./-]*\))?!?: \S.+$/;
const REQUIRED_SECTIONS = [
  "Related issue",
  "What changed",
  "Why",
  "Verification",
  "Compatibility and risk",
];

export function validatePullRequest({ title = "", body = "", draft = false, author = "" }) {
  if (author.endsWith("[bot]")) {
    return [];
  }

  const errors = [];
  const normalizedTitle = title.trim();

  if (!TITLE_PATTERN.test(normalizedTitle)) {
    errors.push(
      "Use a conventional PR title such as 'feat(core): add edge ports' or 'docs: add a Vue example'.",
    );
  }

  if (normalizedTitle.length > 100) {
    errors.push("Keep the PR title at or below 100 characters.");
  }

  if (draft) {
    return errors;
  }

  if (body.trim().length < 120) {
    errors.push("Complete the pull-request template with reviewable detail before marking it ready.");
  }

  for (const section of REQUIRED_SECTIONS) {
    const escapedSection = section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const heading = new RegExp(`^##\\s+${escapedSection}\\s*$`, "im");
    if (!heading.test(body)) {
      errors.push(`Add the required '## ${section}' section.`);
    }
  }

  return errors;
}

export function pullRequestFromEvent(event) {
  if (!event?.pull_request) {
    throw new Error("The GitHub event does not contain a pull_request payload.");
  }

  return {
    title: event.pull_request.title ?? "",
    body: event.pull_request.body ?? "",
    draft: Boolean(event.pull_request.draft),
    author: event.pull_request.user?.login ?? "",
  };
}

function run() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) {
    throw new Error("GITHUB_EVENT_PATH is required when running the PR metadata check.");
  }

  const event = JSON.parse(fs.readFileSync(eventPath, "utf8"));
  const pullRequest = pullRequestFromEvent(event);
  const errors = validatePullRequest(pullRequest);

  if (errors.length === 0) {
    console.log(pullRequest.draft ? "Draft PR metadata is valid." : "PR metadata is valid.");
    return;
  }

  for (const error of errors) {
    console.error(`::error::${error}`);
  }
  process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
