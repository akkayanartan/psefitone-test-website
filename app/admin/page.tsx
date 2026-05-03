import Link from 'next/link';
import { getCurrentMonthAggregate, getPaymentBreakdowns, listExpenses } from '@/lib/admin/queries';
import { formatTL, formatYearMonthTR, formatDateTR } from '@/lib/admin/format';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Genel Bakış | Psefitone Yönetim',
};

export default async function AdminDashboard() {
  const [agg, payments, allExpenses] = await Promise.all([
    getCurrentMonthAggregate(),
    getPaymentBreakdowns(),
    listExpenses(),
  ]);

  const recentPayments = payments.slice(0, 5);
  const recentExpenses = allExpenses.slice(0, 5);

  const isNegativeProfit = (value: number) => value < 0 ? 'text-red-400' : '';

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="font-[var(--font-display)] text-4xl text-[var(--brand-primary)]">
          Genel Bakış
        </h1>
        <p className="mt-2 text-sm text-[var(--brand-muted)]">
          {formatYearMonthTR(agg.yearMonth)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-[var(--brand-dark2)]/60 border-[var(--brand-border)] py-6">
          <CardHeader className="px-6">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-[var(--brand-muted)]">Brüt Gelir</CardTitle>
          </CardHeader>
          <CardContent className="px-6 space-y-2">
            <div className="text-3xl font-medium text-[var(--brand-text)]">
              {formatTL(agg.grossKurus)}
            </div>
            <p className="text-xs text-[var(--brand-muted)]">
              {agg.paymentsCount} ödeme
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--brand-dark2)]/60 border-[var(--brand-border)] py-6">
          <CardHeader className="px-6">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-[var(--brand-muted)]">Net Gelir</CardTitle>
          </CardHeader>
          <CardContent className="px-6 space-y-2">
            <div className="text-3xl font-medium text-[var(--brand-text)]">
              {formatTL(agg.netRevenueKurus)}
            </div>
            <p className="text-xs text-[var(--brand-muted)]">
              Komisyon + stopaj sonrası
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--brand-dark2)]/60 border-[var(--brand-border)] py-6">
          <CardHeader className="px-6">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-[var(--brand-muted)]">Nakit Kâr</CardTitle>
          </CardHeader>
          <CardContent className="px-6 space-y-2">
            <div className={`text-3xl font-medium ${isNegativeProfit(agg.cashProfitKurus)}`}>
              {formatTL(agg.cashProfitKurus)}
            </div>
            <p className="text-xs text-[var(--brand-muted)]">
              Ödenmiş giderler düşülerek
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[var(--brand-dark2)]/60 border-[var(--brand-border)] py-6">
          <CardHeader className="px-6">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-[var(--brand-muted)]">Tahakkuk Kârı</CardTitle>
          </CardHeader>
          <CardContent className="px-6 space-y-2">
            <div className={`text-3xl font-medium ${isNegativeProfit(agg.accrualProfitKurus)}`}>
              {formatTL(agg.accrualProfitKurus)}
            </div>
            <p className="text-xs text-[var(--brand-muted)]">
              Bekleyen giderler dahil
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center gap-4">
        <Link
          href="/admin/payments"
          className="inline-flex items-center rounded-md px-5 py-2.5 text-sm font-medium bg-[var(--brand-secondary)] text-white hover:bg-[var(--brand-secondary)]/90 shadow-[0_0_24px_var(--sec-25)]"
        >
          Ödeme Ekle
        </Link>
        <Link
          href="/admin/expenses"
          className="inline-flex items-center rounded-md px-5 py-2.5 text-sm font-medium border border-[var(--brand-border)] text-[var(--brand-text)] hover:bg-[var(--sec-8)]"
        >
          Gider Ekle
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[var(--brand-dark2)]/60 border-[var(--brand-border)] py-6">
          <CardHeader className="px-6">
            <CardTitle className="text-base">Son Ödemeler</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            {recentPayments.length === 0 ? (
              <p className="italic text-[var(--brand-muted)]">Henüz ödeme yok.</p>
            ) : (
              <div className="divide-y divide-[var(--brand-border)]">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-[var(--brand-muted)]">
                        {formatDateTR(payment.occurredAt)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          payment.source === 'wire'
                            ? 'bg-[var(--acc-12)] text-[var(--brand-accent)]'
                            : 'bg-[var(--sec-15)] text-[var(--brand-primary)]'
                        }`}
                      >
                        {payment.source === 'wire' ? 'Havale' : 'Kredi Kartı'}
                      </span>
                      <span className="font-medium text-[var(--brand-text)]">
                        {formatTL(payment.netKurus)}
                      </span>
                    </div>
                    {payment.studentName && (
                      <p className="text-xs text-[var(--brand-muted)]">
                        {payment.studentName}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-5 pt-4 border-t border-[var(--brand-border)]">
              <Link
                href="/admin/payments"
                className="text-xs font-medium text-[var(--brand-primary)] hover:underline"
              >
                Tümünü gör →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[var(--brand-dark2)]/60 border-[var(--brand-border)] py-6">
          <CardHeader className="px-6">
            <CardTitle className="text-base">Son Giderler</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            {recentExpenses.length === 0 ? (
              <p className="italic text-[var(--brand-muted)]">Henüz gider yok.</p>
            ) : (
              <div className="divide-y divide-[var(--brand-border)]">
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-[var(--brand-muted)]">
                        {formatDateTR(expense.occurredAt)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          expense.status === 'paid'
                            ? 'bg-[var(--acc-12)] text-[var(--brand-accent)]'
                            : 'bg-amber-300/10 text-amber-300'
                        }`}
                      >
                        {expense.status === 'paid' ? 'Ödendi' : 'Beklemede'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-[var(--brand-text)]">
                        {expense.category}
                      </span>
                      <span className="font-medium text-[var(--brand-text)]">
                        {formatTL(expense.amountKurus)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-5 pt-4 border-t border-[var(--brand-border)]">
              <Link
                href="/admin/expenses"
                className="text-xs font-medium text-[var(--brand-primary)] hover:underline"
              >
                Tümünü gör →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[var(--brand-dark2)]/60 border-[var(--brand-border)] py-6">
        <CardHeader className="px-6">
          <CardTitle className="text-base">Bu Ayın Detayı</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-[var(--brand-border)]/50 pb-2">
              <dt className="text-[var(--brand-muted)]">Brüt</dt>
              <dd className="font-medium">{formatTL(agg.grossKurus)}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-[var(--brand-border)]/50 pb-2">
              <dt className="text-[var(--brand-muted)]">Komisyon</dt>
              <dd className="font-medium">{formatTL(agg.commissionKurus)}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-[var(--brand-border)]/50 pb-2">
              <dt className="text-[var(--brand-muted)]">Stopaj (%15)</dt>
              <dd className="font-medium">{formatTL(agg.withheldKurus)}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-[var(--brand-border)]/50 pb-2">
              <dt className="text-[var(--brand-muted)]">Net Gelir</dt>
              <dd className="font-medium">{formatTL(agg.netRevenueKurus)}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-[var(--brand-border)]/50 pb-2">
              <dt className="text-[var(--brand-muted)]">Ödenmiş Giderler</dt>
              <dd className="font-medium">{formatTL(agg.paidExpensesKurus)}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-[var(--brand-border)]/50 pb-2">
              <dt className="text-[var(--brand-muted)]">Bekleyen Giderler</dt>
              <dd className="font-medium text-amber-300">{formatTL(agg.deferredExpensesKurus)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[var(--brand-muted)]">Nakit Kâr</dt>
              <dd className={`font-medium ${isNegativeProfit(agg.cashProfitKurus)}`}>
                {formatTL(agg.cashProfitKurus)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[var(--brand-muted)]">Tahakkuk Kârı</dt>
              <dd className={`font-medium ${isNegativeProfit(agg.accrualProfitKurus)}`}>
                {formatTL(agg.accrualProfitKurus)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
