import { Ionicons } from "@expo/vector-icons";
import { Box, HStack, Text } from "@gluestack-ui/themed";
import type { ReactNode } from "react";

export type SyncStatus = "pending" | "syncing" | "synced" | "error";

const STATUS_CONFIG: Record<SyncStatus, { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string; label: string }> = {
  pending: { icon: "time-outline", color: "#d97706", bg: "$amber100", label: "Pendente" },
  syncing: { icon: "sync-outline", color: "#2563eb", bg: "$blue100", label: "Sincronizando" },
  synced:  { icon: "checkmark-circle-outline", color: "#16a34a", bg: "$emerald100", label: "Sincronizado" },
  error:   { icon: "alert-circle-outline", color: "#dc2626", bg: "$red100", label: "Erro" },
};

type SyncStatusBadgeProps = {
  status: SyncStatus;
  children?: ReactNode;
};

export function SyncStatusBadge({ status, children }: SyncStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Box px="$2" py="$1" borderRadius="$full" bg={config.bg} alignSelf="flex-start">
      <HStack alignItems="center" space="xs">
        <Ionicons name={config.icon} size={12} color={config.color} />
        <Text size="xs" color={config.color} bold>
          {children ?? config.label}
        </Text>
      </HStack>
    </Box>
  );
}
