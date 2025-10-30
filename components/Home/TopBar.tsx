"use client";

import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

type TopBarProps = {
  city: string;
  dateLabel: string; // e.g. "8 Jumadil Awal 1447 H — Kamis, 30 Oktober 2025"
};

export default function TopBar({ city, dateLabel }: TopBarProps) {
  const subtle = useColorModeValue("gray.600", "gray.300");
  const ring = useColorModeValue("gray.200", "gray.700");
  const bg = useColorModeValue("white", "gray.800");

  return (
    <Box
      bg={bg}
      borderBottomWidth="1px"
      borderColor={ring}
      px={4}
      py={2}
    >
      <Flex justify="space-between" align="center" gap={3} wrap="wrap">
        <Text fontWeight="semibold">{city}</Text>
        <Text fontSize="sm" color={subtle}>
          {dateLabel}
        </Text>
      </Flex>
    </Box>
  );
}

