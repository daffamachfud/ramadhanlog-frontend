"use client";

import { Box, Flex, Heading, HStack, Text, Badge } from "@chakra-ui/react";

type Props = {
  city: string;
  dateLabel?: string; // deprecated single-line
  gregDate?: string; // e.g., "Kamis, 30 Oktober 2025 -"
  hijriDate?: string; // e.g., "8 Jumadil Awal 1447H"
  prayerLabel: string; // e.g., "Dzuhur"
  time: string; // e.g., "11:37"
  etaLabel: string; // e.g., "25m"
  children?: React.ReactNode; // optional bottom area (e.g., PrayerChips)
};

export default function HeroNextPrayer({ city, dateLabel, gregDate, hijriDate, prayerLabel, time, etaLabel, children }: Props) {
  return (
    <Box
      position="relative"
      bgGradient="linear(to-r, blue.500, cyan.400)"
      color="white"
      px={{ base: 4, md: 6 }}
      pt={{ base: 4, md: 5 }}
      pb={{ base: 6, md: 8 }}
      borderBottomLeftRadius={{ base: "2xl", md: "3xl" }}
      borderBottomRightRadius={{ base: "2xl", md: "3xl" }}
      overflow="hidden"
      boxShadow="md"
    >
      {/* soft decorative circles */}
      <Box position="absolute" top="-40" right="-20" w="60" h="60" bg="whiteAlpha.300" filter="blur(14px)" borderRadius="full" />
      <Box position="absolute" bottom="-36" left="-16" w="56" h="56" bg="whiteAlpha.200" filter="blur(18px)" borderRadius="full" />

      {/* header row: city at left, date at right */}
      <Flex zIndex={1} position="relative" justify="space-between" align="flex-start" wrap="nowrap" mb={3}>
        <Text fontWeight="bold" flexShrink={0} mt={0.5}>{city}</Text>
        <Box ml={4} flex="1" minW={0} textAlign="right">
          {gregDate || hijriDate ? (
            <>
              {gregDate && (
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" noOfLines={1}>
                  {gregDate}
                </Text>
              )}
              {hijriDate && (
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" opacity={0.95} noOfLines={1}>
                  {hijriDate}
                </Text>
              )}
              {!gregDate && !hijriDate && dateLabel && (
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" noOfLines={2}>
                  {dateLabel}
                </Text>
              )}
            </>
          ) : (
            dateLabel && (
              <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" noOfLines={2}>
                {dateLabel}
              </Text>
            )
          )}
        </Box>
      </Flex>

      {/* next prayer content */}
      <HStack zIndex={1} position="relative" align="center" justify="space-between">
        <Box>
          <Heading size={{ base: "lg", md: "xl" }}>{prayerLabel}</Heading>
          <Heading size={{ base: "2xl", md: "3xl" }} lineHeight={1} mt={1}>{time}</Heading>
        </Box>
        <Badge
          bgGradient="linear(to-r, yellow.300, yellow.500)"
          color="black"
          px={3}
          py={1}
          borderRadius="full"
          boxShadow="sm"
          fontWeight="semibold"
        >
          {etaLabel}
        </Badge>
      </HStack>

      {children ? (
        <Box mt={3}>
          {children}
        </Box>
      ) : null}
    </Box>
  );
}
