import { describe, expect, it } from 'vitest';
import {
  CC_COMMISSION_RATE,
  CC_WITHHOLDING_RATE,
  aggregateMonth,
  computePayment,
} from './finance';
import type { ExpenseRow, PaymentRow } from './finance';

const wire = (id: number, occurredAt: string, grossKurus: number): PaymentRow => ({
  id,
  occurredAt,
  source: 'wire',
  grossKurus,
});

const cc = (id: number, occurredAt: string, grossKurus: number): PaymentRow => ({
  id,
  occurredAt,
  source: 'cc',
  grossKurus,
});

const expense = (
  id: number,
  occurredAt: string,
  amountKurus: number,
  status: 'paid' | 'deferred',
  category = 'misc',
): ExpenseRow => ({ id, occurredAt, amountKurus, status, category });

describe('rate constants', () => {
  it('keeps the documented PayTR commission rate', () => {
    expect(CC_COMMISSION_RATE).toBe(0.0467);
  });

  it('keeps the documented withholding rate', () => {
    expect(CC_WITHHOLDING_RATE).toBe(0.15);
  });
});

describe('computePayment — wire transfer', () => {
  it('passes through gross with no fees', () => {
    expect(computePayment(wire(1, '2026-05-01', 500_000))).toEqual({
      grossKurus: 500_000,
      commissionKurus: 0,
      withheldKurus: 0,
      netKurus: 500_000,
    });
  });

  it('handles zero', () => {
    expect(computePayment(wire(2, '2026-05-01', 0))).toEqual({
      grossKurus: 0,
      commissionKurus: 0,
      withheldKurus: 0,
      netKurus: 0,
    });
  });
});

describe('computePayment — credit card', () => {
  it('reference example: 10,000 TL → net 8,103.05 TL', () => {
    // 1,000,000 kuruş gross
    // commission = round(1,000,000 × 0.0467) = 46,700
    // after = 953,300
    // withheld = round(953,300 × 0.15) = 142,995
    // net = 810,305 (= 8,103.05 TL)
    expect(computePayment(cc(10, '2026-05-01', 1_000_000))).toEqual({
      grossKurus: 1_000_000,
      commissionKurus: 46_700,
      withheldKurus: 142_995,
      netKurus: 810_305,
    });
  });

  it('100 TL CC: rounds withholding correctly (14.295 → 14.30)', () => {
    // 10,000 kuruş gross
    // commission = round(10,000 × 0.0467) = round(467) = 467
    // after = 9,533
    // withheld = round(9,533 × 0.15) = round(1,429.95) = 1,430
    // net = 8,103
    expect(computePayment(cc(11, '2026-05-01', 10_000))).toEqual({
      grossKurus: 10_000,
      commissionKurus: 467,
      withheldKurus: 1_430,
      netKurus: 8_103,
    });
  });

  it('1 TL CC edge: tiny commission rounds to integer', () => {
    // 100 kuruş gross
    // commission = round(100 × 0.0467) = round(4.67) = 5
    // after = 95
    // withheld = round(95 × 0.15) = round(14.25) = 14
    // net = 81
    expect(computePayment(cc(12, '2026-05-01', 100))).toEqual({
      grossKurus: 100,
      commissionKurus: 5,
      withheldKurus: 14,
      netKurus: 81,
    });
  });

  it('1 kuruş CC edge: no underflow, net = gross', () => {
    // commission = round(0.0467) = 0
    // after = 1
    // withheld = round(0.15) = 0
    // net = 1
    expect(computePayment(cc(13, '2026-05-01', 1))).toEqual({
      grossKurus: 1,
      commissionKurus: 0,
      withheldKurus: 0,
      netKurus: 1,
    });
  });

  it('0 TL CC: everything zero', () => {
    expect(computePayment(cc(14, '2026-05-01', 0))).toEqual({
      grossKurus: 0,
      commissionKurus: 0,
      withheldKurus: 0,
      netKurus: 0,
    });
  });

  it('always produces integer kuruş', () => {
    const samples = [1, 7, 13, 99, 137, 4321, 99_999, 1_234_567];
    for (const gross of samples) {
      const breakdown = computePayment(cc(99, '2026-05-01', gross));
      expect(Number.isInteger(breakdown.commissionKurus)).toBe(true);
      expect(Number.isInteger(breakdown.withheldKurus)).toBe(true);
      expect(Number.isInteger(breakdown.netKurus)).toBe(true);
      expect(breakdown.commissionKurus + breakdown.withheldKurus + breakdown.netKurus)
        .toBe(gross);
    }
  });

  it('rejects negative gross', () => {
    expect(() => computePayment(cc(15, '2026-05-01', -1))).toThrow();
  });

  it('rejects non-integer gross', () => {
    expect(() => computePayment(cc(16, '2026-05-01', 100.5))).toThrow();
  });
});

describe('aggregateMonth', () => {
  it('returns zeros for an empty month', () => {
    expect(aggregateMonth('2026-05', [], [])).toEqual({
      yearMonth: '2026-05',
      paymentsCount: 0,
      grossKurus: 0,
      commissionKurus: 0,
      withheldKurus: 0,
      netRevenueKurus: 0,
      paidExpensesKurus: 0,
      deferredExpensesKurus: 0,
      cashProfitKurus: 0,
      accrualProfitKurus: 0,
    });
  });

  it('sums one wire and one cc payment in the same month', () => {
    // Wire 5,000 TL = 500,000 kuruş → net 500,000
    // CC 10,000 TL = 1,000,000 → net 810,305
    // Total gross 1,500,000; commission 46,700; withheld 142,995; net 1,310,305
    const result = aggregateMonth(
      '2026-05',
      [wire(1, '2026-05-03', 500_000), cc(2, '2026-05-15', 1_000_000)],
      [],
    );
    expect(result).toMatchObject({
      paymentsCount: 2,
      grossKurus: 1_500_000,
      commissionKurus: 46_700,
      withheldKurus: 142_995,
      netRevenueKurus: 1_310_305,
      paidExpensesKurus: 0,
      deferredExpensesKurus: 0,
      cashProfitKurus: 1_310_305,
      accrualProfitKurus: 1_310_305,
    });
  });

  it('separates paid vs deferred expenses; cash and accrual profit diverge', () => {
    // Net revenue 1,310,305 from above
    // Paid expense 50,000; Deferred (insurance) 1,180,800
    // Cash profit = 1,310,305 - 50,000 = 1,260,305
    // Accrual profit = 1,310,305 - 50,000 - 1,180,800 = 79,505
    const result = aggregateMonth(
      '2026-05',
      [wire(1, '2026-05-03', 500_000), cc(2, '2026-05-15', 1_000_000)],
      [
        expense(10, '2026-05-10', 50_000, 'paid', 'software'),
        expense(11, '2026-05-31', 1_180_800, 'deferred', 'insurance'),
      ],
    );
    expect(result.paidExpensesKurus).toBe(50_000);
    expect(result.deferredExpensesKurus).toBe(1_180_800);
    expect(result.cashProfitKurus).toBe(1_260_305);
    expect(result.accrualProfitKurus).toBe(79_505);
  });

  it('ignores rows from other months', () => {
    const result = aggregateMonth(
      '2026-05',
      [
        wire(1, '2026-04-30', 999_999), // April — out
        wire(2, '2026-05-01', 100_000),
        wire(3, '2026-06-01', 999_999), // June — out
      ],
      [
        expense(10, '2026-05-15', 30_000, 'paid'),
        expense(11, '2026-04-15', 999_999, 'paid'), // out
      ],
    );
    expect(result.paymentsCount).toBe(1);
    expect(result.grossKurus).toBe(100_000);
    expect(result.netRevenueKurus).toBe(100_000);
    expect(result.paidExpensesKurus).toBe(30_000);
  });

  it('rejects malformed yearMonth', () => {
    expect(() => aggregateMonth('2026-5', [], [])).toThrow();
    expect(() => aggregateMonth('2026', [], [])).toThrow();
    expect(() => aggregateMonth('not-a-date', [], [])).toThrow();
  });
});
