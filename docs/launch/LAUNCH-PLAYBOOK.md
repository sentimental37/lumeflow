# LumeFlow launch playbook

## Product promise

LumeFlow turns portable, source-controlled JSON into polished architecture diagrams,
with a drag-and-drop builder and first-class rendering for React, Next.js, Angular,
and the web.

## Launch gates

Do not begin the broad launch until all gates are green:

- [ ] `npm run release:check` passes from a clean checkout.
- [ ] All five `@lumeflow/*` packages resolve from the public npm registry.
- [ ] The `v0.1.0` GitHub release is public and points to the correct commit.
- [ ] Showcase and builder load anonymously on desktop and mobile widths.
- [ ] Dark and light themes are visually checked.
- [ ] The smallest examples work in clean React, Next.js, and Angular consumers.
- [ ] Issues, Discussions, private vulnerability reporting, and community files are live.
- [ ] Social preview renders correctly when the GitHub and showcase URLs are shared.

## Rollout

### Circle 1 — soft launch

Invite 10–20 developers to complete one task without coaching: open the builder,
create and connect three components, export JSON, and render it in a web project.
Record where they hesitate. Fix installation and documentation friction before
optimizing announcement copy.

### Circle 2 — technical launch

1. Publish Show HN with the live builder as the first link.
2. Publish the framework-neutral technical article.
3. Share tailored React, Angular, and Next.js examples in the relevant communities.
4. Ask for feedback on one specific question, not for stars or upvotes.

### Circle 3 — product launch

Publish Product Hunt after npm and onboarding are stable. Submit the demo clip and
screenshots to JavaScript newsletters and curated open-source lists. Reuse technical
lessons, not identical promotional copy, on LinkedIn and X.

## Demonstration sequence

The 30–45 second launch clip should show:

1. Open the builder without signup.
2. Drag three components onto the canvas.
3. Connect them using the explicit **Connect to** control.
4. Switch between dark and light themes.
5. Export the portable JSON.
6. Render the same source inside React or Angular.

Keep the cursor movement deliberate, labels large enough for mobile playback, and
the final frame on the live demo and GitHub URLs.

Prepared launch assets:

- `docs/brand/lumeflow-social-preview.png` — 1280×640 social and Open Graph card
- `docs/brand/lumeflow-builder-demo.mp4` — 22-second HD product walkthrough
- `docs/brand/lumeflow-builder-demo.gif` — lightweight looping community preview

## Campaign links

Use one `utm_source` per channel and a shared launch campaign:

```text
https://sentimental37.github.io/lumeflow-showcase/?utm_source=show_hn&utm_medium=community&utm_campaign=lumeflow_v0_1
https://sentimental37.github.io/lumeflow-showcase/?utm_source=product_hunt&utm_medium=launch&utm_campaign=lumeflow_v0_1
https://sentimental37.github.io/lumeflow-showcase/?utm_source=linkedin&utm_medium=social&utm_campaign=lumeflow_v0_1
```

Track demo opens, builder opens, exports, GitHub visits, npm package downloads,
issues, Discussions, and confirmed external integrations. Stars are useful social
proof, but successful external diagrams are the adoption signal.

## Follow-through

- Answer every substantive launch question promptly.
- Convert repeated questions into documentation.
- Label small, well-scoped contributions as `good first issue`.
- Publish a one-week retrospective with feedback received and fixes shipped.
- Continue with one technical story per week instead of repeating the announcement.
