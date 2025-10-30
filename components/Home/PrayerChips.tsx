"use client";

import { Box, HStack, Icon, Text, useColorModeValue, SimpleGrid, VStack } from "@chakra-ui/react";
import { PrayerKey, PrayerTime } from "@/utils/time";
import { Sun, Sunrise, Sunset, CloudSun, Moon } from "lucide-react";

type Props = {
  items: PrayerTime[];
  upcomingKey: PrayerKey;
  fullWidth?: boolean;
  showTime?: boolean;
  onHero?: boolean; // inverted style for hero background (transparent bg, white text)
};

const iconFor = (key: PrayerKey) => {
  switch (key) {
    case 'subuh':
      return Moon;
    case 'terbit':
      return Sunrise;
    case 'dzuhur':
      return Sun;
    case 'ashar':
      return CloudSun;
    case 'maghrib':
      return Sunset;
    case 'isya':
      return Moon;
    default:
      return Sun;
  }
};

export default function PrayerChips({ items, upcomingKey, fullWidth = false, showTime = true, onHero = false }: Props) {
  const ring = onHero ? 'whiteAlpha.400' : useColorModeValue("gray.200", "gray.700");
  const subtle = onHero ? 'whiteAlpha.800' : useColorModeValue("gray.600", "gray.300");
  const textColor = onHero ? 'white' : undefined;

  // Sembunyikan jadwal yang sedang menjadi next prayer
  const visible = items.filter((p) => p.key !== upcomingKey);

  const Chip = (p: PrayerTime) => {
    const I = iconFor(p.key);
    return (
      <Box
        key={p.key}
        px={2}
        py={2}
        borderWidth="1px"
        borderColor={ring}
        bg={onHero ? 'transparent' : 'white'}
        borderRadius="xl"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <VStack spacing={0.5} minW="56px" align="center" justify="center">
          <Icon as={I} boxSize={4} color={textColor} />
          <Text fontSize="10px" fontWeight="semibold" color={textColor}>{p.label}</Text>
          {showTime && <Text fontSize="10px" color={subtle}>{p.time}</Text>}
        </VStack>
      </Box>
    );
  };

  if (fullWidth) {
    return (
      <SimpleGrid columns={Math.max(1, visible.length)} spacing={2} px={4} py={1}>
        {visible.map((p) => Chip(p))}
      </SimpleGrid>
    );
  }

  return (
    <HStack spacing={3} overflowX="auto" px={4} py={1}>
      {visible.map((p) => Chip(p))}
    </HStack>
  );
}
