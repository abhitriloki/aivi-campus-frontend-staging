# AI Prompt Structure

AIVI prompt templates live in Firebase Cloud Functions at `functions/src/index.ts`.

The primary prompt map is `SYSTEM_PROMPTS`, which supports:

- `resume`
- `job_fit`
- `roadmap`
- `interview`
- `promotion`
- `portfolio`
- `resume_rebuild`
- `linkedin_analyze`
- `linkedin_optimize`

## Execution Flow

```text
Frontend feature page
  -> Firebase callable function
  -> Request validation
  -> Auth, quota, rate-limit, and budget checks
  -> Gemini prompt execution
  -> JSON parsing and Firestore persistence
```

## Editing Prompts

1. Edit the relevant prompt in `functions/src/index.ts`.
2. Keep outputs strict JSON unless the frontend explicitly expects prose.
3. Run `npm --prefix functions run build`.
4. Test the affected feature from the UI or emulator.

## Guardrails

- Do not include user secrets in prompts.
- Keep model calls server-side.
- Wrap or label user-controlled content so it cannot override system instructions.
- Validate payload size before sending content to the model.
