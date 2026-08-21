# Vercel Deployment

1. Import `udahyangpentingbisa-gif/doorsmer.github.io` in Vercel.
2. Keep the framework as **Next.js**. The repository includes `vercel.json` with the pnpm install and build commands.
3. Add these environment variables for Production, Preview, and Development:

```dotenv
DATABASE_URL=postgresql://<user>:<password>@<neon-host>/<database>?sslmode=require
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<strong-admin-password>
ADMIN_SESSION_SECRET=<long-random-secret>
```

4. Deploy the project.
5. Run the database setup locally once against the intended Neon database:

```bash
pnpm db migrate
pnpm db seed
```

6. Test the deployed home page, booking form, and `/admin` route.

GitHub Pages is not used for this app because its server API routes cannot run there. GitHub Actions remains a build check only; Vercel performs the deployment and hosts the Neon-backed API routes.