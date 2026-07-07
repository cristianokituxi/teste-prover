import { Ionicons } from "@expo/vector-icons";
import { Box, Button, ButtonText, HStack, Text, VStack } from "@gluestack-ui/themed";
import { router } from "expo-router";
import { ScrollView } from "react-native";

import { useSchools } from "@/src/features/schools/hooks";
import { useAuthStore } from "@/src/shared/store/useAuthStore";

export default function ProfilePage() {
  const userName = useAuthStore((s) => s.userName);
  const logout = useAuthStore((s) => s.logout);
  const { schools } = useSchools();

  const totalClasses = schools.reduce((acc, s) => acc + s.classCount, 0);

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

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
            label="Status da sessão"
            value={
              <HStack alignItems="center" space="xs">
                <Ionicons name="ellipse" size={10} color="#16a34a" />
                <Text size="sm" bold color="$coolGray900">Online</Text>
              </HStack>
            }
          />
          <Row label="Escolas cadastradas" value={schools.length} />
          <Row label="Turmas totais" value={totalClasses} />

          <Box borderBottomWidth={1} borderColor="$coolGray200" pb="$4">
            <VStack space="sm">
              <Text size="sm" color="$coolGray600">Informações</Text>
              <InfoRow icon="shield-checkmark-outline" iconColor="#1d4ed8" text="Acesso salvo localmente neste dispositivo." />
              <InfoRow icon="school-outline" iconColor="#475569" text="Use a aba Escolas para gerenciar unidades e turmas." />
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

function Row({
  label,
  value,
}: {
  label: string;
  value: string | number | React.ReactNode;
}) {
  return (
    <Box borderBottomWidth={1} borderColor="$coolGray200" pb="$4">
      <HStack justifyContent="space-between" alignItems="center">
        <Text size="sm" color="$coolGray600">{label}</Text>
        {typeof value === "string" || typeof value === "number" ? (
          <Text size="sm" bold color="$coolGray900">{value}</Text>
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
      <Text size="sm" color="$coolGray700">{text}</Text>
    </HStack>
  );
}
