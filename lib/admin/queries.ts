import 'server-only';
import { desc } from 'drizzle-orm';
import { getDb } from './db';
import { expenses, payments, type ExpenseRecord, type PaymentRecord } from './schema';
import { aggregateMonth, computePayment, type MonthlyAggregate } from './finance';

export async function listPayments(): Promise<PaymentRecord[]> {
  const db = getDb();
  return db.select().from(payments).orderBy(desc(payments.occurredAt), desc(payments.id));
}

export async function listExpenses(): Promise<ExpenseRecord[]> {
  const db = getDb();
  return db.select().from(expenses).orderBy(desc(expenses.occurredAt), desc(expenses.id));
}

function toFinancePayment(row: PaymentRecord) {
  return {
    id: row.id,
    occurredAt: row.occurredAt,
    source: row.source,
    grossKurus: row.grossKurus,
  };
}

function toFinanceExpense(row: ExpenseRecord) {
  return {
    id: row.id,
    occurredAt: row.occurredAt,
    category: row.category,
    amountKurus: row.amountKurus,
    status: row.status,
  };
}

export async function getMonthlyAggregates(year: number): Promise<MonthlyAggregate[]> {
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new Error(`year out of range: ${year}`);
  }
  const [allPayments, allExpenses] = await Promise.all([listPayments(), listExpenses()]);
  const fp = allPayments.map(toFinancePayment);
  const fe = allExpenses.map(toFinanceExpense);

  const aggregates: MonthlyAggregate[] = [];
  for (let m = 1; m <= 12; m++) {
    const yearMonth = `${year}-${String(m).padStart(2, '0')}`;
    aggregates.push(aggregateMonth(yearMonth, fp, fe));
  }
  return aggregates;
}

export async function getPaymentBreakdowns(): Promise<
  Array<PaymentRecord & ReturnType<typeof computePayment>>
> {
  const rows = await listPayments();
  return rows.map((row) => ({ ...row, ...computePayment(toFinancePayment(row)) }));
}

export async function getCurrentMonthAggregate(): Promise<MonthlyAggregate> {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [allPayments, allExpenses] = await Promise.all([listPayments(), listExpenses()]);
  return aggregateMonth(
    yearMonth,
    allPayments.map(toFinancePayment),
    allExpenses.map(toFinanceExpense),
  );
}
