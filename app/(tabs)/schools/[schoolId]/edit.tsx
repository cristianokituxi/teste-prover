import { Ionicons } from "@expo/vector-icons";
import {
  Box,
  Button,
  ButtonText,
  Heading,
  HStack,
  InputField,
  Pressable,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { useSchools, useUpdateSchool } from "@/src/features/schools/hooks";
import { DecorativeHero } from "@/src/shared/components/DecorativeHero";
import { FormField } from "@/src/shared/components/FormField";
import { ScreenContainer } from "@/src/shared/components/ScreenContainer";
import { useToastStore } from "@/src/shared/store/useToastStore";

export default function EditSchoolPage() {
  const { schoolId } = useLocalSearchParams<{ schoolId: string }>();
  const { schools } = useSchools();
  const updateSchool = useUpdateSchool();
  const showToast = useToastStore((s) => s.showToast);

  const school = schools.find((s) => s.id === schoolId);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (school) {
      setName(school.name);
      setAddress(school.address);
    }
  }, [school]);

  const isFormValid = name.trim().length > 0 && address.trim().length > 0;

  const handleSubmit = async () => {
    if (!isFormValid || !schoolId) return;
    setIsSubmitting(true);
    try {
      await updateSchool(schoolId, { name: name.trim(), address: address.trim() });
      showToast("Escola atualizada com sucesso.", "success");
      router.replace("/(tabs)/schools/list");
    } catch {
      showToast("Erro ao atualizar escola.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <VStack space="lg">
        <DecorativeHero>
          <VStack space="md">
            <HStack space="sm" alignItems="center">
              <Pressable onPress={() => router.back()}>
                <Box
                  w="$10" h="$10" borderRadius="$full" bg="$blue600"
                  alignItems="center" justifyContent="center"
                >
                  <Ionicons name="arrow-back" size={18} color="#ffffff" />
                </Box>
              </Pressable>
              <VStack flex={1}>
                <Heading size="xl" color="$white">Editar escola</Heading>
                <Text size="sm" color="$blue100">
                  Atualize os dados da unidade escolar.
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </DecorativeHero>

        <Box bg="$white" p="$5" borderRadius="$2xl" borderWidth={1} borderColor="$coolGray200">
          <VStack space="md">
            <FormField icon="school-outline" label="Nome da escola">
              <InputField
                value={name}
                onChangeText={setName}
                placeholder="Nome da escola"
                autoCapitalize="words"
                accessibilityLabel="Nome da escola"
              />
            </FormField>
            <FormField icon="location-outline" label="Endereço">
              <InputField
                value={address}
                onChangeText={setAddress}
                placeholder="Endereço"
                autoCapitalize="words"
                accessibilityLabel="Endereço da escola"
              />
            </FormField>

            <Button
              onPress={handleSubmit}
              isDisabled={!isFormValid || isSubmitting}
              bg="$blue600"
              accessibilityLabel="Salvar alterações"
            >
              <HStack alignItems="center" space="xs">
                <Ionicons name="save-outline" size={18} color="#ffffff" />
                <ButtonText>{isSubmitting ? "Salvando..." : "Salvar alterações"}</ButtonText>
              </HStack>
            </Button>
          </VStack>
        </Box>
      </VStack>
    </ScreenContainer>
  );
}
