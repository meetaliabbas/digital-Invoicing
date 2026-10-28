# FBR Integration — hardening release bundle

This bundle contains **two distinct deployable components** and a web/API foundation. It is not a claim of FBR certification or successful live submission.

## Components

- `web-app/`: Next.js App Router + Supabase Auth foundation with invoice API routes and a fail-closed FBR submission endpoint. Deploy this app to Vercel.
- `erpnext-fbr-integration/`: the uploaded Frappe/ERPNext FBR integration source, preserved as a separate ERPNext app. Install it into a compatible Frappe bench; it is not deployable as a Next.js app.
- `supabase/schema.sql`: tenant-scoped schema/RLS/audit foundation. A copy is also in `web-app/supabase/schema.sql`.

## Important production blockers

1. The Next.js dashboard is an authentication foundation, not a migration of the original React invoice/buyer/report UI. That original CRA repository was not part of the uploaded files.
2. FBR submission is deliberately disabled/fail-closed. Do not set `FBR_SUBMISSION_ENABLED=true` expecting it to submit; the adapter is not implemented.
3. The ERPNext source needs a full business/tax code review, version compatibility checks, secret/credential handling review, test-site validation and official FBR sandbox acceptance. Static syntax checks are not certification.
4. Schema must be tested in a staging Supabase project first. It includes private invoker functions for membership checks and an append-only audit trigger; review any existing table/policy names before applying to a database with existing data.
5. Production must have SMTP/email verification, verified Auth redirect URLs, Vercel environment variables, backups/PITR appropriate to plan, monitoring, incident response, rate limiting and dependency lockfiles.

## Local web app

Requirements: Node.js 20.9+ and npm.

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to your project's publishable key.
npm install                 # generates package-lock.json
npm run check               # lint + TypeScript + production build
npm run dev
```

## Vercel deployment

1. Push this `web-app` directory to a Git repository, or set the Vercel project Root Directory to `web-app` in the combined release repository.
2. Import the repository into Vercel and select the Next.js framework preset. Build command: `npm run build`; install command: `npm install`.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel Project Settings → Environment Variables for Preview and Production. Do not add a Supabase service-role/secret key to browser-visible variables.
4. In Supabase Auth URL Configuration, add the deployed site's exact origin and `/auth/callback` redirect URL; configure email delivery before inviting users.
5. Deploy a Preview first, test sign-in, sign-out, password reset, invoice API authorization, tenant isolation and health endpoint, then promote to Production.
6. Do not enable real FBR submissions: the adapter is deliberately not implemented and the route returns a non-success response. Obtain the official integration contract and sandbox approval first.

This source has not been deployed to a Vercel account from this environment. A connected Vercel account and repository access are required to publish it directly.

Use the existing Supabase URL from `.env.example`. The publishable key is a public client key, not a secret. Never place a Supabase secret/service-role key in `NEXT_PUBLIC_*`.

## Supabase setup

1. Apply `supabase/schema.sql` in a **staging project first**.
2. Create an Auth user through the app.
3. As a trusted administrator, create a tenant and insert the matching `tenant_members` row with role `owner`. Never expose admin credentials in browser code.
4. In Supabase Auth URL Configuration, add exact local and deployed `/auth/callback` URLs.
5. Configure production SMTP and email templates.
6. Test that viewer role cannot create/update invoices, non-members cannot read/create invoices, and users cannot write audit events directly.

## FBR behavior

`POST /api/invoices` creates a draft only. `POST /api/invoices/:id/submit` returns a clear non-success response until an approved FBR/PRAL adapter is implemented. It must not be described to customers as submission or fiscalization.

Before implementation, confirm the current official FBR/PRAL integration contract, credentials, sandbox procedure, required fields, error/status semantics, invoice correction/cancellation rules and production onboarding. Then add idempotency keys, a database-backed submission lock/queue, timeout reconciliation, redacted audit logs and tested retry policy.

## Acceptance tests required before production

- [ ] `npm run lint`, `npm run typecheck`, `npm run build` pass
- [ ] Sign up, email verification, sign-in, sign-out and password recovery tested end-to-end
- [ ] Anonymous requests to protected pages and invoice APIs rejected
- [ ] Tenant isolation and role restrictions tested with two users and two tenants
- [ ] Invoice numbers are unique per tenant; invalid calendar dates and excessive amounts rejected
- [ ] Audit events cannot be inserted/updated/deleted by authenticated clients
- [ ] Submit endpoint never reports success while the adapter is missing
- [ ] FBR sandbox test cases accepted by FBR/PRAL and reconciled against ERPNext records
- [ ] Vercel Preview, logs/alerts, backup recovery and incident runbook checked


The `zod` runtime dependency is declared explicitly because the invoice API uses it for request validation. Generate and commit `package-lock.json` with `npm install` in a network-enabled development environment before production deployment; dependency resolution timed out in the authoring environment, so no lockfile is included in this release.
