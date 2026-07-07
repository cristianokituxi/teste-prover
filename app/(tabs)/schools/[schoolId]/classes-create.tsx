import { Ionicons } from "@expo/vector-icons";
import {
  Box,
  Button,
  ButtonText,
  HStack,
  InputField,
  Pressable,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image } from "react-native";

import { useCreateClass } from "@/src/features/classes/hooks";
import { useSchools } from "@/src/features/schools/hooks";
import type { Shift } from "@/src/features/schools/types";
import { SHIFT_LABELS } from "@/src/features/schools/types";
import { FormField } from "@/src/shared/components/FormField";
import { ScreenContainer } from "@/src/shared/components/ScreenContainer";
import { useToastStore } from "@/src/shared/store/useToastStore";

const BANNER_URI =
  "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1600";

const SHIFTS: Shift[] = ["Morning", "Afternoon", "Night"];

export default function CreateClassPage() {
  const { schoolId } = useLocalSearchParams<{ schoolId: string }>();
  const router = useRouter();
  const createClass = useCreateClass();
  const { schools } = useSchools();
  const showToast = useToastStore((s) => s.showToast);

  const [name, setName] = useState("");
  const [yearText, setYearText] = useState("");
  const [shiftIndex, setShiftIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const school = schools.find((s) => s.id === schoolId);
  const shift = SHIFTS[shiftIndex];
  const year = parseInt(yearText, 10);

  const previewValid = name.trim().length > 0 && !isNaN(year) && year >= 2000 && year <= 2100;

  const cycleShift = () => setShiftIndex((i) => (i + 1) % SHIFTS.length);

  const handleCreate = async () => {
    if (!previewValid) return;
    setIsSubmitting(true);
    try {
      await createClass(schoolId, { name: name.trim(), shift, year });
      setName("");
      setYearText("");
      showToast("Turma cadastrada com sucesso.", "success");
      router.replace(`/(tabs)/schools/${schoolId}/classes`);
    } catch {
      showToast("Erro ao cadastrar turma.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <Tabs.Screen options={{ headerTitle: "" }} />

      <Box borderBottomWidth={1} borderColor="$coolGray200" mb="$4">
        <Image
          source={{ uri: BANNER_URI }}
          style={{ width: "100%", height: 128 }}
          resizeMode="cover"
        />
        <Box p="$3" bg="$coolGray100">
          <Text bold>{school?.name ?? "Escola"}</Text>
          <Text size="sm" color="$coolGray600">
            {school?.address ?? ""}
          </Text>
        </Box>
      </Box>

      <VStack space="lg">
        <HStack space="sm">
          <Box
            flex={1}
            bg="$white"
            p="$4"
            borderRadius="$xl"
            borderWidth={1}
            borderColor="$coolGray200"
          >
            <HStack justifyContent="space-between" alignItems="center">
              <Ionicons name="people-outline" size={18} color="#1d4ed8" />
              <Text size="xs" color="$blue700" bold>
                Nome
              </Text>
            </HStack>
            <Text size="sm" bold mt="$3">
              Identidade da turma
            </Text>
            <Text size="xs" color="$coolGray600" mt="$1">
              Ex: 1º Ano A, 2º Ano B.
            </Text>
          </Box>
          <Box
            flex={1}
            bg="$white"
            p="$4"
            borderRadius="$xl"
            borderWidth={1}
            borderColor="$coolGray200"
          >
            <HStack justifyContent="space-between" alignItems="center">
              <Ionicons name="time-outline" size={18} color="#047857" />
              <Text size="xs" color="$emerald700" bold>
                Turno
              </Text>
            </HStack>
            <Text size="sm" bold mt="$3">
              Período de aulas
            </Text>
            <Text size="xs" color="$coolGray600" mt="$1">
              Manhã, tarde ou noite.
            </Text>
          </Box>
        </HStack>

        <Box bg="$white" p="$5" borderRadius="$2xl" borderWidth={1} borderColor="$coolGray200">
          <VStack space="md">
            <FormField icon="people-outline" label="Nome da turma">
              <InputField
                value={name}
                onChangeText={setName}
                placeholder="Ex: 1º Ano A"
                autoCapitalize="words"
                accessibilityLabel="Nome da turma"
              />
            </FormField>

            <FormField icon="calendar-outline" label="Ano letivo">
              <InputField
                value={yearText}
                onChangeText={setYearText}
                placeholder="Ex: 2026"
                keyboardType="numeric"
                accessibilityLabel="Ano letivo"
              />
            </FormField>

            <VStack space="xs">
              <Text size="sm" bold color="$coolGray800">
                Turno
              </Text>
              <Pressable onPress={cycleShift} accessibilityLabel="Alternar turno">
                <HStack
                  bg="$coolGray50"
                  p="$3"
                  borderRadius="$xl"
                  borderWidth={1}
                  borderColor="$coolGray200"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text>{SHIFT_LABELS[shift]}</Text>
                  <Ionicons name="swap-horizontal-outline" size={18} color="#475569" />
                </HStack>
              </Pressable>
            </VStack>

            <Box
              bg="$coolGray50"
              p="$4"
              borderRadius="$xl"
              borderWidth={1}
              borderColor="$coolGray200"
            >
              <VStack space="xs">
                <HStack justifyContent="space-between" alignItems="center">
                  <Text size="sm" bold>
                    Pré-visualização
                  </Text>
                  <Box px="$2" py="$1" borderRadius="$full" bg="$blue100">
                    <Text size="xs" color="$blue700">
                      Nova turma
                    </Text>
                  </Box>
                </HStack>
                <Text size="lg" bold color="$coolGray900">
                  {name.trim() || "Nome da turma"}
                </Text>
                <Text size="sm" color="$coolGray600">
                  Ano: {previewValid ? year : "-"} · Turno: {SHIFT_LABELS[shift]}
                </Text>
              </VStack>
            </Box>

            <Button onPress={handleCreate} isDisabled={!previewValid || isSubmitting} bg="$blue600">
              <HStack alignItems="center" space="xs">
                <Ionicons name="add-circle-outline" size={18} color="#ffffff" />
                <ButtonText>{isSubmitting ? "Salvando..." : "Cadastrar turma"}</ButtonText>
              </HStack>
            </Button>
          </VStack>
        </Box>
      </VStack>
    </ScreenContainer>
  );
}
