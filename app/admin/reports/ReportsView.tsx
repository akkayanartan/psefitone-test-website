'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatTL, formatYearMonthTR } from '@/lib/admin/format';

interface MonthlyAggregate {
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

interface ReportsViewProps {
  year: number;
  aggregates: MonthlyAggregate[];
}

const MONTH_ABBR = [
  'Oca',
  'Şub',
  'Mar',
  'Nis',
  'May',
  'Haz',
  'Tem',
  'Ağu',
  'Eyl',
  'Eki',
  'Kas',
  'Ara',
];

export function ReportsView({ year, aggregates }: ReportsViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const currentYear = new Date().getFullYear();

  const totals = aggregates.reduce(
    (acc, agg) => ({
      grossKurus: acc.grossKurus + agg.grossKurus,
      netRevenueKurus: acc.netRevenueKurus + agg.netRevenueKurus,
      cashProfitKurus: acc.cashProfitKurus + agg.cashProfitKurus,
      accrualProfitKurus: acc.accrualProfitKurus + agg.accrualProfitKurus,
    }),
    { grossKurus: 0, netRevenueKurus: 0, cashProfitKurus: 0, accrualProfitKurus: 0 }
  );

  const chartData = aggregates.map((agg) => ({
    month: MONTH_ABBR[parseInt(agg.yearMonth.split('-')[1]) - 1],
    'Net Gelir': Math.round(agg.netRevenueKurus / 100),
    'Nakit Kâr': Math.round(agg.cashProfitKurus / 100),
  }));

  const handleYearChange = (newYear: number) => {
    startTransition(() => {
      router.push(`/admin/reports?year=${newYear}`);
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 text-center sm:text-left">
          <h1 className="font-display text-4xl font-medium text-[var(--brand-primary)]">Aylık Rapor</h1>
          <p className="mt-2 text-sm text-[var(--brand-muted)]">Yıllık özet ve aylık dağılım.</p>
        </div>
        <div className="flex items-center gap-3 rounded-md border border-[var(--brand-border)] bg-[var(--brand-dark2)]/60 px-2 py-1">
          <button
            onClick={() => handleYearChange(year - 1)}
            disabled={isPending}
            className="px-3 py-1.5 text-sm font-medium text-[var(--brand-primary)] hover:bg-[var(--sec-8)] rounded disabled:opacity-50"
          >
            ← Önceki
          </button>
          <span className="w-16 text-center text-lg font-medium">{year}</span>
          <button
            onClick={() => handleYearChange(year + 1)}
            disabled={isPending || year >= currentYear}
            className="px-3 py-1.5 text-sm font-medium text-[var(--brand-primary)] hover:bg-[var(--sec-8)] rounded disabled:opacity-50"
          >
            Sonraki →
          </button>
        </div>
      </div>

      <Card className="bg-[var(--brand-dark2)]/60 border-[var(--brand-border)] py-6">
        <CardHeader className="px-6">
          <CardTitle className="text-base">{year} Yılı Toplamı</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wide text-[var(--brand-muted)]">Brüt Gelir</div>
              <div className="text-2xl font-semibold">{formatTL(totals.grossKurus)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wide text-[var(--brand-muted)]">Net Gelir</div>
              <div className="text-2xl font-semibold">{formatTL(totals.netRevenueKurus)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wide text-[var(--brand-muted)]">Nakit Kâr</div>
              <div className="text-2xl font-semibold">{formatTL(totals.cashProfitKurus)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wide text-[var(--brand-muted)]">Tahakkuk Kârı</div>
              <div className="text-2xl font-semibold">
                {formatTL(totals.accrualProfitKurus)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[var(--brand-dark2)]/60 border-[var(--brand-border)] py-6">
        <CardHeader className="px-6">
          <CardTitle className="text-base">Aylık Net Gelir & Kâr</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value: number) => `${value} ₺`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                formatter={(value) => formatTL(Number(value) * 100)}
                labelStyle={{ color: '#ffffff' }}
              />
              <Legend wrapperStyle={{ paddingTop: '1rem' }} />
              <Bar dataKey="Net Gelir" fill="#8629ff" />
              <Bar dataKey="Nakit Kâr" fill="#e3e0aa" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-[var(--brand-dark2)]/60 border-[var(--brand-border)] py-6">
        <CardHeader className="px-6">
          <CardTitle className="text-base">Aylık Detay</CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-12 px-4">Ay</TableHead>
                <TableHead className="h-12 px-4 text-right">Brüt</TableHead>
                <TableHead className="h-12 px-4 text-right text-muted-foreground">Komisyon</TableHead>
                <TableHead className="h-12 px-4 text-right text-muted-foreground">Stopaj</TableHead>
                <TableHead className="h-12 px-4 text-right font-medium">Net Gelir</TableHead>
                <TableHead className="h-12 px-4 text-right text-muted-foreground">Ödenmiş</TableHead>
                <TableHead className="h-12 px-4 text-right text-amber-300">Bekleyen</TableHead>
                <TableHead className="h-12 px-4 text-right font-medium">Nakit Kâr</TableHead>
                <TableHead className="h-12 px-4 text-right font-medium">Tahakkuk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aggregates.map((agg) => (
                <TableRow key={agg.yearMonth}>
                  <TableCell className="py-3.5 px-4">{formatYearMonthTR(agg.yearMonth)}</TableCell>
                  <TableCell className="py-3.5 px-4 text-right">{formatTL(agg.grossKurus)}</TableCell>
                  <TableCell className="py-3.5 px-4 text-right text-muted-foreground">
                    {formatTL(agg.commissionKurus)}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-right text-muted-foreground">
                    {formatTL(agg.withheldKurus)}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-right font-medium">
                    {formatTL(agg.netRevenueKurus)}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-right text-muted-foreground">
                    {formatTL(agg.paidExpensesKurus)}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-right text-amber-300">
                    {formatTL(agg.deferredExpensesKurus)}
                  </TableCell>
                  <TableCell
                    className={`py-3.5 px-4 text-right font-medium ${agg.cashProfitKurus < 0 ? 'text-red-400' : ''}`}
                  >
                    {formatTL(agg.cashProfitKurus)}
                  </TableCell>
                  <TableCell
                    className={`py-3.5 px-4 text-right font-medium ${agg.accrualProfitKurus < 0 ? 'text-red-400' : ''}`}
                  >
                    {formatTL(agg.accrualProfitKurus)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="py-3.5 px-4 font-bold">Toplam</TableCell>
                <TableCell className="py-3.5 px-4 text-right font-bold">
                  {formatTL(totals.grossKurus)}
                </TableCell>
                <TableCell className="py-3.5 px-4 text-right text-muted-foreground font-bold">
                  {formatTL(
                    aggregates.reduce((sum, agg) => sum + agg.commissionKurus, 0)
                  )}
                </TableCell>
                <TableCell className="py-3.5 px-4 text-right text-muted-foreground font-bold">
                  {formatTL(
                    aggregates.reduce((sum, agg) => sum + agg.withheldKurus, 0)
                  )}
                </TableCell>
                <TableCell className="py-3.5 px-4 text-right font-bold">
                  {formatTL(totals.netRevenueKurus)}
                </TableCell>
                <TableCell className="py-3.5 px-4 text-right text-muted-foreground font-bold">
                  {formatTL(
                    aggregates.reduce((sum, agg) => sum + agg.paidExpensesKurus, 0)
                  )}
                </TableCell>
                <TableCell className="py-3.5 px-4 text-right text-amber-300 font-bold">
                  {formatTL(
                    aggregates.reduce((sum, agg) => sum + agg.deferredExpensesKurus, 0)
                  )}
                </TableCell>
                <TableCell className="py-3.5 px-4 text-right font-bold">
                  {formatTL(totals.cashProfitKurus)}
                </TableCell>
                <TableCell className="py-3.5 px-4 text-right font-bold">
                  {formatTL(totals.accrualProfitKurus)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
