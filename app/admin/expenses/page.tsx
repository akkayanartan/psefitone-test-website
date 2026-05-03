import { listExpenses } from '@/lib/admin/queries';
import { ExpensesManager } from './ExpensesManager';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Giderler — Psefitone Yönetim' };

export default async function ExpensesPage() {
  const rows = await listExpenses();
  return <ExpensesManager initialRows={rows} />;
}
