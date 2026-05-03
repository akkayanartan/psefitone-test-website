'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatTL, formatDateTR, parseTLToKurus } from '@/lib/admin/format';

interface PaymentRecord {
  id: number;
  occurredAt: string;
  source: 'wire' | 'cc';
  grossKurus: number;
  studentName: string | null;
  note: string | null;
  createdAt: string;
  commissionKurus: number;
  withheldKurus: number;
  netKurus: number;
}

interface Props {
  initialRows: PaymentRecord[];
}

export function PaymentsManager({ initialRows }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rows, setRows] = useState<PaymentRecord[]>(initialRows);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [source, setSource] = useState<'wire' | 'cc'>('wire');
  const [gross, setGross] = useState('');
  const [studentName, setStudentName] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const computePreview = () => {
    try {
      const kurus = parseTLToKurus(gross);
      if (source === 'cc') {
        const commission = Math.round(kurus * 0.0467);
        const after = kurus - commission;
        const withheld = Math.round(after * 0.15);
        const net = after - withheld;
        return formatTL(net);
      }
      return formatTL(kurus);
    } catch {
      return null;
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const grossKurus = parseTLToKurus(gross);

      startTransition(async () => {
        const res = await fetch('/api/admin/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            occurredAt: date,
            source,
            grossKurus,
            studentName: studentName || null,
            note: note || null,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Ödeme eklenemedi');
          return;
        }

        setGross('');
        setStudentName('');
        setNote('');
        router.refresh();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tutar geçersiz');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu ödeme silinsin mi?')) return;

    startTransition(async () => {
      const res = await fetch(`/api/admin/payments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      }
    });
  };

  const preview = computePreview();

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="font-display text-4xl text-[var(--brand-primary)]">Ödemeler</h1>
        <p className="mt-2 text-sm text-[var(--brand-muted)]">
          Tüm gelen ödemeler ve hesaplanmış net tutarlar.
        </p>
      </div>

      <Card className="bg-[var(--brand-dark2)]/60 border-[var(--brand-border)] py-6">
        <CardHeader className="px-6">
          <CardTitle className="text-base">Yeni Ödeme</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <form onSubmit={handleAddPayment} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-[var(--brand-muted)]">Tarih</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-md border border-[var(--brand-border)] bg-[var(--brand-dark)]/60 px-3 py-2.5 text-sm text-[var(--brand-text)] outline-none focus:border-[var(--brand-secondary)] focus:ring-2 focus:ring-[var(--sec-25)]"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-[var(--brand-muted)]">Kaynak</span>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as 'wire' | 'cc')}
                  className="rounded-md border border-[var(--brand-border)] bg-[var(--brand-dark)]/60 px-3 py-2.5 text-sm text-[var(--brand-text)] outline-none focus:border-[var(--brand-secondary)] focus:ring-2 focus:ring-[var(--sec-25)]"
                >
                  <option value="wire">Havale (Wire)</option>
                  <option value="cc">Kredi Kartı (CC)</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-[var(--brand-muted)]">Tutar (TL)</span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={gross}
                  onChange={(e) => setGross(e.target.value)}
                  className="rounded-md border border-[var(--brand-border)] bg-[var(--brand-dark)]/60 px-3 py-2.5 text-sm text-[var(--brand-text)] outline-none focus:border-[var(--brand-secondary)] focus:ring-2 focus:ring-[var(--sec-25)]"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-[var(--brand-muted)]">Öğrenci</span>
                <input
                  type="text"
                  placeholder="Opsiyonel"
                  maxLength={120}
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="rounded-md border border-[var(--brand-border)] bg-[var(--brand-dark)]/60 px-3 py-2.5 text-sm text-[var(--brand-text)] outline-none focus:border-[var(--brand-secondary)] focus:ring-2 focus:ring-[var(--sec-25)]"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-[var(--brand-muted)]">Not</span>
                <input
                  type="text"
                  placeholder="Opsiyonel"
                  maxLength={500}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="rounded-md border border-[var(--brand-border)] bg-[var(--brand-dark)]/60 px-3 py-2.5 text-sm text-[var(--brand-text)] outline-none focus:border-[var(--brand-secondary)] focus:ring-2 focus:ring-[var(--sec-25)]"
                />
              </label>
            </div>

            {preview && (
              <div className="text-xs text-[var(--brand-muted)]">
                {source === 'cc'
                  ? `Tahmini net: ${preview}`
                  : `Havale: net = ${preview}`}
              </div>
            )}

            {error && <div className="text-sm text-red-400">{error}</div>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={pending}
                className="bg-[var(--brand-secondary)] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[var(--brand-secondary)]/90 disabled:opacity-60 shadow-[0_0_24px_var(--sec-25)]"
              >
                Ödeme Ekle
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-[var(--brand-dark2)]/60 border-[var(--brand-border)] py-6">
        <CardHeader className="px-6">
          <CardTitle className="text-base">Tüm Ödemeler ({rows.length})</CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-12 px-4">Tarih</TableHead>
                <TableHead className="h-12 px-4">Kaynak</TableHead>
                <TableHead className="h-12 px-4">Öğrenci</TableHead>
                <TableHead className="h-12 px-4 text-right">Brüt</TableHead>
                <TableHead className="h-12 px-4 text-right">Komisyon</TableHead>
                <TableHead className="h-12 px-4 text-right">Stopaj</TableHead>
                <TableHead className="h-12 px-4 text-right">Net</TableHead>
                <TableHead className="h-12 px-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-6 px-4 italic text-[var(--brand-muted)] text-center">
                    Henüz ödeme yok.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="py-3.5 px-4">{formatDateTR(row.occurredAt)}</TableCell>
                    <TableCell className="py-3.5 px-4">
                      {row.source === 'wire' ? (
                        <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs bg-[var(--acc-12)] text-[var(--brand-accent)]">
                          Havale
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs bg-[var(--sec-15)] text-[var(--brand-primary)]">
                          Kredi Kartı
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-3.5 px-4">{row.studentName || '—'}</TableCell>
                    <TableCell className="py-3.5 px-4 text-right">{formatTL(row.grossKurus)}</TableCell>
                    <TableCell className="py-3.5 px-4 text-right text-[var(--brand-muted)]">
                      {formatTL(row.commissionKurus)}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-right text-[var(--brand-muted)]">
                      {formatTL(row.withheldKurus)}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-right font-medium text-[var(--brand-text)]">
                      {formatTL(row.netKurus)}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(row.id)}
                        disabled={pending}
                        className="text-xs text-red-400 hover:underline disabled:opacity-60"
                      >
                        Sil
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
