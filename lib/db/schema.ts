import {
  boolean,
  check,
  integer,
  index,
  jsonb,
  pgSequence,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const transactionNumberSeq = pgSequence('transaction_number_seq', {
  startWith: 1043,
})

export const servicePackages = pgTable('service_packages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  vehicle: text('vehicle').notNull(),
  duration: text('duration').notNull(),
  features: jsonb('features').$type<string[]>().notNull().default([]),
  popular: boolean('popular').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  check('service_packages_vehicle_check', sql`${table.vehicle} in ('Motor', 'Mobil')`),
])

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('staff'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  check('users_role_check', sql`${table.role} in ('admin', 'staff')`),
])

export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  customer: text('customer').notNull(),
  phone: text('phone').notNull(),
  vehicle: text('vehicle').notNull(),
  plate: text('plate').notNull(),
  packageId: text('package_id')
    .notNull()
    .references(() => servicePackages.id),
  packageName: text('package_name').notNull(),
  price: integer('price').notNull(),
  status: text('status').notNull().default('Diproses'),
  payment: text('payment').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
}, (table) => [
  index('transactions_created_at_idx').on(table.createdAt),
  index('transactions_status_idx').on(table.status),
  index('transactions_plate_idx').on(table.plate),
  check('transactions_vehicle_check', sql`${table.vehicle} in ('Motor', 'Mobil')`),
  check(
    'transactions_status_check',
    sql`${table.status} in ('Diproses', 'Selesai', 'Batal')`,
  ),
  check(
    'transactions_payment_check',
    sql`${table.payment} in ('Tunai', 'QRIS', 'Transfer Bank', 'E-Wallet')`,
  ),
])

export type DbTransaction = typeof transactions.$inferSelect