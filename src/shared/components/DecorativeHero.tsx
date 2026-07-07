import { Box } from "@gluestack-ui/themed";
import type { ReactNode } from "react";

type DecorativeHeroProps = {
  children: ReactNode;
};

export function DecorativeHero({ children }: DecorativeHeroProps) {
  return (
    <Box
      bg="$blue700"
      borderRadius="$2xl"
      p="$5"
      overflow="hidden"
      sx={{
        shadowColor: "$blue900",
        shadowOpacity: 0.18,
        shadowRadius: 12,
      }}
    >
      <Box
        position="absolute"
        right={-24}
        top={-20}
        w={118}
        h={118}
        borderRadius={999}
        bg="$blue500"
        opacity={0.32}
      />
      <Box
        position="absolute"
        left={-22}
        bottom={-30}
        w={92}
        h={92}
        borderRadius={999}
        bg="$blue400"
        opacity={0.28}
      />
      {children}
    </Box>
  );
}
