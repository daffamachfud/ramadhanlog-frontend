"use client";

import { Box, Flex, Heading, Text, Badge, useColorModeValue } from "@chakra-ui/react";

type Props = {
  title: string; // e.g., "Next prayer: Dzuhur"
  time: string; // e.g., "11:37"
  etaLabel: string; // e.g., "25m"
};

export default function NextPrayerCard({ title, time, etaLabel }: Props) {
  const ring = useColorModeValue("gray.200", "gray.700");
  return (
    <Box
      mx={4}
      mt={4}
      borderRadius="xl"
      className="shadow-card"
      overflow="hidden"
      bgGradient="linear(to-r, blue.400, cyan.400)"
      color="white"
    >
      <Flex align="center" justify="space-between" px={5} py={5}>
        <Box>
          <Text fontSize="sm" opacity={0.9}>
            {title}
          </Text>
          <Heading size="2xl" lineHeight={1} mt={1}>
            {time}
          </Heading>
        </Box>
        <Badge bg="white" color="black" px={3} py={1} borderRadius="full" boxShadow="md">
          {etaLabel}
        </Badge>
      </Flex>
    </Box>
  );
}

