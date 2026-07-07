import { Ionicons } from "@expo/vector-icons";
import { HStack, Input, InputField, Text, VStack } from "@gluestack-ui/themed";
import type { ReactNode } from "react";

type FormFieldProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  children: ReactNode;
};

export function FormField({ icon, label, children }: FormFieldProps) {
  return (
    <VStack space="xs">
      <Text size="sm" bold color="$coolGray800">
        {label}
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
        <Ionicons name={icon} size={18} color="#475569" />
        <Input flex={1} borderWidth={0} bg="transparent">
          {children}
        </Input>
      </HStack>
    </VStack>
  );
}
