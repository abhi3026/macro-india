## Problem

The published site (`macro-india-insights.lovable.app`) is fully blank. Browser console on the live site shows:

```
Uncaught Error: supabaseUrl is required.
```

The live preview renders fine because Vite injects env vars at dev time. The production build does not have access to `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`, so `createClient(undefined, undefined)` throws at module load — React never mounts, hence the white screen.

Root cause: `.gitignore` contains `.env`, so the managed `.env` file is excluded from the build. This is a classic-Vite-stack issue (the Supabase client reads `import.meta.env.VITE_SUPABASE_*` at build time).

## Fix

1. Remove the `.env` line from `.gitignore` so the auto-generated env file is included in builds.
2. Republish the project (Publish → Update) so a new production bundle is built with the env vars baked in.

That's the entire change — no app code touched.

## Technical details

- File to edit: `.gitignore` — delete the line `.env` (under the `# Environment` comment).
- `.env` is auto-managed by the Lovable Cloud integration; it contains `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`. It must be present on disk during `vite build`.
- After the edit, click **Publish → Update** to redeploy. The preview is unaffected (already working).

No database, schema, or feature changes are required.
