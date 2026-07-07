import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";

type ConnectivityListener = (isConnected: boolean) => void;

function getBrowserOnline(): boolean {
  if (typeof navigator !== "undefined" && "onLine" in navigator) {
    return navigator.onLine;
  }
  return true;
}

let isConnected = getBrowserOnline();
const listeners: ConnectivityListener[] = [];

function notifyListeners(connected: boolean) {
  if (connected !== isConnected) {
    isConnected = connected;
    listeners.forEach((fn) => fn(connected));
  }
}

NetInfo.addEventListener((state: NetInfoState) => {
  const connected = !!(state.isConnected && state.isInternetReachable !== false);
  notifyListeners(connected);
});

// Fallback: escuta eventos online/offline do browser (mais confiável na web)
if (typeof window !== "undefined") {
  window.addEventListener("online", () => notifyListeners(true));
  window.addEventListener("offline", () => notifyListeners(false));
}

export const connectivityService = {
  get isConnected(): boolean {
    return isConnected;
  },

  async checkNow(): Promise<boolean> {
    try {
      const state = await NetInfo.fetch();
      isConnected = !!(state.isConnected && state.isInternetReachable !== false);
    } catch {
      isConnected = getBrowserOnline();
    }
    return isConnected;
  },

  onConnectivityChange(listener: ConnectivityListener): () => void {
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  },
};
