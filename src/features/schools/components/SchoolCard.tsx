import { Box, HStack, Pressable, Text, VStack } from "@gluestack-ui/themed";

import type { School } from "@/src/features/schools/types";

type SchoolCardProps = {
  school: School;
  onPress: (school: School) => void;
};

export function SchoolCard({ school, onPress }: SchoolCardProps) {
  const isEmpty = school.classCount === 0;
  const initials = school.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Pressable
      onPress={() => onPress(school)}
      sx={{ _pressed: { opacity: 0.85, transform: [{ scale: 0.985 }] } }}
    >
      <Box
        borderWidth={1}
        borderColor="$coolGray300"
        borderRadius="$lg"
        p="$4"
        bg="$white"
        minHeight={124}
      >
        <VStack space="md">
          <HStack justifyContent="space-between" alignItems="center">
            <HStack alignItems="center" space="sm" flex={1}>
              <Box
                w="$10"
                h="$10"
                borderRadius="$full"
                bg={isEmpty ? "$amber100" : "$blue100"}
                alignItems="center"
                justifyContent="center"
              >
                <Text size="sm" bold color={isEmpty ? "$amber700" : "$blue700"}>
                  {initials}
                </Text>
              </Box>
              <VStack flex={1}>
                <Text size="lg" bold numberOfLines={1}>
                  {school.name}
                </Text>
                <Text size="xs" color="$coolGray600" numberOfLines={1}>
                  {school.address}
                </Text>
              </VStack>
            </HStack>

            <Box
              px="$2"
              py="$1"
              borderRadius="$full"
              bg={isEmpty ? "$amber100" : "$emerald100"}
            >
              <Text size="xs" color={isEmpty ? "$amber800" : "$emerald800"}>
                {isEmpty ? "Sem turmas" : "Ativa"}
              </Text>
            </Box>
          </HStack>

          <HStack justifyContent="space-between" alignItems="center">
            <Text size="sm" color="$coolGray700">
              {school.classCount} turma(s)
            </Text>
          </HStack>

          <HStack justifyContent="flex-end" alignItems="center">
            <Text size="sm" color="$blue700" bold>
              Ver turmas {">"}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  );
}
