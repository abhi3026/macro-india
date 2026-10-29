# AGENTS.md

- App-hosted MCP server lives in `src/lib/mcp/` (one tool per file, registered in `index.ts`); the SDK generates `supabase/functions/mcp/index.ts` — never hand-edit that generated file. After any MCP edit, re-run `bunx lovable-mcp-extract-manifest`, and republish before external clients see the new revision.
- MCP tools are read-only and caller-scoped: every tool uses `supabaseForUser(ctx)` with the verified OAuth token, never the anon client or service role. OAuth issuer must be the direct `https://<project-ref>.supabase.co/auth/v1`, with `requireOAuthClientClaim: true` inside `auth.oauth.issuer(...)`.
- The OAuth consent route is `/.lovable/oauth/consent` (`src/pages/OAuthConsent.tsx`); every sign-in path (password, signup, password reset) must preserve the consent URL through the validated `next` param (`src/lib/oauth-return-path.ts`).
- Browser-local WebMCP tools (`use-webmcp-tool` + `runWebMCPTool` telemetry) are registered only in the components that own the visible controls (ResearchPage, MacroSummary); they never replace or wrap the remote MCP server.
