import { getMonthlyAggregates } from '@/lib/admin/queries';
import { ReportsView } from './ReportsView';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Raporlar — Psefitone Yönetim' };

interface Props {
  searchParams: Promise<{ year?: string }>;
}

export default async function ReportsPage({ searchParams }: Props) {
  const params = await searchParams;
  const parsed = Number(params.year);
  const year =
    Number.isInteger(parsed) && parsed >= 2024 && parsed <= 2030
      ? parsed
      : new Date().getFullYear();

  const aggregates = await getMonthlyAggregates(year);

  return <ReportsView year={year} aggregates={aggregates} />;
}
