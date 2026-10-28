# Static review and change log

## Uploaded artifacts reviewed

- `FBR_Integration-main.zip`: Frappe/ERPNext Python app. `pyproject.toml` identifies a Python package with `frappe` runtime dependencies and CLI integration; hooks register Sales Invoice/POS Invoice events and FBR API operations.
- `fbr-vercel-starter(1).zip`: legacy Vercel function scaffold. API handlers originally used ESM syntax in `.js` files without a guaranteed `"type": "module"` setting in the consuming app, which risks runtime/module-format mismatch. Original invoice API also returned raw database error details and accepted regex-shaped but impossible dates. Audit event inserts were client-authorized, allowing members to forge events.

## Changes in this bundle

- Ported invoice listing/creation and submit placeholder into Next.js App Router route handlers, compatible with the Next.js App Router foundation.
- Server-side authenticated Supabase client is used; RLS remains the source of tenant authorization.
- Added stricter date, quantity, unit-price, currency, item-count, body-size and finite-total validation.
- Removed database error detail leakage from API responses.
- Added role-aware tenant policies, a private-schema invoker membership-check function, and database-triggered append-only invoice audit events.
- Kept FBR submission fail-closed. The endpoint explicitly returns 503/501 until the official adapter exists.
- Preserved the Frappe app source as a separate component instead of attempting to run it on Vercel.

## Verification performed

- Archive structure inspected.
- Python source syntax compilation is run as part of the packaging checks; this does not import Frappe or prove runtime compatibility.
- Python source syntax compilation passed for the preserved Frappe app. Package JSON and key security invariants passed static checks.
- npm dependency resolution timed out in this environment; therefore ESLint, TypeScript checking, and Next.js production build could not run (dependencies are not installed), and no lockfile was generated.
- No live Supabase schema migration, Auth end-to-end test, Vercel deployment, ERPNext bench migration, or FBR sandbox submission was performed in this environment.

## Known remaining production work

- Merge/migrate the original CRA UI (not included in these uploads) into the Next.js app.
- Generate and commit a package lockfile in a network-enabled environment, then run lint, TypeScript checks, and a production build.
- Apply SQL in staging and test RLS using distinct roles/tenants; run Supabase security/performance advisors.
- Add server-side rate limiting (Vercel Firewall or a shared rate-limit store), monitoring, redaction, backups and operational runbooks.
- Implement and certify the official FBR/PRAL adapter and submission idempotency/queue/reconciliation behavior.


## Deployment status after this review

- Added explicit `zod` dependency and a `check` script to the Next.js package.
- Added baseline browser security headers in `next.config.ts`.
- Expanded the web-app README with Vercel and Supabase setup steps.
- No Vercel deployment was performed: no connected Vercel account or deployment token was available to this workspace.

## Re-assessment (2026-10-28)

- Found and corrected an invoice-date regex escaping bug in `web-app/src/app/api/invoices/route.ts`; date shape validation now correctly checks `YYYY-MM-DD`, and the existing ISO round-trip rejects impossible calendar dates.
- Static checks pass for package metadata, required API route files, date validation, and the fail-closed FBR submission behavior.
- The full Next.js build is still unverified because npm dependency resolution/network access is unavailable in this environment. `package-lock.json` is still missing and must be generated and committed in a network-enabled environment.
- The GitHub repository URL supplied during this review appears to contain the project as a ZIP file, not as extracted source at repository root. Vercel cannot treat a ZIP file as the Next.js app root. Extract and commit the contents so `web-app/package.json`, `web-app/src`, and `web-app/next.config.ts` exist in the Git tree, then configure Vercel Root Directory to `web-app`.
- The connected Vercel Git integration currently cannot see the target repository in its repository search. Grant the Vercel GitHub App access to the repository (or use a repository owned by the user with integration access) before importing it.
- Deployment is not production-ready until Supabase environment variables and redirect URLs are set, schema/RLS are tested in staging, auth and tenant isolation are tested, and official FBR/PRAL adapter implementation and sandbox acceptance are completed.


## Latest deployment diagnosis and compatibility patch (2026-10-28)

- Inspected the current Vercel deployment build log for `dpl_CE2pxiqpwZ6bsqox3omomxnzLhgh`. The actual failure is `Module not found: Can't resolve '../pages/PlatformRedesign/TenantContext' in '/vercel/path0/src/Routes'`. This deployment is building the legacy Create React App package (`react-scripts build`), not the Next.js app in this release.
- Added `src/pages/PlatformRedesign/TenantContext.jsx` as a compatibility patch, exporting `TenantContext`, `TenantProvider`, `useTenant`, `useTenantContext`, and a default context export. The current `src/Routes` file was not included in the supplied files, so the exact consumed property names cannot be verified; inspect the import/use sites and adjust if further compile errors surface. Context is UI state only and must not be used for authorization.
- Added a covering index for `invoice_events(tenant_id, invoice_id)` to both schema copies. Supabase performance advisor had identified that foreign key as lacking a covering index; the index was also applied to the live Supabase project. Security advisor returned no findings at inspection time.
- Vercel environment variables are configured on `fbr-digital-invoicing` for Development, Preview, and Production. Project framework is Next.js and the intended root directory is `web-app`; however, that folder must first be committed as actual files in the GitHub repository.
- The most recent known Vercel deployment remains `ERROR` on commit `0c597a3a66b94cc5da41b228e3cad060f0d24bed`, with the missing `TenantContext` import above. No new build can validate this compatibility patch until the patch is committed/pushed.
- The GitHub connector was not enabled in this session, so no GitHub commit or push was performed. `npm install` for the Next.js app timed out in the authoring environment, so no package lockfile or successful Next.js production build is claimed.

- A new Vercel preview build was explicitly retried from GitHub commit `0c597a3a66b94cc5da41b228e3cad060f0d24bed` as deployment `dpl_2C2jouV8titRzDc2GMyq3Aq2tGKd`. It ended in `ERROR` before dependency installation because the configured root directory `web-app` does not exist in that commit. This confirms that the Next.js folder has not yet been committed into the GitHub repository. Deployment URL: `fbr-digital-invoicing-czc3z0zhv-nextgee.vercel.app`; inspector: https://vercel.com/nextgee/fbr-digital-invoicing/2C2jouV8titRzDc2GMyq3Aq2tGKd.
