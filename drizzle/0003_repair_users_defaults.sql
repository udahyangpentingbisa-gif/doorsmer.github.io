ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "active" boolean DEFAULT true NOT NULL;
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();