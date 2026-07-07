import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";

type ConnectivityListener = (isConnected: boolean) => void;

let isConnected = true;
const listeners: ConnectivityListener[] = [];

NetInfo.addEventListener((state: NetInfoState) => {
  const connected = !!(state.isConnected && state.isInternetReachable !== false);
  if (connected !== isConnected) {
    isConnected = connected;
    listeners.forEach((fn) => fn(connected));
  }
});

export const connectivityService = {
  get isConnected(): boolean {
    return isConnected;
  },

  async checkNow(): Promise<boolean> {
    const state = await NetInfo.fetch();
    isConnected = !!(state.isConnected && state.isInternetReachable !== false);
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
