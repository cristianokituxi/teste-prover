import { Ionicons } from "@expo/vector-icons";
import { Box, Button, HStack, Text, VStack } from "@gluestack-ui/themed";

import type { SchoolClass } from "@/src/features/classes/types";
import { SHIFT_LABELS } from "@/src/features/schools/types";
import type { Shift } from "../../schools/types";

type ClassCardProps = {
  classItem: SchoolClass;
  onEdit: (classItem: SchoolClass) => void;
  onDelete: (classItem: SchoolClass) => void;
};

const SHIFT_ICONS = {
  Morning: "sunny-outline",
  Afternoon: "partly-sunny-outline",
  Night: "moon-outline",
} as const satisfies Record<Shift, keyof typeof Ionicons.glyphMap>;

const SHIFT_COLORS: Record<Shift, string> = {
  Morning: "#b45309",
  Afternoon: "#0f766e",
  Night: "#4338ca",
};

export function ClassCard({ classItem, onEdit, onDelete }: ClassCardProps) {
  const shiftLabel = SHIFT_LABELS[classItem.shift] ?? classItem.shift;
  const shiftIcon = SHIFT_ICONS[classItem.shift];
  const shiftColor = SHIFT_COLORS[classItem.shift] ?? "#475569";

  return (
    <Box borderWidth={1} borderColor="$coolGray300" borderRadius="$xl" p="$4" bg="$white">
      <VStack space="md">
        <HStack justifyContent="space-between" alignItems="flex-start" space="sm">
          <VStack flex={1} space="xs">
            <Text size="lg" bold>
              {classItem.name}
            </Text>
            <HStack space="sm" alignItems="center">
              <Box alignSelf="flex-start" px="$2" py="$1" borderRadius="$full" bg="$blue100">
                <Text size="xs" color="$blue700">
                  {classItem.year}
                </Text>
              </Box>
              <Box alignSelf="flex-start" px="$2" py="$1" borderRadius="$full" bg="$coolGray100">
                <HStack space="xs" alignItems="center">
                  <Ionicons name={shiftIcon} size={12} color={shiftColor} />
                  <Text size="xs" color="$coolGray700">
                    {shiftLabel}
                  </Text>
                </HStack>
              </Box>
            </HStack>
          </VStack>
        </HStack>

        <HStack justifyContent="flex-end" alignItems="center" space="xs">
          <Button
            variant="outline"
            size="xs"
            onPress={() => onEdit(classItem)}
            accessibilityLabel="Editar turma"
            px="$2"
            minWidth="$0"
          >
            <Ionicons name="pencil-outline" size={16} color="#0f172a" />
          </Button>
          <Button
            variant="outline"
            action="negative"
            size="xs"
            onPress={() => onDelete(classItem)}
            accessibilityLabel="Excluir turma"
            px="$2"
            minWidth="$0"
          >
            <Ionicons name="trash-outline" size={16} color="#dc2626" />
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
