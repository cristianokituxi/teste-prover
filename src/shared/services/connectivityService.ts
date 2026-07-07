import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";

type ConnectivityListener = (isConnected: boolean) => void;

const isWeb = typeof window !== "undefined" && typeof window.addEventListener === "function";

function getBrowserOnline(): boolean {
  if (typeof navigator !== "undefined" && "onLine" in navigator) {
    return navigator.onLine;
  }
  return true;
}

let isConnected = getBrowserOnline();
const listeners: ConnectivityListener[] = [];

function notifyListeners(connected: boolean) {
  // Na web, navigator.onLine é a fonte da verdade
  if (isWeb) {
    connected = getBrowserOnline();
  }
  if (connected !== isConnected) {
    isConnected = connected;
    listeners.forEach((fn) => fn(connected));
  }
}

// NetInfo: confiável em mobile, problemático na web
if (!isWeb) {
  NetInfo.addEventListener((state: NetInfoState) => {
    const connected = !!(state.isConnected && state.isInternetReachable !== false);
    notifyListeners(connected);
  });
}

// Eventos online/offline do browser (fonte primária na web)
if (isWeb) {
  window.addEventListener("online", () => notifyListeners(true));
  window.addEventListener("offline", () => notifyListeners(false));
}

export const connectivityService = {
  get isConnected(): boolean {
    return isConnected;
  },

  async checkNow(): Promise<boolean> {
    if (isWeb) {
      isConnected = getBrowserOnline();
      return isConnected;
    }
    try {
      const state = await NetInfo.fetch();
      isConnected = !!(state.isConnected && state.isInternetReachable !== false);
    } catch {
      isConnected = true;
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
