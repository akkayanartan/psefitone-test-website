"use client";

/**
 * usePlayerLayout — state hook for the Psefitone Player Cockpit splitter layout.
 *
 * Holds {mode, splitPct, collapsed} and persists to localStorage at
 * `psf:player:layout:<storageKey>` (matches the existing `psf:` prefix convention
 * in `lib/lesson-storage.ts`). Writes are debounced 200 ms after any state change,
 * never during drag — SplitPane only calls setSplitPct() once on pointerup.
 *
 * Reads happen in a useEffect on mount (not during render) so initial SSR/CSR
 * paint is consistent with the defaults; the stored layout fades in once the
 * read completes. Safe to use inside `dynamic({ ssr: false })`.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export type LayoutMode = "side-by-side" | "stacked";
export type TransportMode = "video" | "synth";

export interface LayoutState {
  mode: LayoutMode;
  /** 0..100 — percentage of the FIRST child (left in horizontal, top in vertical). */
  splitPct: number;
  collapsed: "first" | "second" | null;
  /** Slice 2: which transport drives playback. `'video'` keeps the existing
   *  split-pane + video-master behavior; `'synth'` bypasses SplitPane and
   *  fills the cockpit body with the notation pane (AlphaTab synth-only). */
  transport: TransportMode;
}

export interface UsePlayerLayoutOptions {
  /** Suffix appended to `psf:player:layout:` to form the full storage key. */
  storageKey: string;
  /** Defaults to `'side-by-side'`. */
  defaultMode?: LayoutMode;
  /** Defaults to `50`. Clamped to [0, 100]. */
  defaultSplitPct?: number;
  /** Defaults to `'video'`. */
  defaultTransport?: TransportMode;
}

export interface UsePlayerLayoutReturn {
  state: LayoutState;
  setMode: (mode: LayoutMode) => void;
  setSplitPct: (pct: number) => void;
  setCollapsed: (collapsed: "first" | "second" | null) => void;
  setTransport: (transport: TransportMode) => void;
  /** Clears collapsed, resets splitPct to default, keeps current mode and transport. */
  reset: () => void;
}

const STORAGE_PREFIX = "psf:player:layout:";
/**
 * v1 → v2: added `transport: 'video' | 'synth'`. Any v1 entry is treated as
 * invalid by `readPersisted` (returns null) so the user falls back to the
 * default-transport for this version, with no silent partial-restore.
 */
const STORAGE_VERSION = 2;
const DEBOUNCE_MS = 200;

const isClient = () => typeof window !== "undefined";

const clampPct = (n: number): number => {
  if (Number.isNaN(n)) return 50;
  if (n < 0) return 0;
  if (n > 100) return 100;
  return n;
};

interface PersistedShape {
  version: number;
  mode: LayoutMode;
  splitPct: number;
  collapsed: "first" | "second" | null;
  transport: TransportMode;
}

/**
 * Defensive read — mirrors the try/catch + null-fallback pattern in
 * `lib/lesson-storage.ts`. Returns null for any malformed/corrupt value.
 */
function readPersisted(fullKey: string): PersistedShape | null {
  if (!isClient()) return null;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(fullKey);
  } catch {
    return null;
  }
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Record<string, unknown>;

  if (obj.version !== STORAGE_VERSION) return null;
  if (obj.mode !== "side-by-side" && obj.mode !== "stacked") return null;
  if (typeof obj.splitPct !== "number" || Number.isNaN(obj.splitPct)) return null;
  if (
    obj.collapsed !== null &&
    obj.collapsed !== "first" &&
    obj.collapsed !== "second"
  ) {
    return null;
  }
  if (obj.transport !== "video" && obj.transport !== "synth") return null;

  return {
    version: STORAGE_VERSION,
    mode: obj.mode,
    splitPct: clampPct(obj.splitPct),
    collapsed: obj.collapsed,
    transport: obj.transport,
  };
}

function writePersisted(fullKey: string, state: LayoutState) {
  if (!isClient()) return;
  const payload: PersistedShape = {
    version: STORAGE_VERSION,
    mode: state.mode,
    splitPct: state.splitPct,
    collapsed: state.collapsed,
    transport: state.transport,
  };
  try {
    window.localStorage.setItem(fullKey, JSON.stringify(payload));
  } catch {
    /* quota exceeded or disabled — silently ignore */
  }
}

export function usePlayerLayout(
  options: UsePlayerLayoutOptions
): UsePlayerLayoutReturn {
  const {
    storageKey,
    defaultMode = "side-by-side",
    defaultSplitPct = 50,
    defaultTransport = "video",
  } = options;

  const fullKey = `${STORAGE_PREFIX}${storageKey}`;
  const initialDefaults = useRef<LayoutState>({
    mode: defaultMode,
    splitPct: clampPct(defaultSplitPct),
    collapsed: null,
    transport: defaultTransport,
  });

  const [state, setState] = useState<LayoutState>(() => initialDefaults.current);

  // Track whether the initial hydrate-from-storage pass has run, so the
  // first effect-driven state replacement doesn't trigger a redundant write.
  const hasHydrated = useRef(false);
  const debounceRef = useRef<number | null>(null);

  // Hydrate from localStorage on mount — never during render (would mismatch
  // SSR even though the cockpit lives behind dynamic({ssr:false}); keeps the
  // hook safe for any caller).
  useEffect(() => {
    const persisted = readPersisted(fullKey);
    if (persisted) {
      setState({
        mode: persisted.mode,
        splitPct: persisted.splitPct,
        collapsed: persisted.collapsed,
        transport: persisted.transport,
      });
    }
    hasHydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced write — fires 200 ms after the last state change.
  useEffect(() => {
    if (!hasHydrated.current) return;
    if (debounceRef.current !== null) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      writePersisted(fullKey, state);
      debounceRef.current = null;
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [state, fullKey]);

  const setMode = useCallback((mode: LayoutMode) => {
    setState((prev) => (prev.mode === mode ? prev : { ...prev, mode }));
  }, []);

  const setSplitPct = useCallback((pct: number) => {
    const clamped = clampPct(pct);
    setState((prev) =>
      prev.splitPct === clamped ? prev : { ...prev, splitPct: clamped }
    );
  }, []);

  const setCollapsed = useCallback(
    (collapsed: "first" | "second" | null) => {
      setState((prev) =>
        prev.collapsed === collapsed ? prev : { ...prev, collapsed }
      );
    },
    []
  );

  const setTransport = useCallback((transport: TransportMode) => {
    setState((prev) =>
      prev.transport === transport ? prev : { ...prev, transport }
    );
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({
      mode: prev.mode,
      splitPct: initialDefaults.current.splitPct,
      collapsed: null,
      transport: prev.transport,
    }));
  }, []);

  return { state, setMode, setSplitPct, setCollapsed, setTransport, reset };
}

export default usePlayerLayout;
