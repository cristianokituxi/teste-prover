import { useCallback, useEffect, useMemo, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import {
  Box,
  Button,
  ButtonText,
  HStack,
  Pressable,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";

import { SchoolCard } from "@/src/features/schools/components/SchoolCard";
import { useSchools } from "@/src/features/schools/hooks";
import type { School } from "@/src/features/schools/types";
import { DecorativeHero } from "@/src/shared/components/DecorativeHero";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { Loading, Skeleton } from "@/src/shared/components/Loading";
import { MetricCard } from "@/src/shared/components/MetricCard";
import { ScreenContainer } from "@/src/shared/components/ScreenContainer";
import { SearchBar } from "@/src/shared/components/SearchBar";
import { startMockServer } from "@/src/shared/services/mockServer";

type QuickFilter = "all" | "with-classes" | "without-classes";

export default function SchoolsListPage() {
  const router = useRouter();
  const { schools, isLoading, errorMessage, fetchSchools, clearError } = useSchools();
  const [query, setQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    startMockServer();
    fetchSchools().catch(() => {});
  }, [fetchSchools]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchSchools();
    } finally {
      setRefreshing(false);
    }
  }, [fetchSchools]);

  const totalClasses = useMemo(
    () => schools.reduce((acc, s) => acc + s.classCount, 0),
    [schools],
  );

  const withClasses = useMemo(
    () => schools.filter((s) => s.classCount > 0).length,
    [schools],
  );

  const withoutClasses = Math.max(schools.length - withClasses, 0);

  const filteredSchools = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return schools.filter((s) => {
      const matches =
        !normalized ||
        s.name.toLowerCase().includes(normalized) ||
        s.address.toLowerCase().includes(normalized);
      if (!matches) return false;
      if (quickFilter === "with-classes") return s.classCount > 0;
      if (quickFilter === "without-classes") return s.classCount === 0;
      return true;
    });
  }, [query, quickFilter, schools]);

  return (
    <ScreenContainer refreshing={refreshing} onRefresh={onRefresh}>
      <VStack space="lg">
        <DecorativeHero>
          <VStack space="xs">
            <Text size="2xl" bold color="$white">
              Escolas públicas
            </Text>
            <Text size="sm" color="$blue100">
              Gerencie unidades escolares, turmas e acompanhe os indicadores.
            </Text>
          </VStack>
        </DecorativeHero>

        <HStack space="sm">
          <MetricCard
            iconName="school-outline"
            iconColor="#1d4ed8"
            badgeText={`+${schools.length > 0 ? 1 : 0} esta semana`}
            badgeTextColor="$blue700"
            label="Escolas"
            value={schools.length}
          />
          <MetricCard
            iconName="people-outline"
            iconColor="#047857"
            badgeText={`${withClasses} com turmas`}
            badgeTextColor="$emerald700"
            label="Turmas"
            value={totalClasses}
          />
        </HStack>

        {errorMessage ? (
          <Box bg="$red100" p="$3" borderRadius="$md">
            <Text>{errorMessage}</Text>
            <Button mt="$2" variant="outline" action="secondary" onPress={clearError}>
              <ButtonText>Fechar</ButtonText>
            </Button>
          </Box>
        ) : null}

        <VStack space="sm">
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery("")}
            placeholder="Buscar por nome ou endereço"
          />

          <HStack space="xs" flexWrap="wrap">
            {[
              { key: "all" as QuickFilter, label: "Todas", color: "$blue600" },
              { key: "with-classes" as QuickFilter, label: `Com turmas (${withClasses})`, color: "$emerald600" },
              { key: "without-classes" as QuickFilter, label: `Sem turmas (${withoutClasses})`, color: "$amber600" },
            ].map((f) => (
              <Pressable key={f.key} onPress={() => setQuickFilter(f.key)}>
                <Box
                  px="$3"
                  py="$2"
                  borderRadius="$full"
                  bg={quickFilter === f.key ? f.color : "$white"}
                  borderWidth={1}
                  borderColor={quickFilter === f.key ? f.color : "$coolGray300"}
                >
                  <Text size="xs" color={quickFilter === f.key ? "$white" : "$coolGray700"}>
                    {f.label}
                  </Text>
                </Box>
              </Pressable>
            ))}
          </HStack>
        </VStack>

        <Text size="xs" color="$coolGray600">
          {filteredSchools.length} resultado(s)
        </Text>

        {isLoading ? (
          <VStack space="sm">
            <Loading />
            <Skeleton />
          </VStack>
        ) : null}

        {!isLoading && filteredSchools.length === 0 ? (
          <EmptyState
            iconName="school-outline"
            title="Nenhuma escola encontrada"
            message="Ajuste sua busca ou cadastre uma nova escola para começar."
            actionLabel="Cadastrar escola"
            onAction={() => router.push("/schools/create")}
          />
        ) : null}

        {!isLoading && filteredSchools.length > 0 ? (
          <VStack space="sm">
            {filteredSchools.map((school: School) => (
              <SchoolCard
                key={school.id}
                school={school}
                onPress={() => router.push(`/(tabs)/schools/${school.id}/classes`)}
              />
            ))}
          </VStack>
        ) : null}
      </VStack>
    </ScreenContainer>
  );
}
