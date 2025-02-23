"use client";

import { Box, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Card, CardBody, VStack, HStack, Badge, Divider } from "@chakra-ui/react";

// Contoh data laporan harian (dummy data, nanti bisa diganti dengan fetch dari API)
const dailyReport = {
  totalTholib: 20, // Total tholib dalam halaqah
  reportedTholib: 15, // Tholib yang sudah mengisi laporan hari ini
  tholibReports: [
    { name: "Ahmad", completedAmalan: ["Bangun + Wudhu", "Tilawah 1 Juz", "Sholat Dhuha"], tilawah: 1 },
    { name: "Ali", completedAmalan: ["Sahur dalam Keadaan Suci", "Ifthor ala Nabi", "Sedekah Subuh"], tilawah: 0 },
    { name: "Zainab", completedAmalan: ["Sholat Sunnah 2 Rakaat", "Sholat Tarawih 11 Rakaat", "Tafakur Harian"], tilawah: 1 },
    { name: "Fatimah", completedAmalan: ["Bangun + Wudhu", "Sholat Sunnah 2 Rakaat", "Tilawah 1 Juz"], tilawah: 1 },
  ],
};

// Hitung rata-rata Tilawah
const totalTilawah = dailyReport.tholibReports.reduce((acc, tholib) => acc + tholib.tilawah, 0);
const avgTilawah = totalTilawah / dailyReport.reportedTholib;

const formatTilawah = (value: number): string => {
  const fractionMap: Record<number, string> = {
    0.1: "Sepersepuluh Juz",
    0.2: "Seperlima Juz",
    0.25: "Seperempat Juz",
    0.3: "Tiga Persepuluh Juz",
    0.33: "Sepertiga Juz",
    0.4: "Dua Perlima Juz",
    0.5: "Setengah Juz",
    0.6: "Tiga Perlima Juz",
    0.66: "Dua Pertiga Juz",
    0.75: "Tiga Perempat Juz",
    0.8: "Empat Perlima Juz",
    0.9: "Sembilan Persepuluh Juz",
  };

  if (Number.isInteger(value)) return `${value} Juz`;
  
  const roundedValue = parseFloat(value.toFixed(2)); // Dibulatkan ke 2 angka desimal untuk pencocokan
  
  return fractionMap[roundedValue] || `${roundedValue} Juz`;
};

export default function DashboardMurabbi() {
  return (
    <Box p={6}>
      <Heading mb={4}>Dashboard Murabbi</Heading>

      {/* Ringkasan Laporan */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <Card bg="green.100">
          <CardBody>
            <Stat>
              <StatLabel>Tholib Sudah Laporan</StatLabel>
              <StatNumber>{dailyReport.reportedTholib}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {((dailyReport.reportedTholib / dailyReport.totalTholib) * 100).toFixed(1)}%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="purple.100">
          <CardBody>
            <Stat>
              <StatLabel>Rata-rata Tilawah</StatLabel>
              <StatNumber>{formatTilawah(avgTilawah)}</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="red.100">
          <CardBody>
            <Stat>
              <StatLabel>Tholib Belum Laporan</StatLabel>
              <StatNumber>{dailyReport.totalTholib - dailyReport.reportedTholib}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Highlight Laporan Per Tholib */}
      <Heading size="md" mt={6} mb={4}>
        Highlight Laporan Tholib Hari Ini
      </Heading>
      <VStack align="stretch" spacing={4}>
        {dailyReport.tholibReports.map((tholib) => (
          <Box key={tholib.name} p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
            <HStack justifyContent="space-between">
              <Text fontWeight="bold">{tholib.name}</Text>
              <Badge colorScheme="green">{tholib.completedAmalan.length} Amalan</Badge>
            </HStack>
            <Divider my={2} />
            <HStack spacing={2} wrap="wrap">
              {tholib.completedAmalan.map((amalan) => (
                <Badge key={amalan} colorScheme="blue">
                  {amalan}
                </Badge>
              ))}
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
