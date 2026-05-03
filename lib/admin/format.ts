/**
 * Turkish-locale TL formatting + tolerant input parsing.
 *
 * Storage is always integer kuruş; presentation is always TL with two decimals.
 * Input parser tolerates "1.234,56" (TR), "1234.56" (en), and "1234,56".
 */

const TL_FORMATTER = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatTL(kurus: number): string {
  if (!Number.isFinite(kurus)) return '—';
  const tl = kurus / 100;
  return `${TL_FORMATTER.format(tl)} ₺`;
}

export function parseTLToKurus(input: string): number {
  const trimmed = input.trim();
  if (!trimmed) throw new Error('Empty amount');

  const cleaned = trimmed
    .replace(/\s/g, '')
    .replace(/[₺TL]/gi, '')
    .replace(/\./g, '')
    .replace(',', '.');

  const tl = Number(cleaned);
  if (!Number.isFinite(tl) || tl < 0) {
    throw new Error(`Invalid amount: "${input}"`);
  }

  return Math.round(tl * 100);
}

export function formatPercent(rate: number): string {
  return `%${(rate * 100).toFixed(2).replace('.', ',')}`;
}

export function formatDateTR(isoDate: string): string {
  const [y, m, d] = isoDate.split('-');
  return `${d}.${m}.${y}`;
}

const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

export function formatYearMonthTR(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  const idx = Number(month) - 1;
  return `${TURKISH_MONTHS[idx] ?? month} ${year}`;
}
