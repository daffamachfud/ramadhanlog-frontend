"use client";

import {
  Box,
  Heading,
  Spinner,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  VStack,
  HStack,
  Badge,
  Divider,
} from "@chakra-ui/react";
import withAuth from "@/app/utils/withAuth";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";

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

const DashboardMurabbi = () => {
  const [dashboardData, setDashboardData] = useState<{
    totalTholib: number;
    reportedTholib: number;
    tholibReports: { id: number; name: string; nama_halaqah: string }[];
    avgTilawah: number;
  }>({
    totalTholib: 0,
    reportedTholib: 0,
    tholibReports: [],
    avgTilawah: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token;
        if (!token) {
          setError("Anda harus login terlebih dahulu.");
          setLoading(false);
          return;
        }
        const response = await fetch(api.dashboardMurrabi, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          console.log("hasil data :", data.data);
          setDashboardData({
            ...data.data,
            tholibReports: data.data.tholibReports.map((t: any) => ({
              id: t.id,
              name: t.user_name, // Gunakan alias yang benar
              nama_halaqah: t.nama_halaqah, // Pastikan nama halaqah sesuai alias
            })),
          });
        } else {
          setError("Gagal mengambil data dashboard");
        }
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
        setError("Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Memuat data...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6} textAlign="center" color="red.500">
        <Text>{error}</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={4}>Dashboard Murabbi</Heading>

      {/* Ringkasan Laporan */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <Card bg="green.100">
          <CardBody>
            <Stat>
              <StatLabel>Tholib Sudah Laporan</StatLabel>
              <StatNumber>{dashboardData.reportedTholib}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {(
                  (dashboardData.reportedTholib / dashboardData.totalTholib) *
                  100
                ).toFixed(1)}
                %
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="purple.100">
          <CardBody>
            <Stat>
              <StatLabel>Rata-rata Tilawah</StatLabel>
              <StatNumber>{formatTilawah(dashboardData.avgTilawah)}</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="red.100">
          <CardBody>
            <Stat>
              <StatLabel>Tholib Belum Laporan</StatLabel>
              <StatNumber>
                {dashboardData.totalTholib - dashboardData.reportedTholib}
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Highlight Laporan Per Tholib */}
      <Heading size="md" mt={6} mb={4}>
        Highlight Laporan Tholib Hari Ini
      </Heading>
      <VStack align="stretch" spacing={4}>
        {dashboardData.tholibReports.length > 0 ? (
          dashboardData.tholibReports.map((tholib) => (
            <Box
              key={tholib.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="md"
            >
              <HStack justifyContent="space-between">
                <Box>
                  <Text fontWeight="bold">{tholib.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {tholib.nama_halaqah}
                  </Text>
                </Box>
                <Badge colorScheme="green">Sudah Laporan</Badge>
              </HStack>
            </Box>
          ))
        ) : (
          <Text textAlign="center" color="gray.500">
            Belum ada tholib yang laporan hari ini.
          </Text>
        )}
      </VStack>
    </Box>
  );
};
export default withAuth(DashboardMurabbi, ["murabbi"]);
