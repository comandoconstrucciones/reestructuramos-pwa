import { create } from "zustand";

interface SyncState {
  online: boolean;
  syncing: boolean;
  pendingCount: number;
  lastSyncAt?: number;
  lastError: string | null;
  setOnline: (online: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setPendingCount: (n: number) => void;
  markSynced: () => void;
  setError: (msg: string | null) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  // Determinista en SSR y en la primera hidratación (evita mismatch en arranque
  // offline). Providers aplica navigator.onLine real tras montar.
  online: true,
  syncing: false,
  pendingCount: 0,
  lastError: null,
  setOnline: (online) => set({ online }),
  setSyncing: (syncing) => set({ syncing }),
  setPendingCount: (pendingCount) => set({ pendingCount }),
  markSynced: () => set({ lastSyncAt: Date.now(), lastError: null }),
  setError: (lastError) => set({ lastError }),
}));
