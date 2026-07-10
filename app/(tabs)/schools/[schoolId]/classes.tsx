import { useEffect, useMemo, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import {
  Box,
  Button,
  ButtonText,
  Heading,
  HStack,
  Input,
  InputField,
  Pressable,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "react-native";

import { ClassCard } from "@/src/features/classes/components/ClassCard";
import { useClasses, useDeleteClass, useUpdateClass } from "@/src/features/classes/hooks";
import type { SchoolClass } from "@/src/features/classes/types";
import { useDeleteSchool, useSchools } from "@/src/features/schools/hooks";
import type { Shift } from "@/src/features/schools/types";
import { SHIFT_LABELS } from "@/src/features/schools/types";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { Loading, Skeleton } from "@/src/shared/components/Loading";
import { MetricCard } from "@/src/shared/components/MetricCard";
import { ModalDelete } from "@/src/shared/components/ModalDelete";
import { ScreenContainer } from "@/src/shared/components/ScreenContainer";
import { SearchBar } from "@/src/shared/components/SearchBar";
import { useToastStore } from "@/src/shared/store/useToastStore";

const BANNER_URI =
  "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1600";

export default function SchoolClassesPage() {
  const { schoolId } = useLocalSearchParams<{ schoolId: string }>();
  const router = useRouter();
  const { schools, fetchSchools } = useSchools();
  const { classes, isLoading, errorMessage, fetchClasses, clearError } = useClasses(schoolId);
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();
  const deleteSchool = useDeleteSchool();
  const showToast = useToastStore((s) => s.showToast);

  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<SchoolClass | null>(null);
  const [editName, setEditName] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editShift, setEditShift] = useState<Shift>("Morning");
  const [deleting, setDeleting] = useState<SchoolClass | null>(null);
  const [deletingSchool, setDeletingSchool] = useState(false);

  const school = schools.find((s) => s.id === schoolId);

  useEffect(() => {
    if (schoolId) {
      fetchClasses(schoolId).catch(() => {});
      fetchSchools().catch(() => {});
    }
  }, [fetchClasses, fetchSchools, schoolId]);

  const filtered = useMemo(() => {
    const n = query.trim().toLowerCase();
    if (!n) return classes;
    return classes.filter(
      (c) => c.name.toLowerCase().includes(n) || SHIFT_LABELS[c.shift]?.toLowerCase().includes(n),
    );
  }, [classes, query]);

  const startEdit = (c: SchoolClass) => {
    setEditing(c);
    setEditName(c.name);
    setEditYear(c.year.toString());
    setEditShift(c.shift);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditName("");
    setEditYear("");
  };

  const handleUpdate = async () => {
    if (!editing) return;
    const year = parseInt(editYear, 10);
    if (!editName.trim() || isNaN(year)) return;
    try {
      await updateClass(schoolId, editing.id, { name: editName.trim(), shift: editShift, year });
      cancelEdit();
      showToast("Turma atualizada com sucesso.", "success");
    } catch {
      showToast("Erro ao atualizar turma.", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteClass(schoolId, deleting.id);
      showToast("Turma excluída com sucesso.", "success");
    } catch {
      showToast("Erro ao excluir turma.", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteSchool = async () => {
    try {
      await deleteSchool(schoolId);
      showToast("Escola excluída com sucesso.", "success");
      router.replace("/(tabs)/schools/list");
    } catch {
      showToast("Erro ao excluir escola.", "error");
    } finally {
      setDeletingSchool(false);
    }
  };

  const shiftIndex = ["Morning", "Afternoon", "Night"].indexOf(editShift);

  const cycleShift = () => {
    const shifts: Shift[] = ["Morning", "Afternoon", "Night"];
    const next = (shiftIndex + 1) % shifts.length;
    setEditShift(shifts[next]);
  };

  return (
    <Box flex={1}>
      <ScreenContainer>
        <Tabs.Screen
          options={{
            headerTitle: school?.name ?? "Turmas",
            headerRight: () => (
              <HStack space="sm">
                <Pressable
                  onPress={() => router.push(`/(tabs)/schools/${schoolId}/edit`)}
                  hitSlop={12}
                  accessibilityLabel="Editar escola"
                >
                  <Ionicons name="pencil-outline" size={22} color="#64748b" />
                </Pressable>
                <Pressable
                  onPress={() => setDeletingSchool(true)}
                  hitSlop={12}
                  accessibilityLabel="Excluir escola"
                >
                  <Ionicons name="trash-outline" size={22} color="#dc2626" />
                </Pressable>
              </HStack>
            ),
          }}
        />

        <Box borderBottomWidth={1} borderColor="$coolGray200" mb="$4">
          <Image
            source={{ uri: BANNER_URI }}
            style={{ width: "100%", height: 148 }}
            resizeMode="cover"
          />
          <Box p="$3" bg="$coolGray100">
            <Text bold>{school?.name ?? "Escola"}</Text>
            <Text size="sm" color="$coolGray600">
              {school?.address ?? "Endereço não informado"}
            </Text>
          </Box>
        </Box>

        <VStack space="lg">
          <HStack space="sm">
            <MetricCard
              iconName="people-outline"
              iconColor="#1d4ed8"
              badgeText="Turmas ativas"
              badgeTextColor="$blue700"
              label="Total de turmas"
              value={classes.length}
            />
            <MetricCard
              iconName="layers-outline"
              iconColor="#047857"
              badgeText="Turnos"
              badgeTextColor="$emerald700"
              label="Diversidade"
              value={new Set(classes.map((c) => c.shift)).size}
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

          {editing ? (
            <Box bg="$white" p="$5" borderRadius="$2xl" borderWidth={1} borderColor="$coolGray200">
              <VStack space="md">
                <HStack justifyContent="space-between" alignItems="center">
                  <Heading size="md">Editar turma</Heading>
                  <Box px="$2" py="$1" borderRadius="$full" bg="$amber100">
                    <Text size="xs" color="$amber700">
                      Edição ativa
                    </Text>
                  </Box>
                </HStack>

                <VStack space="xs">
                  <Text size="sm" bold color="$coolGray800">
                    Nome da turma
                  </Text>
                  <Input bg="$coolGray50" borderColor="$coolGray200">
                    <InputField
                      value={editName}
                      onChangeText={setEditName}
                      placeholder="Nome da turma"
                    />
                  </Input>
                </VStack>

                <VStack space="xs">
                  <Text size="sm" bold color="$coolGray800">
                    Ano letivo
                  </Text>
                  <Input bg="$coolGray50" borderColor="$coolGray200">
                    <InputField
                      value={editYear}
                      onChangeText={setEditYear}
                      placeholder="Ex: 2026"
                      keyboardType="numeric"
                    />
                  </Input>
                </VStack>

                <VStack space="xs">
                  <Text size="sm" bold color="$coolGray800">
                    Turno
                  </Text>
                  <Pressable onPress={cycleShift}>
                    <HStack
                      bg="$coolGray50"
                      p="$3"
                      borderRadius="$xl"
                      borderWidth={1}
                      borderColor="$coolGray200"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text>{SHIFT_LABELS[editShift]}</Text>
                      <Ionicons name="swap-horizontal-outline" size={18} color="#475569" />
                    </HStack>
                  </Pressable>
                </VStack>

                <Button onPress={handleUpdate} bg="$blue600">
                  <ButtonText>Salvar alterações</ButtonText>
                </Button>
                <Button variant="outline" action="secondary" onPress={cancelEdit}>
                  <ButtonText>Cancelar edição</ButtonText>
                </Button>
              </VStack>
            </Box>
          ) : null}

          <VStack space="sm">
            <HStack justifyContent="space-between" alignItems="center">
              <Heading size="md">Turmas</Heading>
              <Text size="xs" color="$coolGray600">
                {filtered.length} resultado(s)
              </Text>
            </HStack>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              onClear={() => setQuery("")}
              placeholder="Buscar por nome ou turno"
            />
          </VStack>

          {isLoading ? (
            <VStack space="sm">
              <Loading />
              <Skeleton />
            </VStack>
          ) : null}

          {!isLoading && filtered.length === 0 ? (
            <EmptyState
              iconName="people-outline"
              title="Nenhuma turma encontrada"
              message="Use o botão flutuante (+) para cadastrar a primeira turma."
            />
          ) : null}

          {!isLoading && filtered.length > 0 ? (
            <VStack space="sm">
              {filtered.map((c) => (
                <ClassCard key={c.id} classItem={c} onEdit={startEdit} onDelete={setDeleting} />
              ))}
            </VStack>
          ) : null}
        </VStack>

        <ModalDelete
          isOpen={!!deleting}
          title="Excluir turma"
          message={`Deseja remover a turma "${deleting?.name}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />

        <ModalDelete
          isOpen={deletingSchool}
          title="Excluir escola"
          message={`Deseja remover permanentemente "${school?.name}" e todas as suas turmas? Esta ação não pode ser desfeita.`}
          onConfirm={handleDeleteSchool}
          onCancel={() => setDeletingSchool(false)}
        />
      </ScreenContainer>

      <Pressable
        onPress={() => router.push(`/(tabs)/schools/${schoolId}/classes-create`)}
        position="absolute"
        bottom="$8"
        right="$6"
        w={56}
        h={56}
        borderRadius="$full"
        bg="$blue600"
        alignItems="center"
        justifyContent="center"
        accessibilityLabel="Adicionar turma"
        sx={{
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 6,
          elevation: 6,
          _pressed: { bg: "$blue700", transform: [{ scale: 0.95 }] },
        }}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </Pressable>
    </Box>
  );
}
