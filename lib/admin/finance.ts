/**
 * Payment + expense math for the Psefitone admin module.
 *
 * Rates below are hard-coded constants, not env vars: they reflect Turkish tax
 * law and the PayTR commission contract, which should change only via a
 * deliberate code edit (and a fresh test run), never by config drift.
 *
 * - CC_COMMISSION_RATE — PayTR per-transaction commission (4.67%).
 * - CC_WITHHOLDING_RATE — income tax withheld at source on the post-commission
 *   amount (15%). This is what arrives in the bank.
 *
 * Wire transfers go to a personal account untouched: net = gross.
 */

export const CC_COMMISSION_RATE = 0.0467;
export const CC_WITHHOLDING_RATE = 0.15;

export type PaymentSource = 'wire' | 'cc';
export type ExpenseStatus = 'paid' | 'deferred';

export interface PaymentRow {
  id: number;
  occurredAt: string; // 'YYYY-MM-DD'
  source: PaymentSource;
  grossKurus: number;
}

export interface ExpenseRow {
  id: number;
  occurredAt: string;
  category: string;
  amountKurus: number;
  status: ExpenseStatus;
}

export interface PaymentBreakdown {
  grossKurus: number;
  commissionKurus: number;
  withheldKurus: number;
  netKurus: number;
}

export interface MonthlyAggregate {
  yearMonth: string;
  paymentsCount: number;
  grossKurus: number;
  commissionKurus: number;
  withheldKurus: number;
  netRevenueKurus: number;
  paidExpensesKurus: number;
  deferredExpensesKurus: number;
  cashProfitKurus: number;
  accrualProfitKurus: number;
}

export function computePayment(payment: PaymentRow): PaymentBreakdown {
  const gross = payment.grossKurus;
  if (!Number.isInteger(gross) || gross < 0) {
    throw new Error(`grossKurus must be a non-negative integer, got ${gross}`);
  }

  if (payment.source === 'wire') {
    return { grossKurus: gross, commissionKurus: 0, withheldKurus: 0, netKurus: gross };
  }

  const commissionKurus = Math.round(gross * CC_COMMISSION_RATE);
  const afterCommission = gross - commissionKurus;
  const withheldKurus = Math.round(afterCommission * CC_WITHHOLDING_RATE);
  const netKurus = afterCommission - withheldKurus;
  return { grossKurus: gross, commissionKurus, withheldKurus, netKurus };
}

const YEAR_MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export function aggregateMonth(
  yearMonth: string,
  payments: PaymentRow[],
  expenses: ExpenseRow[],
): MonthlyAggregate {
  if (!YEAR_MONTH_RE.test(yearMonth)) {
    throw new Error(`yearMonth must match YYYY-MM, got "${yearMonth}"`);
  }

  const inMonth = (occurredAt: string) => occurredAt.startsWith(`${yearMonth}-`);
  const monthPayments = payments.filter((p) => inMonth(p.occurredAt));
  const monthExpenses = expenses.filter((e) => inMonth(e.occurredAt));

  let grossKurus = 0;
  let commissionKurus = 0;
  let withheldKurus = 0;
  let netRevenueKurus = 0;

  for (const p of monthPayments) {
    const b = computePayment(p);
    grossKurus += b.grossKurus;
    commissionKurus += b.commissionKurus;
    withheldKurus += b.withheldKurus;
    netRevenueKurus += b.netKurus;
  }

  let paidExpensesKurus = 0;
  let deferredExpensesKurus = 0;
  for (const e of monthExpenses) {
    if (e.status === 'paid') paidExpensesKurus += e.amountKurus;
    else deferredExpensesKurus += e.amountKurus;
  }

  return {
    yearMonth,
    paymentsCount: monthPayments.length,
    grossKurus,
    commissionKurus,
    withheldKurus,
    netRevenueKurus,
    paidExpensesKurus,
    deferredExpensesKurus,
    cashProfitKurus: netRevenueKurus - paidExpensesKurus,
    accrualProfitKurus: netRevenueKurus - paidExpensesKurus - deferredExpensesKurus,
  };
}
