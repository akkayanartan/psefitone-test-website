import { getPaymentBreakdowns } from '@/lib/admin/queries';
import { PaymentsManager } from './PaymentsManager';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Ödemeler — Psefitone Yönetim' };

export default async function PaymentsPage() {
  const rows = await getPaymentBreakdowns();
  return <PaymentsManager initialRows={rows} />;
}
