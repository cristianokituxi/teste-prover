import { Box } from "@gluestack-ui/themed";
import type { ReactNode } from "react";
import { ScrollView, RefreshControl } from "react-native";

type ScreenContainerProps = {
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function ScreenContainer({ children, refreshing = false, onRefresh }: ScreenContainerProps) {
  return (
    <Box flex={1} bg="$coolGray50">
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 96 }}
        refreshControl={
          onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined
        }
      >
        {children}
      </ScrollView>
    </Box>
  );
}
