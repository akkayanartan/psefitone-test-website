import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  occurredAt: text('occurred_at').notNull(),
  source: text('source', { enum: ['wire', 'cc'] }).notNull(),
  grossKurus: integer('gross_kurus').notNull(),
  studentName: text('student_name'),
  note: text('note'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const expenses = sqliteTable('expenses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  occurredAt: text('occurred_at').notNull(),
  category: text('category').notNull(),
  amountKurus: integer('amount_kurus').notNull(),
  status: text('status', { enum: ['paid', 'deferred'] }).notNull(),
  note: text('note'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type PaymentRecord = typeof payments.$inferSelect;
export type ExpenseRecord = typeof expenses.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type NewExpense = typeof expenses.$inferInsert;

export const INIT_SQL = `
  CREATE TABLE IF NOT EXISTS payments (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    occurred_at   TEXT    NOT NULL,
    source        TEXT    NOT NULL CHECK (source IN ('wire','cc')),
    gross_kurus   INTEGER NOT NULL CHECK (gross_kurus >= 0),
    student_name  TEXT,
    note          TEXT,
    created_at    TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_payments_occurred_at ON payments(occurred_at);

  CREATE TABLE IF NOT EXISTS expenses (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    occurred_at   TEXT    NOT NULL,
    category      TEXT    NOT NULL,
    amount_kurus  INTEGER NOT NULL CHECK (amount_kurus >= 0),
    status        TEXT    NOT NULL CHECK (status IN ('paid','deferred')),
    note          TEXT,
    created_at    TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_expenses_occurred_at ON expenses(occurred_at);
`;
