import { Ionicons } from "@expo/vector-icons";
import { Box, Button, ButtonText, Text, VStack } from "@gluestack-ui/themed";

type EmptyStateProps = {
  iconName?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  iconName = "cube-outline",
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Box bg="$white" p="$6" borderRadius="$2xl" borderWidth={1} borderColor="$coolGray200">
      <VStack alignItems="center" space="sm">
        <Box
          w="$12"
          h="$12"
          borderRadius="$full"
          bg="$coolGray100"
          alignItems="center"
          justifyContent="center"
        >
          <Ionicons name={iconName} size={22} color="#334155" />
        </Box>
        <Text size="lg" bold textAlign="center">
          {title}
        </Text>
        <Text size="sm" color="$coolGray600" textAlign="center">
          {message}
        </Text>
        {actionLabel && onAction ? (
          <Button mt="$2" onPress={onAction}>
            <ButtonText>{actionLabel}</ButtonText>
          </Button>
        ) : null}
      </VStack>
    </Box>
  );
}
