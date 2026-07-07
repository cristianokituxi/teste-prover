import { Ionicons } from "@expo/vector-icons";
import { Box, HStack, Progress, ProgressFilledTrack, Spinner, Text, VStack } from "@gluestack-ui/themed";

import { useSync } from "@/src/shared/hooks/useSync";

export function OfflineBanner() {
  const { isOnline, isSyncing, pendingCount, syncProgress, syncTotal } = useSync();

  if (isOnline && !isSyncing && pendingCount === 0) return null;

  const bg = isOnline ? "$emerald600" : "$amber600";
  const icon = isOnline ? "cloud-done-outline" : ("cloud-offline-outline" as const);
  const message = isOnline
    ? "Sincronizando alterações pendentes..."
    : "Modo offline — alterações armazenadas localmente. A sincronização é simulada via MSW.";

  return (
    <Box bg={bg} px="$4" py="$2">
      <VStack space="xs">
        <HStack alignItems="center" space="sm" justifyContent="center">
          <Ionicons name={icon} size={14} color="#ffffff" />
          <Text size="xs" color="$white" textAlign="center" flex={1}>
            {message}
          </Text>
          {isSyncing ? <Spinner size="small" color="$white" /> : null}
        </HStack>

        {isSyncing && syncTotal > 0 ? (
          <VStack space="xs">
            <Progress value={(syncProgress / syncTotal) * 100} size="xs" bg="$white" opacity={0.3}>
              <ProgressFilledTrack bg="$white" />
            </Progress>
            <Text size="2xs" color="$white" textAlign="center">
              {syncProgress} de {syncTotal} operações
            </Text>
          </VStack>
        ) : null}
      </VStack>
    </Box>
  );
}
