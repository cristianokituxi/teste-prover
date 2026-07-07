import { Ionicons } from "@expo/vector-icons";
import {
  Box,
  Button,
  ButtonText,
  Heading,
  HStack,
  Input,
  InputField,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { router } from "expo-router";
import { useState } from "react";

import { DecorativeHero } from "@/src/shared/components/DecorativeHero";
import { useAuthStore } from "@/src/shared/store/useAuthStore";

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isFormValid = userName.trim().length > 0 && password.trim().length > 0;

  const handleLogin = () => {
    const success = login(userName, password);
    if (!success) {
      setError("Informe usuário e senha para entrar.");
      return;
    }
    setError("");
    router.replace("/(tabs)/schools/list");
  };

  return (
    <Box flex={1} justifyContent="center" px="$6" bg="$coolGray50">
      <VStack space="lg">
        <DecorativeHero>
          <VStack space="sm">
            <HStack alignItems="center" space="sm">
              <Ionicons name="school-outline" size={20} color="#ffffff" />
              <Heading size="2xl" color="$white">
                Gestão Escolar
              </Heading>
            </HStack>
            <Text size="sm" color="$blue100">
              Gerencie escolas públicas e turmas de forma simples e eficiente.
            </Text>
          </VStack>
        </DecorativeHero>

        <Box bg="$white" p="$6" borderRadius="$2xl" borderWidth={1} borderColor="$coolGray200">
          <VStack space="md">
            <VStack space="xs">
              <Text size="sm" bold color="$coolGray800">
                Usuário
              </Text>
              <HStack
                alignItems="center"
                space="sm"
                bg="$coolGray50"
                borderWidth={1}
                borderColor="$coolGray200"
                borderRadius="$xl"
                px="$3"
              >
                <Ionicons name="person-outline" size={18} color="#475569" />
                <Input flex={1} borderWidth={0} bg="transparent">
                  <InputField
                    value={userName}
                    onChangeText={setUserName}
                    placeholder="Usuário"
                    autoCapitalize="none"
                  />
                </Input>
              </HStack>
            </VStack>

            <VStack space="xs">
              <Text size="sm" bold color="$coolGray800">
                Senha
              </Text>
              <HStack
                alignItems="center"
                space="sm"
                bg="$coolGray50"
                borderWidth={1}
                borderColor="$coolGray200"
                borderRadius="$xl"
                px="$3"
              >
                <Ionicons name="key-outline" size={18} color="#475569" />
                <Input flex={1} borderWidth={0} bg="transparent">
                  <InputField
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Senha"
                    secureTextEntry
                  />
                </Input>
              </HStack>
            </VStack>

            {error ? <Text color="$red600">{error}</Text> : null}

            <Button onPress={handleLogin} isDisabled={!isFormValid} bg="$blue600">
              <HStack alignItems="center" space="xs">
                <Ionicons name="log-in-outline" size={18} color="#ffffff" />
                <ButtonText>Entrar</ButtonText>
              </HStack>
            </Button>

            <Text size="xs" color="$coolGray500" textAlign="center">
              Modo demonstração: qualquer usuário e senha não vazios são válidos.
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
