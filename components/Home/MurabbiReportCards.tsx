"use client";

import { Box, SimpleGrid, VStack, HStack, Text, Heading, useColorModeValue, Icon } from "@chakra-ui/react";
import { CheckCircle2, AlertTriangle } from "lucide-react";

type Props = {
  reported: number;
  total: number;
  onClickReported?: () => void;
  onClickUnreported?: () => void;
};

export default function MurabbiReportCards({ reported, total, onClickReported, onClickUnreported }: Props) {
  const unreported = Math.max(0, total - reported);
  const ring = useColorModeValue("gray.200", "gray.700");

  const Card = ({
    color,
    bg,
    icon,
    count,
    title,
    help,
    onClick,
  }: {
    color: string;
    bg: string;
    icon: any;
    count: number;
    title: string;
    help: string;
    onClick?: () => void;
  }) => (
    <Box
      borderRadius="2xl"
      bg={bg}
      borderWidth="1px"
      borderColor={ring}
      boxShadow="sm"
      p={4}
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'default'}
      _hover={onClick ? { boxShadow: 'md', transform: 'translateY(-1px)' } : {}}
      transition="all 0.15s ease"
    >
      <VStack align="start" spacing={3}>
        <Icon as={icon} boxSize={6} color={color} />
        <Heading size="xl">{count}</Heading>
        <Text fontWeight="semibold">{title}</Text>
        <Text fontSize="sm" color="gray.600">{help}</Text>
      </VStack>
    </Box>
  );

  return (
    <SimpleGrid columns={2} gap={3} px={4}>
      <Card
        color="green.600"
        bg="green.50"
        icon={CheckCircle2}
        count={reported}
        title="Sudah Lapor (Hari Ini)"
        help={`Dari total ${total}`}
        onClick={onClickReported}
      />
      <Card
        color="red.600"
        bg="red.50"
        icon={AlertTriangle}
        count={unreported}
        title="Belum Lapor (Hari Ini)"
        help={`Dari total ${total}`}
        onClick={onClickUnreported}
      />
    </SimpleGrid>
  );
}
