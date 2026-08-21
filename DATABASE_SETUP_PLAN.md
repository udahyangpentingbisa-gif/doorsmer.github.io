# PROJECT_NAME: Neon Database Setup Plan

> Status: planning only. This document does not execute SQL or change the live Neon database.

## Goal

Replace the browser-only transaction store with Neon PostgreSQL so bookings and admin updates are shared across devices and survive browser resets.

## Important Constraints

- The current app uses `localStorage` in `lib/store.tsx`.
- `next.config.mjs` currently sets `output: 'export'`. A static export cannot safely connect to Neon or expose server-side database credentials.
- The database URL must exist only in local/deployment environment variables. Never commit it, print it in logs, or place it in client components.
- The connection string shared during setup should be rotated in Neon before production use because it has been exposed outside the deployment environment.

## Recommended Stack

- Neon PostgreSQL
- `@neondatabase/serverless` for the database connection
- Drizzle ORM and Drizzle Kit for typed queries and migrations
- Next.js server route handlers or server actions for all database access
- A server-capable deployment target such as Vercel. GitHub Pages/static hosting is not sufficient for this architecture.

## Phase 1: Install and Configure

Run from the repository root:

```bash
pnpm add @neondatabase/serverless drizzle-orm
pnpm add -D drizzle-kit
```

Create `.env.local` locally and add the rotated Neon URL:

```dotenv
DATABASE_URL=postgresql://<user>:<password>@<neon-host>/<database>?sslmode=require
```

Add the same `DATABASE_URL` as an encrypted environment variable in the deployment provider. Do not use `NEXT_PUBLIC_DATABASE_URL`.

Add migration scripts to `package.json` after creating the Drizzle config:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:check": "drizzle-kit check"
  }
}
```

Create `drizzle.config.ts` with the project schema path and `DATABASE_URL` loaded from the environment. The config must fail clearly when `DATABASE_URL` is missing.

## Phase 2: Create the Initial Schema

Create `lib/db/schema.ts` with tables equivalent to the current types in `lib/data.ts`:

### `service_packages`

- `id` text primary key, for example `motor-kecil`
- `name` text not null
- `price` integer not null, stored in IDR with no fractional values
- `vehicle` text not null, constrained to `Motor` or `Mobil`
- `duration` text not null
- `features` JSONB not null, defaulting to an empty array
- `popular` boolean not null, defaulting to false
- `created_at` and `updated_at` timestamps

### `transactions`

- `id` text primary key, generated server-side with the existing `TRX-####` display format or a UUID-backed internal key
- `customer` text not null
- `phone` text not null
- `vehicle` text not null, constrained to `Motor` or `Mobil`
- `plate` text not null
- `package_id` text not null, foreign key to `service_packages.id`
- `package_name` text not null, retained as a historical snapshot
- `price` integer not null, retained as a historical snapshot
- `status` text not null, constrained to `Diproses`, `Selesai`, or `Batal`
- `payment` text not null, constrained to `Tunai`, `QRIS`, `Transfer Bank`, or `E-Wallet`
- `created_at` timestamp with timezone not null
- `updated_at` timestamp with timezone not null

Add indexes for `transactions.created_at`, `transactions.status`, and `transactions.plate`.

## Phase 3: Generate and Apply the Migration

1. Seed `service_packages` from `MOTOR_PACKAGES` and `MOBIL_PACKAGES` in `lib/data.ts`.
2. Decide explicitly whether the current `SEED_TRANSACTIONS` are demo-only. Do not import them into production automatically.
3. Generate the migration:

   ```bash
   pnpm db:generate
   ```

4. Review the generated SQL, especially constraints and timestamp defaults.
5. Apply it to the intended Neon branch:

   ```bash
   pnpm db:migrate
   ```

6. Run `pnpm db:check` and verify the tables and indexes in the Neon SQL Editor.

## Phase 4: Move Database Access Server-Side

Create a server-only database module, for example `lib/db/index.ts`, that constructs the Neon client from `process.env.DATABASE_URL`. Keep this module out of files containing `'use client'`.

Add server endpoints for:

- `GET /api/transactions`: list transactions for the admin dashboard and active queue
- `POST /api/transactions`: validate and create a booking transaction
- `PATCH /api/transactions/:id`: validate and update status
- `POST /api/transactions/reset`: protect this operation and require explicit admin authorization

Use the existing unions in `lib/data.ts` for validation, but validate request bodies at runtime as well. Return only the fields the public queue needs to avoid exposing unnecessary customer data.

Update `lib/store.tsx` to fetch initial data and call these endpoints instead of reading/writing `localStorage`. Preserve the 30-minute queue expiry rule, but enforce expiry in the query/API too so it cannot be bypassed by a client.

Use a database transaction or a sequence for generating booking numbers. The current module-level `counter` is not safe across server instances or concurrent bookings.

## Phase 5: Authentication and Deployment

- Replace the hard-coded admin credentials in `components/admin/admin-gate.tsx` before exposing database mutations.
- Use a real server-side session/auth provider and authorize every admin read/write endpoint on the server.
- Keep admin routes and customer-facing booking routes separate in authorization checks.
- Remove or disable the client-side reset operation until server authorization exists.
- Change `output: 'export'` to a server-capable Next.js deployment configuration.
- Confirm the GitHub Pages workflow is no longer used for the database-backed build, or split the static public site from a server API hosted elsewhere.

## Data Migration From Existing Browsers

The current transactions live separately in each browser. Before switching production users to Neon:

1. Export any important `bogelwash-transactions` localStorage data from the admin browser.
2. Normalize it against the new schema.
3. Import it once with a reviewed script, preserving original `created_at` values.
4. Record the import timestamp and source browser for auditability.
5. Remove the localStorage fallback after the server path is verified.

## Verification Checklist

- `DATABASE_URL` is absent from git history, client bundles, and logs.
- `pnpm db:check` passes.
- A public booking appears in Neon and is visible from a second browser.
- Two simultaneous bookings receive unique IDs.
- Admin status changes persist after refresh and on another device.
- Expired `Diproses` transactions are excluded server-side after 30 minutes.
- Invalid vehicle, payment, status, and package values are rejected.
- Unauthenticated users cannot list all transactions or mutate them.
- Production build succeeds on the chosen server-capable host.
- Existing static deployment is not used as the database API.

## Rollback

1. Keep the old localStorage read path behind a temporary feature flag during rollout.
2. Disable writes to the new API if errors occur, without dropping Neon tables.
3. Restore the previous deployment artifact.
4. Export affected Neon rows before retrying the migration.
5. Only revert a migration with a reviewed down migration; do not manually drop production tables.

## Suggested Execution Order

1. Rotate the exposed Neon credential.
2. Choose a server-capable deployment target.
3. Install Drizzle and Neon dependencies.
4. Add schema, config, and package seed migration.
5. Apply and verify the migration.
6. Add authenticated server endpoints.
7. Replace the localStorage store.
8. Migrate any required legacy browser data.
9. Run the verification checklist and deploy.