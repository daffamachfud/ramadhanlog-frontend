"use client";

import { Box, Heading, HStack, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { Progress as ProgressType } from "./SmartCTA";

type Props = { progress: ProgressType };

export default function DailyProgressCard({ progress }: Props) {
  const bg = useColorModeValue("white", "gray.800");
  const ring = useColorModeValue("gray.200", "gray.700");
  const subtle = useColorModeValue("gray.600", "gray.300");

  const done = Math.max(0, progress.done || 0);
  const total = Math.max(1, progress.total || 1); // avoid /0
  const pct = Math.round((done / total) * 100);

  // SVG donut values
  const size = 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;

  return (
    <Box mx={4} my={4} p={4} bg={bg} borderWidth="1px" borderColor={ring} borderRadius="xl" boxShadow="sm">
      <Heading size="sm" mb={1}>Daily progress</Heading>
      <Text fontSize="xs" color={subtle} mb={3}>TODAY</Text>

      <HStack spacing={6} align="center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={useColorModeValue('#e5e7eb', '#374151')}
            strokeWidth={12}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={12}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <VStack align="start" spacing={1}>
          <Text fontWeight="semibold">{done}/{total} ({pct}%)</Text>
          <Text fontSize="sm" color={subtle}>{Math.max(0, total - done)} belum dilakukan</Text>
        </VStack>
      </HStack>
    </Box>
  );
}

