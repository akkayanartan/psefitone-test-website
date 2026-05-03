'use client';

/**
 * SyncEditor — admin-only inline editor for the lesson trim/offset/BPM hooks.
 *
 * # What this component does
 *
 * Renders a brand-styled card below the cockpit body with three numeric
 * inputs (trim start, trim end, offset) plus an optional original BPM. Two
 * "Şu Anki Konumu Al" buttons read `videoElRef.current.currentTime` and
 * stamp it into the corresponding trim field. A Save button persists the
 * values via PUT `/api/admin/sync/[lessonId]`.
 *
 * # Live preview
 *
 * Every input change calls `onSyncChange(partial)`, which mutates the
 * cockpit's local trim/offset state immediately. The video pane re-renders
 * with the new values, so the instructor can A/B alignment without saving.
 * Save is independent of preview — it just writes the current values to
 * SQLite for the public read API and the manual-copy fallback workflow.
 *
 * # Initial fetch
 *
 * On mount we GET `/api/admin/sync/[lessonId]` to populate the form with
 * any persisted values. 404 → use the lesson defaults already in
 * `initialSync`. Other status → surface an inline error message.
 */

import { useCallback, useEffect, useState } from 'react';
import type { LessonPlayerRecord } from '@/lib/player/lesson';

type SyncValues = {
    videoTrimStart: number;
    videoTrimEnd: number | null;
    videoOffset: number;
    originalBpm: number | null;
};

interface SyncEditorProps {
    lesson: LessonPlayerRecord;
    videoElRef: React.RefObject<HTMLVideoElement | null>;
    initialSync: SyncValues;
    onSyncChange: (partial: Partial<SyncValues>) => void;
}

/** Format a numeric value to 3 decimal places, returning a string for the
 *  input's `value` prop. Empty string for null/undefined so the input
 *  shows blank. */
function fmt(n: number | null | undefined): string {
    if (n === null || n === undefined || Number.isNaN(n)) return '';
    return n.toFixed(3);
}

/** Parse a string to a number, returning null for empty/blank input.
 *  NaN coerces to null too — input mid-edit ("12.") yields NaN, treat as
 *  the field's "no value yet" state. */
function parseNumOrNull(v: string): number | null {
    const trimmed = v.trim();
    if (trimmed === '') return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
}

export default function SyncEditor({
    lesson,
    videoElRef,
    initialSync,
    onSyncChange,
}: SyncEditorProps) {
    // Local form state — mirrors the cockpit's lifted state but as raw
    // strings so half-typed values ("12.") don't get clobbered each render.
    const [trimStart, setTrimStart] = useState<string>(fmt(initialSync.videoTrimStart));
    const [trimEnd, setTrimEnd] = useState<string>(fmt(initialSync.videoTrimEnd));
    const [offset, setOffset] = useState<string>(fmt(initialSync.videoOffset));
    const [bpm, setBpm] = useState<string>(
        initialSync.originalBpm == null ? '' : String(initialSync.originalBpm),
    );

    type Status =
        | { kind: 'idle' }
        | { kind: 'loading' }
        | { kind: 'saving' }
        | { kind: 'saved' }
        | { kind: 'error'; message: string };
    const [status, setStatus] = useState<Status>({ kind: 'loading' });

    // Initial fetch — populate from SQLite if a record exists. 404 means
    // first-time editing; keep the lesson defaults already in initialSync.
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(
                    `/api/admin/sync/${encodeURIComponent(lesson.id)}`,
                    { cache: 'no-store' },
                );
                if (cancelled) return;
                if (res.status === 404) {
                    setStatus({ kind: 'idle' });
                    return;
                }
                if (!res.ok) {
                    setStatus({
                        kind: 'error',
                        message: `Yükleme hatası (HTTP ${res.status})`,
                    });
                    return;
                }
                const data = (await res.json()) as SyncValues & {
                    lessonId: string;
                };
                if (cancelled) return;
                setTrimStart(fmt(data.videoTrimStart));
                setTrimEnd(fmt(data.videoTrimEnd));
                setOffset(fmt(data.videoOffset));
                setBpm(data.originalBpm == null ? '' : String(data.originalBpm));
                onSyncChange({
                    videoTrimStart: data.videoTrimStart,
                    videoTrimEnd: data.videoTrimEnd,
                    videoOffset: data.videoOffset,
                    originalBpm: data.originalBpm,
                });
                setStatus({ kind: 'idle' });
            } catch (err) {
                if (cancelled) return;
                setStatus({
                    kind: 'error',
                    message: err instanceof Error ? err.message : 'Bilinmeyen hata',
                });
            }
        })();
        return () => {
            cancelled = true;
        };
        // Intentional: only re-run when the lesson changes. onSyncChange is
        // a stable useCallback in the parent.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lesson.id]);

    // Field change handlers. Update the local string state AND propagate
    // to the cockpit via onSyncChange so live preview tracks every keystroke
    // (no debounce — single instructor at the keyboard, native input
    // throttling is fine).
    const onTrimStartChange = useCallback(
        (v: string) => {
            setTrimStart(v);
            const n = parseNumOrNull(v);
            if (n !== null && n >= 0) {
                onSyncChange({ videoTrimStart: n });
            }
        },
        [onSyncChange],
    );
    const onTrimEndChange = useCallback(
        (v: string) => {
            setTrimEnd(v);
            const n = parseNumOrNull(v);
            if (v.trim() === '') {
                onSyncChange({ videoTrimEnd: null });
            } else if (n !== null && n >= 0) {
                onSyncChange({ videoTrimEnd: n });
            }
        },
        [onSyncChange],
    );
    const onOffsetChange = useCallback(
        (v: string) => {
            setOffset(v);
            const n = parseNumOrNull(v);
            if (n !== null) {
                onSyncChange({ videoOffset: n });
            }
        },
        [onSyncChange],
    );
    const onBpmChange = useCallback(
        (v: string) => {
            setBpm(v);
            const n = parseNumOrNull(v);
            if (v.trim() === '') {
                onSyncChange({ originalBpm: null });
            } else if (n !== null && n >= 20 && n <= 400) {
                onSyncChange({ originalBpm: n });
            }
        },
        [onSyncChange],
    );

    // "Şu Anki Konumu Al" — write the live currentTime into the field.
    const captureCurrentToStart = useCallback(() => {
        const t = videoElRef.current?.currentTime;
        if (t == null || !Number.isFinite(t)) return;
        const formatted = t.toFixed(3);
        setTrimStart(formatted);
        onSyncChange({ videoTrimStart: Number(formatted) });
    }, [videoElRef, onSyncChange]);
    const captureCurrentToEnd = useCallback(() => {
        const t = videoElRef.current?.currentTime;
        if (t == null || !Number.isFinite(t)) return;
        const formatted = t.toFixed(3);
        setTrimEnd(formatted);
        onSyncChange({ videoTrimEnd: Number(formatted) });
    }, [videoElRef, onSyncChange]);

    // Save → PUT the record. The route logs the saved row to the dev
    // console; the instructor copies it into the fallback file before
    // committing.
    const onSave = useCallback(async () => {
        const tsNum = parseNumOrNull(trimStart);
        const teNum = parseNumOrNull(trimEnd);
        const offNum = parseNumOrNull(offset);
        const bpmNum = parseNumOrNull(bpm);
        const body = {
            videoTrimStart: tsNum ?? 0,
            videoTrimEnd: trimEnd.trim() === '' ? null : teNum,
            videoOffset: offNum ?? 0,
            originalBpm: bpm.trim() === '' ? null : bpmNum,
        };
        setStatus({ kind: 'saving' });
        try {
            const res = await fetch(
                `/api/admin/sync/${encodeURIComponent(lesson.id)}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                },
            );
            if (!res.ok) {
                const txt = await res.text().catch(() => '');
                setStatus({
                    kind: 'error',
                    message: `Kaydetme hatası (HTTP ${res.status}) ${txt}`,
                });
                return;
            }
            setStatus({ kind: 'saved' });
            // Auto-clear the saved banner after a couple seconds. Using a
            // straight setTimeout because we don't need to cancel — if the
            // user saves again, status flips to 'saving' immediately.
            window.setTimeout(() => {
                setStatus((cur) => (cur.kind === 'saved' ? { kind: 'idle' } : cur));
            }, 2200);
        } catch (err) {
            setStatus({
                kind: 'error',
                message: err instanceof Error ? err.message : 'Bilinmeyen hata',
            });
        }
    }, [lesson.id, trimStart, trimEnd, offset, bpm]);

    return (
        <section
            className="psef-sync-editor"
            aria-label="Senkron ayarları"
        >
            <header className="psef-sync-editor__header">
                <span className="psef-sync-editor__tag">ADMİN — SYNC</span>
                <h2 className="psef-sync-editor__title">
                    Sync <em>Ayarları</em>
                </h2>
            </header>

            <div className="psef-sync-editor__grid">
                <label className="psef-sync-editor__field">
                    <span className="psef-sync-editor__label">Trim Başlangıç (sn)</span>
                    <div className="psef-sync-editor__row">
                        <input
                            className="psef-sync-editor__input"
                            type="number"
                            inputMode="decimal"
                            step="0.001"
                            min="0"
                            value={trimStart}
                            onChange={(e) => onTrimStartChange(e.target.value)}
                        />
                        <button
                            type="button"
                            className="psef-sync-editor__btn psef-sync-editor__btn--secondary"
                            onClick={captureCurrentToStart}
                        >
                            Şu Anki Konumu Al
                        </button>
                    </div>
                </label>

                <label className="psef-sync-editor__field">
                    <span className="psef-sync-editor__label">Trim Bitiş (sn)</span>
                    <div className="psef-sync-editor__row">
                        <input
                            className="psef-sync-editor__input"
                            type="number"
                            inputMode="decimal"
                            step="0.001"
                            min="0"
                            value={trimEnd}
                            placeholder="(boş = video sonu)"
                            onChange={(e) => onTrimEndChange(e.target.value)}
                        />
                        <button
                            type="button"
                            className="psef-sync-editor__btn psef-sync-editor__btn--secondary"
                            onClick={captureCurrentToEnd}
                        >
                            Şu Anki Konumu Al
                        </button>
                    </div>
                </label>

                <label className="psef-sync-editor__field">
                    <span className="psef-sync-editor__label">Offset (sn)</span>
                    <input
                        className="psef-sync-editor__input"
                        type="number"
                        inputMode="decimal"
                        step="0.001"
                        value={offset}
                        onChange={(e) => onOffsetChange(e.target.value)}
                    />
                </label>

                <label className="psef-sync-editor__field">
                    <span className="psef-sync-editor__label">Orijinal BPM</span>
                    <input
                        className="psef-sync-editor__input"
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        min="20"
                        max="400"
                        value={bpm}
                        placeholder="(opsiyonel)"
                        onChange={(e) => onBpmChange(e.target.value)}
                    />
                </label>
            </div>

            <div className="psef-sync-editor__actions">
                <button
                    type="button"
                    className="psef-sync-editor__btn psef-sync-editor__btn--primary"
                    onClick={onSave}
                    disabled={status.kind === 'saving' || status.kind === 'loading'}
                >
                    {status.kind === 'saving' ? 'Kaydediliyor…' : 'Kaydet'}
                </button>
                {status.kind === 'loading' && (
                    <span className="psef-sync-editor__status">Yükleniyor…</span>
                )}
                {status.kind === 'saved' && (
                    <span
                        className="psef-sync-editor__status psef-sync-editor__status--ok"
                        role="status"
                    >
                        Kaydedildi
                    </span>
                )}
                {status.kind === 'error' && (
                    <span
                        className="psef-sync-editor__status psef-sync-editor__status--err"
                        role="alert"
                    >
                        Hata: {status.message}
                    </span>
                )}
            </div>
        </section>
    );
}
