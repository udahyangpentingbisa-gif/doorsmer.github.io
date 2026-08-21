CREATE SEQUENCE "public"."transaction_number_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1043 CACHE 1;--> statement-breakpoint
CREATE TABLE "service_packages" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"vehicle" text NOT NULL,
	"duration" text NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"popular" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "service_packages_vehicle_check" CHECK ("service_packages"."vehicle" in ('Motor', 'Mobil'))
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"customer" text NOT NULL,
	"phone" text NOT NULL,
	"vehicle" text NOT NULL,
	"plate" text NOT NULL,
	"package_id" text NOT NULL,
	"package_name" text NOT NULL,
	"price" integer NOT NULL,
	"status" text DEFAULT 'Diproses' NOT NULL,
	"payment" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_vehicle_check" CHECK ("transactions"."vehicle" in ('Motor', 'Mobil')),
	CONSTRAINT "transactions_status_check" CHECK ("transactions"."status" in ('Diproses', 'Selesai', 'Batal')),
	CONSTRAINT "transactions_payment_check" CHECK ("transactions"."payment" in ('Tunai', 'QRIS', 'Transfer Bank', 'E-Wallet'))
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_package_id_service_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."service_packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "transactions_created_at_idx" ON "transactions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "transactions_status_idx" ON "transactions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "transactions_plate_idx" ON "transactions" USING btree ("plate");