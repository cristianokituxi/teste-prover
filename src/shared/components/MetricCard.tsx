import { Ionicons } from "@expo/vector-icons";
import { Box, HStack, Text } from "@gluestack-ui/themed";

type MetricCardProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  badgeText: string;
  badgeTextColor: string;
  label: string;
  value: string | number;
};

export function MetricCard({
  iconName,
  iconColor,
  badgeText,
  badgeTextColor,
  label,
  value,
}: MetricCardProps) {
  return (
    <Box flex={1} bg="$white" p="$4" borderRadius="$xl" borderWidth={1} borderColor="$coolGray200">
      <HStack justifyContent="space-between" alignItems="center">
        <Ionicons name={iconName} size={18} color={iconColor} />
        <Text size="xs" color={badgeTextColor} bold>
          {badgeText}
        </Text>
      </HStack>
      <Text size="xs" color="$coolGray600" mt="$2">
        {label}
      </Text>
      <Text size="3xl" bold color="$coolGray900">
        {value}
      </Text>
    </Box>
  );
}
