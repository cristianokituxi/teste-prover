import { create } from "zustand";

import { connectivityService } from "@/src/shared/services/connectivityService";
import { queueService, type QueueItem } from "@/src/shared/services/queueService";
import { syncService } from "@/src/shared/services/syncService";

type SyncState = {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncAt: string | null;
  syncProgress: number;
  syncTotal: number;
  queueItems: QueueItem[];

  setOnline: (value: boolean) => void;
  refreshPendingCount: () => Promise<void>;
  loadQueueItems: () => Promise<void>;
  syncNow: () => Promise<number>;
};

export const useSyncStore = create<SyncState>((set, get) => ({
  isOnline: true,
  isSyncing: false,
  pendingCount: 0,
  lastSyncAt: null,
  syncProgress: 0,
  syncTotal: 0,
  queueItems: [],

  setOnline: (value) => set({ isOnline: value }),

  refreshPendingCount: async () => {
    const pending = await queueService.getPending();
    set({ pendingCount: pending.length });
  },

  loadQueueItems: async () => {
    const items = await queueService.getAll();
    set({ queueItems: items.reverse() });
  },

  syncNow: async () => {
    if (get().isSyncing) return 0;
    const pending = await queueService.getPending();
    if (pending.length === 0) return 0;

    set({ isSyncing: true, syncTotal: pending.length, syncProgress: 0 });

    let synced = 0;
    for (let i = 0; i < pending.length; i++) {
      const item = pending[i];
      try {
        await syncService.processItem(item);
        await queueService.markSynced(item.id);
        synced++;
        set({ syncProgress: i + 1 });
      } catch {
        // item stays pending
      }
    }

    set({
      isSyncing: false,
      lastSyncAt: new Date().toISOString(),
      pendingCount: 0,
      syncProgress: 0,
      syncTotal: 0,
    });

    await get().loadQueueItems();
    return synced;
  },
}));

// Auto-sync when coming back online
connectivityService.onConnectivityChange((connected) => {
  const store = useSyncStore.getState();
  store.setOnline(connected);
  store.refreshPendingCount();
  if (connected) {
    store.syncNow();
  }
});
