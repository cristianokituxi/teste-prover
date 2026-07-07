import { Box, Spinner, VStack } from "@gluestack-ui/themed";

export function Loading() {
  return (
    <VStack space="sm" alignItems="center" py="$8">
      <Spinner size="large" />
    </VStack>
  );
}

export function Skeleton() {
  return (
    <VStack space="sm">
      <Box h={120} borderRadius="$lg" bg="$coolGray200" opacity={0.5} />
      <Box h={120} borderRadius="$lg" bg="$coolGray200" opacity={0.4} />
      <Box h={120} borderRadius="$lg" bg="$coolGray200" opacity={0.3} />
    </VStack>
  );
}
