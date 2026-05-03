'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatTL, formatDateTR, parseTLToKurus } from '@/lib/admin/format';
import type { ExpenseRecord } from '@/lib/admin/schema';

interface ExpensesManagerProps {
  initialRows: ExpenseRecord[];
}

export function ExpensesManager({ initialRows }: ExpensesManagerProps) {
  const router = useRouter();
  const [rows, setRows] = useState<ExpenseRecord[]>(initialRows);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'paid' | 'deferred'>('deferred');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleQuickAdd = (preset: 'sigorta' | 'kira' | 'yazilim') => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
    if (preset === 'sigorta') {
      setCategory('Sigorta');
      setAmount('11.808');
      setStatus('deferred');
      setNote('');
    } else if (preset === 'kira') {
      setCategory('Kira');
      setAmount('');
      setStatus('paid');
      setNote('');
    } else if (preset === 'yazilim') {
      setCategory('Yazılım');
      setAmount('');
      setStatus('paid');
      setNote('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount.trim()) {
      setError('Tutar gerekli');
      return;
    }

    let kurus: number;
    try {
      kurus = parseTLToKurus(amount);
    } catch (err) {
      setError(`Geçersiz tutar: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            occurredAt: date,
            category,
            amountKurus: kurus,
            status,
            note: note || null,
          }),
        });

        if (res.status === 201) {
          const { expense } = await res.json();
          setRows([expense, ...rows]);
          setAmount('');
          setNote('');
          router.refresh();
        } else {
          const data = await res.json();
          setError(data.error || 'Gider eklenemedi');
        }
      } catch (err) {
        setError(`Hata: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Bu gideri silmek istiyor musunuz?')) return;

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/expenses/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setRows(rows.filter((r) => r.id !== id));
          router.refresh();
        } else {
          setError('Gider silinemedi');
        }
      } catch (err) {
        setError(`Hata: ${err instanceof Error ? err.message : 'Bilinmeyen hata'}`);
      }
    });
  };

  const totalPaid = rows
    .filter((r) => r.status === 'paid')
    .reduce((sum, r) => sum + r.amountKurus, 0);
  const totalDeferred = rows
    .filter((r) => r.status === 'deferred')
    .reduce((sum, r) => sum + r.amountKurus, 0);

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="font-display text-4xl text-[var(--brand-primary)]">Giderler</h1>
        <p className="mt-2 text-sm text-[var(--brand-muted)]">
          Ödenmiş ve bekleyen giderler. Aylık tahakkuk için bekleyen olarak ekleyin.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="text-sm font-medium text-[var(--brand-text)]">Hızlı ekle:</span>
        <button
          type="button"
          onClick={() => handleQuickAdd('sigorta')}
          className="rounded-md border border-[var(--brand-border)] bg-transparent px-3.5 py-2 text-xs text-[var(--brand-muted)] hover:bg-[var(--brand-dark)]/40 hover:text-[var(--brand-text)]"
        >
          Sigorta — 11.808 ₺
        </button>
        <button
          type="button"
          onClick={() => handleQuickAdd('kira')}
          className="rounded-md border border-[var(--brand-border)] bg-transparent px-3.5 py-2 text-xs text-[var(--brand-muted)] hover:bg-[var(--brand-dark)]/40 hover:text-[var(--brand-text)]"
        >
          Kira
        </button>
        <button
          type="button"
          onClick={() => handleQuickAdd('yazilim')}
          className="rounded-md border border-[var(--brand-border)] bg-transparent px-3.5 py-2 text-xs text-[var(--brand-muted)] hover:bg-[var(--brand-dark)]/40 hover:text-[var(--brand-text)]"
        >
          Yazılım
        </button>
      </div>

      <Card className="bg-[var(--brand-dark2)]/60 border-[var(--brand-border)] py-6">
        <CardHeader className="px-6">
          <CardTitle className="text-base">Yeni Gider</CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                <span className="text-xs font-medium text-[var(--brand-muted)]">Kategori</span>
                <input
                  type="text"
                  list="expense-categories"
                  placeholder="Sigorta, Kira…"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-md border border-[var(--brand-border)] bg-[var(--brand-dark)]/60 px-3 py-2.5 text-sm text-[var(--brand-text)] outline-none focus:border-[var(--brand-secondary)] focus:ring-2 focus:ring-[var(--sec-25)]"
                />
                <datalist id="expense-categories">
                  <option>Sigorta</option>
                  <option>Kira</option>
                  <option>Yazılım</option>
                  <option>Reklam</option>
                  <option>Hosting</option>
                  <option>Muhasebe</option>
                  <option>Vergi</option>
                  <option>Diğer</option>
                </datalist>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-[var(--brand-muted)]">Tutar (TL)</span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="rounded-md border border-[var(--brand-border)] bg-[var(--brand-dark)]/60 px-3 py-2.5 text-sm text-[var(--brand-text)] outline-none focus:border-[var(--brand-secondary)] focus:ring-2 focus:ring-[var(--sec-25)]"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-[var(--brand-muted)]">Durum</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'paid' | 'deferred')}
                  className="rounded-md border border-[var(--brand-border)] bg-[var(--brand-dark)]/60 px-3 py-2.5 text-sm text-[var(--brand-text)] outline-none focus:border-[var(--brand-secondary)] focus:ring-2 focus:ring-[var(--sec-25)]"
                >
                  <option value="deferred">Beklemede</option>
                  <option value="paid">Ödendi</option>
                </select>
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
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-[var(--brand-secondary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--brand-secondary)]/90 disabled:opacity-50 shadow-[0_0_24px_var(--sec-25)]"
              >
                {isPending ? 'Ekleniyor...' : 'Gider Ekle'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-[var(--brand-dark2)]/60 border-[var(--brand-border)] py-6">
        <CardHeader className="px-6 flex-row items-center justify-between">
          <CardTitle className="text-base">Tüm Giderler ({rows.length})</CardTitle>
          {rows.length > 0 && (
            <p className="text-xs text-[var(--brand-muted)]">
              Ödenmiş: <span className="text-[var(--brand-accent)] font-medium">{formatTL(totalPaid)}</span>
              <span className="mx-2">·</span>
              Beklemede: <span className="text-amber-300 font-medium">{formatTL(totalDeferred)}</span>
            </p>
          )}
        </CardHeader>
        <CardContent className="px-2 sm:px-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-12 px-4">Tarih</TableHead>
                <TableHead className="h-12 px-4">Kategori</TableHead>
                <TableHead className="h-12 px-4 text-right">Tutar</TableHead>
                <TableHead className="h-12 px-4">Durum</TableHead>
                <TableHead className="h-12 px-4">Not</TableHead>
                <TableHead className="h-12 px-4 text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 px-4 italic text-[var(--brand-muted)] text-center">
                    Henüz gider yok.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="py-3.5 px-4">{formatDateTR(row.occurredAt)}</TableCell>
                    <TableCell className="py-3.5 px-4">{row.category}</TableCell>
                    <TableCell className="py-3.5 px-4 text-right font-medium">{formatTL(row.amountKurus)}</TableCell>
                    <TableCell className="py-3.5 px-4">
                      <span
                        className={
                          row.status === 'paid'
                            ? 'inline-flex rounded-full bg-[var(--acc-12)] px-2.5 py-0.5 text-xs text-[var(--brand-accent)]'
                            : 'inline-flex rounded-full bg-amber-300/10 px-2.5 py-0.5 text-xs text-amber-300'
                        }
                      >
                        {row.status === 'paid' ? 'Ödendi' : 'Beklemede'}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-xs text-[var(--brand-muted)]">
                      {row.note ? row.note.substring(0, 50) : '—'}
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(row.id)}
                        disabled={isPending}
                        className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
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
