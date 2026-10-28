# GitHub patch for meetaliabbas/digital-Invoicing

This ZIP is a merge patch, not a Git repository clone. Extract its contents into the ROOT of your existing `digital-Invoicing` repository, preserving folder paths. Review changes before committing.

## Included
- `src/pages/PlatformRedesign/TenantContext.jsx`: compatibility context module for the legacy React app. It is UI state only, not an authorization boundary.
- `web-app/`: Next.js App Router + Supabase app intended to be deployed as a separate Vercel root.
- `supabase/schema.sql`: database schema/migration source.
- `APPLY_TO_GITHUB.md` and `PRODUCTION_READINESS_REVIEW.md`: setup notes and known gaps.

## Required before Vercel can build the Next.js app
1. Ensure `web-app/package.json` exists in the GitHub main branch.
2. In `web-app/`, run `npm install` on a network-enabled machine and commit the generated `package-lock.json`. Dependency installation timed out in the authoring environment, so no lockfile is included.
3. Run `npm run lint`, `npm run typecheck`, and `npm run build` from `web-app/`; fix any failures before deployment.
4. Commit and push the patch to GitHub.
5. Keep Vercel project `fbr-digital-invoicing` configured with Root Directory `web-app`, Framework `Next.js`, Install `npm install`, Build `npm run build`.
6. Inspect the next Vercel Preview build logs. Do not promote to Production until the build and authentication/API tests pass.

## Important
- This package is not yet proven to compile: npm dependency installation could not complete in this environment.
- The FBR/PRAL submission adapter is not implemented. The invoice submission endpoint remains fail-closed.
- Test Supabase Row Level Security with two users and two tenants; a clean advisor result is not a substitute for end-to-end authorization tests.
- No GitHub commit or push has been performed by ChatGPT.
