import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Box, Button, ButtonText, HStack, Spinner, Text, VStack } from "@gluestack-ui/themed";
import { router } from "expo-router";
import { ScrollView } from "react-native";

import { useSchools } from "@/src/features/schools/hooks";
import { storageService } from "@/src/shared/services/storageService";
import { useAuthStore } from "@/src/shared/store/useAuthStore";
import { useSync } from "@/src/shared/hooks/useSync";
import { useSyncStore } from "@/src/shared/store/useSyncStore";
import { useToastStore } from "@/src/shared/store/useToastStore";
import { SyncStatusBadge } from "@/src/shared/components/SyncStatusBadge";
import type { QueueItem } from "@/src/shared/services/queueService";

const OP_LABELS: Record<string, string> = {
  CREATE_SCHOOL: "Criar escola",
  UPDATE_SCHOOL: "Editar escola",
  DELETE_SCHOOL: "Excluir escola",
  CREATE_CLASS: "Criar turma",
  UPDATE_CLASS: "Editar turma",
  DELETE_CLASS: "Excluir turma",
};

export default function ProfilePage() {
  const userName = useAuthStore((s) => s.userName);
  const logout = useAuthStore((s) => s.logout);
  const { schools } = useSchools();
  const { isOnline, isSyncing, pendingCount, lastSyncAt, syncNow, queueItems, loadQueueItems } =
    useSync();
  const showToast = useToastStore((s) => s.showToast);

  const totalClasses = schools.reduce((acc, s) => acc + s.classCount, 0);

  useEffect(() => {
    loadQueueItems();
  }, [loadQueueItems]);

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  const handleSyncNow = async () => {
    const count = await syncNow();
    if (count > 0) showToast(`${count} operações sincronizadas.`, "success");
    else showToast("Nenhuma pendência para sincronizar.", "info");
  };

  const handleRestoreSeed = async () => {
    await storageService.restoreSeed();
    useSyncStore.getState().refreshPendingCount();
    showToast("Dados de demonstração restaurados.", "success");
  };

  const handleClearCache = async () => {
    await storageService.clearAll();
    await storageService.loadSeedIfNeeded();
    useSyncStore.getState().refreshPendingCount();
    showToast("Cache limpo com sucesso.", "success");
  };

  const lastSyncLabel = lastSyncAt
    ? new Date(lastSyncAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : "Nunca";

  const recentItems = queueItems.slice(0, 10);

  return (
    <Box flex={1} bg="$coolGray50">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <VStack space="md">
          <Box borderBottomWidth={1} borderColor="$coolGray200" pb="$4">
            <HStack alignItems="center" justifyContent="center">
              <Ionicons name="person-circle-outline" size={56} color="#2563eb" />
            </HStack>
          </Box>

          <Row label="Usuário" value={userName || "-"} />
          <Row
            label="Conexão"
            value={
              <SyncStatusBadge status={isOnline ? "synced" : "pending"}>
                {isOnline ? "Online" : "Offline"}
              </SyncStatusBadge>
            }
          />
          <Row label="Escolas cadastradas" value={schools.length} />
          <Row label="Turmas totais" value={totalClasses} />
          <Row label="Pendências de sincronização" value={pendingCount} />
          <Row label="Última sincronização" value={lastSyncLabel} />

          <Box borderBottomWidth={1} borderColor="$coolGray200" pb="$4">
            <VStack space="sm">
              <Text size="sm" color="$coolGray600">
                Ações
              </Text>
              <Button variant="outline" size="sm" onPress={handleSyncNow} isDisabled={isSyncing}>
                <HStack alignItems="center" space="xs">
                  {isSyncing ? (
                    <Spinner size="small" />
                  ) : (
                    <Ionicons name="sync-outline" size={16} color="#2563eb" />
                  )}
                  <ButtonText>{isSyncing ? "Sincronizando..." : "Sincronizar agora"}</ButtonText>
                </HStack>
              </Button>
              <Button variant="outline" size="sm" action="secondary" onPress={handleRestoreSeed}>
                <HStack alignItems="center" space="xs">
                  <Ionicons name="refresh-outline" size={16} color="#64748b" />
                  <ButtonText>Restaurar dados de demonstração</ButtonText>
                </HStack>
              </Button>
              <Button variant="outline" size="sm" action="negative" onPress={handleClearCache}>
                <HStack alignItems="center" space="xs">
                  <Ionicons name="trash-outline" size={16} color="#dc2626" />
                  <ButtonText>Limpar cache</ButtonText>
                </HStack>
              </Button>
            </VStack>
          </Box>

          {recentItems.length > 0 ? (
            <Box borderBottomWidth={1} borderColor="$coolGray200" pb="$4">
              <VStack space="sm">
                <Text size="sm" color="$coolGray600">
                  Fila de sincronização (simulada via MSW)
                </Text>
                {recentItems.map((item: QueueItem) => (
                  <Box
                    key={item.id}
                    bg="$white"
                    p="$3"
                    borderRadius="$md"
                    borderWidth={1}
                    borderColor="$coolGray200"
                  >
                    <HStack justifyContent="space-between" alignItems="center">
                      <VStack flex={1} space="xs">
                        <Text size="xs" bold color="$coolGray800">
                          {OP_LABELS[item.operation] ?? item.operation}
                        </Text>
                        <Text size="2xs" color="$coolGray500">
                          {new Date(item.timestamp).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </VStack>
                      <SyncStatusBadge status={item.status as "pending" | "synced" | "error"} />
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          ) : null}

          <Box borderBottomWidth={1} borderColor="$coolGray200" pb="$4">
            <VStack space="sm">
              <Text size="sm" color="$coolGray600">
                Informações
              </Text>
              <InfoRow
                icon="shield-checkmark-outline"
                iconColor="#1d4ed8"
                text="Acesso salvo localmente neste dispositivo."
              />
              <InfoRow
                icon="cloud-outline"
                iconColor="#475569"
                text="Dados persistidos via AsyncStorage. Sincronização simulada com MSW."
              />
            </VStack>
          </Box>

          <Button action="negative" mt="$2" onPress={handleLogout}>
            <HStack alignItems="center" space="xs">
              <Ionicons name="log-out-outline" size={18} color="#ffffff" />
              <ButtonText>Sair da conta</ButtonText>
            </HStack>
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
}

function Row({ label, value }: { label: string; value: string | number | React.ReactNode }) {
  return (
    <Box borderBottomWidth={1} borderColor="$coolGray200" pb="$4">
      <HStack justifyContent="space-between" alignItems="center">
        <Text size="sm" color="$coolGray600">
          {label}
        </Text>
        {typeof value === "string" || typeof value === "number" ? (
          <Text size="sm" bold color="$coolGray900">
            {value}
          </Text>
        ) : (
          value
        )}
      </HStack>
    </Box>
  );
}

function InfoRow({
  icon,
  iconColor,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  text: string;
}) {
  return (
    <HStack alignItems="center" space="sm">
      <Ionicons name={icon} size={18} color={iconColor} />
      <Text size="sm" color="$coolGray700">
        {text}
      </Text>
    </HStack>
  );
}
