import { Animated } from "react-native";
import { useEffect, useRef } from "react";

import { Ionicons } from "@expo/vector-icons";
import { Box, HStack, Pressable, Text } from "@gluestack-ui/themed";

import { useToastStore } from "@/src/shared/store/useToastStore";
import type { ToastType } from "@/src/shared/store/useToastStore";

const TOAST_ICONS: Record<
  ToastType,
  { name: keyof typeof Ionicons.glyphMap; bg: string; color: string }
> = {
  success: { name: "checkmark-circle-outline", bg: "$emerald100", color: "#047857" },
  error: { name: "alert-circle-outline", bg: "$red100", color: "#dc2626" },
  info: { name: "information-circle-outline", bg: "$blue100", color: "#1d4ed8" },
};

function ToastItem({ id, message, type }: { id: string; message: string; type: ToastType }) {
  const removeToast = useToastStore((s) => s.removeToast);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const iconConfig = TOAST_ICONS[type];

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <Pressable onPress={() => removeToast(id)}>
        <Box
          mx="$4"
          mb="$2"
          px="$4"
          py="$3"
          borderRadius="$xl"
          bg={iconConfig.bg}
          borderWidth={1}
          borderColor="$coolGray200"
          sx={{ shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}
        >
          <HStack alignItems="center" space="sm">
            <Ionicons name={iconConfig.name} size={20} color={iconConfig.color} />
            <Text flex={1} size="sm" color="$coolGray800">
              {message}
            </Text>
          </HStack>
        </Box>
      </Pressable>
    </Animated.View>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <Box position="absolute" top={60} left={0} right={0} zIndex={9999}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} id={toast.id} message={toast.message} type={toast.type} />
      ))}
    </Box>
  );
}
