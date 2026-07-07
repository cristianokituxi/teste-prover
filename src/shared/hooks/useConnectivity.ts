import { useState, useEffect } from "react";
import { connectivityService } from "@/src/shared/services/connectivityService";

export function useConnectivity() {
  const [isOnline, setIsOnline] = useState(connectivityService.isConnected);

  useEffect(() => {
    return connectivityService.onConnectivityChange(setIsOnline);
  }, []);

  return { isOnline };
}
