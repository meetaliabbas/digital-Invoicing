# Database deployment notes

Apply `schema.sql` in staging first. Do not execute it against production until its table/policy changes are reviewed against the live database. Bootstrap tenant memberships through trusted admin access; there is intentionally no public self-enrollment into a tenant.
