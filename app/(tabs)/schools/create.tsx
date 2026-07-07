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
import { router } from "expo-router";
import { useMemo, useState } from "react";

import { useCreateSchool } from "@/src/features/schools/hooks";
import { DecorativeHero } from "@/src/shared/components/DecorativeHero";
import { FormField } from "@/src/shared/components/FormField";
import { ScreenContainer } from "@/src/shared/components/ScreenContainer";
import { useToastStore } from "@/src/shared/store/useToastStore";

export default function CreateSchoolPage() {
  const createSchool = useCreateSchool();
  const showToast = useToastStore((s) => s.showToast);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewName = useMemo(() => name.trim() || "Nome da nova escola", [name]);
  const previewAddress = useMemo(
    () => address.trim() || "Rua, avenida ou bairro principal",
    [address],
  );
  const isFormValid = name.trim().length > 0 && address.trim().length > 0;

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    try {
      await createSchool({ name: name.trim(), address: address.trim() });
      setName("");
      setAddress("");
      showToast("Escola cadastrada com sucesso.", "success");
      router.replace("/(tabs)/schools/list");
    } catch {
      showToast("Erro ao cadastrar escola.", "error");
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
              <Pressable onPress={() => router.replace("/(tabs)/schools/list")}>
                <Box
                  w="$10"
                  h="$10"
                  borderRadius="$full"
                  bg="$blue600"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Ionicons name="arrow-back" size={18} color="#ffffff" />
                </Box>
              </Pressable>
              <VStack flex={1}>
                <Heading size="xl" color="$white">
                  Nova escola
                </Heading>
                <Text size="sm" color="$blue100">
                  Cadastre uma unidade escolar com informações precisas.
                </Text>
              </VStack>
            </HStack>
            <HStack space="sm" flexWrap="wrap">
              <Box px="$3" py="$2" borderRadius="$full" bg="$blue600">
                <Text size="xs" color="$white">
                  Nome obrigatório
                </Text>
              </Box>
              <Box px="$3" py="$2" borderRadius="$full" bg="$blue600">
                <Text size="xs" color="$white">
                  Endereço completo
                </Text>
              </Box>
            </HStack>
          </VStack>
        </DecorativeHero>

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
              <Ionicons name="business-outline" size={18} color="#1d4ed8" />
              <Text size="xs" color="$blue700" bold>
                Etapa 1
              </Text>
            </HStack>
            <Text size="sm" bold mt="$3">
              Identidade
            </Text>
            <Text size="xs" color="$coolGray600" mt="$1">
              Defina um nome claro para facilitar buscas.
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
              <Ionicons name="location-outline" size={18} color="#047857" />
              <Text size="xs" color="$emerald700" bold>
                Etapa 2
              </Text>
            </HStack>
            <Text size="sm" bold mt="$3">
              Localização
            </Text>
            <Text size="xs" color="$coolGray600" mt="$1">
              Informe o endereço da unidade escolar.
            </Text>
          </Box>
        </HStack>

        <Box bg="$white" p="$5" borderRadius="$2xl" borderWidth={1} borderColor="$coolGray200">
          <VStack space="md">
            <FormField icon="school-outline" label="Nome da escola">
              <InputField
                value={name}
                onChangeText={setName}
                placeholder="Ex: Escola Municipal Monteiro Lobato"
                autoCapitalize="words"
              />
            </FormField>
            <FormField icon="location-outline" label="Endereço">
              <InputField
                value={address}
                onChangeText={setAddress}
                placeholder="Ex: Av. Principal, 120 - Centro"
                autoCapitalize="words"
              />
            </FormField>

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
                      Nova unidade
                    </Text>
                  </Box>
                </HStack>
                <Text size="lg" bold color="$coolGray900">
                  {previewName}
                </Text>
                <Text size="sm" color="$coolGray600">
                  {previewAddress}
                </Text>
              </VStack>
            </Box>

            <Button onPress={handleSubmit} isDisabled={!isFormValid || isSubmitting} bg="$blue600">
              <HStack alignItems="center" space="xs">
                <Ionicons name="add-circle-outline" size={18} color="#ffffff" />
                <ButtonText>{isSubmitting ? "Salvando..." : "Cadastrar escola"}</ButtonText>
              </HStack>
            </Button>
          </VStack>
        </Box>
      </VStack>
    </ScreenContainer>
  );
}
