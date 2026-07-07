import { Ionicons } from "@expo/vector-icons";
import { Box, Input, InputField, Pressable, Text } from "@gluestack-ui/themed";
import { HStack } from "@gluestack-ui/themed";

type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  onClear?: () => void;
};

export function SearchBar({ value, onChangeText, placeholder, onClear }: SearchBarProps) {
  return (
    <HStack alignItems="center" space="sm">
      <Box
        h="$10"
        w="$10"
        borderRadius="$md"
        bg="$white"
        borderWidth={1}
        borderColor="$coolGray200"
        alignItems="center"
        justifyContent="center"
      >
        <Ionicons name="search-outline" size={16} color="#475569" />
      </Box>

      <Input flex={1} bg="$white" borderColor="$coolGray200">
        <InputField value={value} onChangeText={onChangeText} placeholder={placeholder} />
      </Input>

      {value && onClear ? (
        <Pressable onPress={onClear}>
          <Box
            h="$10"
            px="$3"
            borderRadius="$md"
            bg="$coolGray200"
            alignItems="center"
            justifyContent="center"
          >
            <Text size="xs" bold color="$coolGray800">
              Limpar
            </Text>
          </Box>
        </Pressable>
      ) : null}
    </HStack>
  );
}
