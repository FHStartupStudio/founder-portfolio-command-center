---
name: Portfolio assistant grounding
description: Trust boundary and interpretation policy for the read-only portfolio assistant.
---

Use deterministic retrieval and deterministic answers for recognized project, family, stage, gate, blocker, readiness, history, and safety queries. Reserve model interpretation for ambiguous language after relevant records have been selected, and pass only those records as untrusted data.

**Why:** A model-generated answer once misstated a deterministic result count, and weak keyword matching once attached an unrelated project to an unknown fact. The Google Sheet must remain authoritative.

**How to apply:** Add explicit retrieval rules and regression tests for supported recurring question forms. Unknown facts must return insufficient-information language, and write requests must be refused before any model call.