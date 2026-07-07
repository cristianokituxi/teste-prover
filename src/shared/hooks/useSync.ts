import { useSyncStore } from "@/src/shared/store/useSyncStore";

export function useSync() {
  const isOnline = useSyncStore((s) => s.isOnline);
  const isSyncing = useSyncStore((s) => s.isSyncing);
  const pendingCount = useSyncStore((s) => s.pendingCount);
  const lastSyncAt = useSyncStore((s) => s.lastSyncAt);
  const syncProgress = useSyncStore((s) => s.syncProgress);
  const syncTotal = useSyncStore((s) => s.syncTotal);
  const queueItems = useSyncStore((s) => s.queueItems);
  const syncNow = useSyncStore((s) => s.syncNow);
  const refreshPendingCount = useSyncStore((s) => s.refreshPendingCount);
  const loadQueueItems = useSyncStore((s) => s.loadQueueItems);

  return {
    isOnline,
    isSyncing,
    pendingCount,
    lastSyncAt,
    syncProgress,
    syncTotal,
    queueItems,
    syncNow,
    refreshPendingCount,
    loadQueueItems,
  };
}
