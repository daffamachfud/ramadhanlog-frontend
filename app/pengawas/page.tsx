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
import moment from "moment-hijri";
import { useRouter } from "next/navigation"; // Import Next.js router
import PrayerTimesHeader from "../tholib/components/PrayerTimesHeader";

moment.locale("en");

const DashboardMurabbi = () => {
  const router = useRouter(); // Inisialisasi router

  const [dashboardData, setDashboardData] = useState<{
    totalAnggota: number;
    reportedAnggota: number;
    anggotaReports: { id: number; user_name: string}[];
    avgTilawah: number;
  }>({
    totalAnggota: 0,
    reportedAnggota: 0,
    anggotaReports: [],
    avgTilawah: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [prayerTimes, setPrayerTimes] = useState<{
    Subuh: string;
    Dzuhur: string;
    Ashar: string;
    Maghrib: string;
    Isya: string;
  }>({
    Subuh: "-",
    Dzuhur: "-",
    Ashar: "-",
    Maghrib: "-",
    Isya: "-",
  });

  const goToDetail = (id: number, name: string) => {
    const encodedName = encodeURIComponent(name); // Encode nama untuk URL
    router.push(`/pengawas/sudah-laporan/${id}?name=${encodedName}`);
  };

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
        const response = await fetch(api.dashboardPengawas, {
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
            tholibReports: data.data.anggotaReports.map((t: any) => ({
              id: t.id,
              name: t.user_name, // Gunakan alias yang benar
              nama_halaqah: t.nama_halaqah, // Pastikan nama halaqah sesuai alias
            })),
          });

          // 🔹 Update waktu sholat jika tersedia
          if (data.data.prayerTimes) {
            setPrayerTimes({
              Subuh: data.data.prayerTimes.Subuh || "-",
              Dzuhur: data.data.prayerTimes.Dzuhur || "-",
              Ashar: data.data.prayerTimes.Ashar || "-",
              Maghrib: data.data.prayerTimes.Maghrib || "-",
              Isya: data.data.prayerTimes.Isya || "-",
            });
          }
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
      {/* <Heading mb={4}>Dashboard Murabbi</Heading> */}
      <PrayerTimesHeader prayerTimes={prayerTimes} />

      {/* Ringkasan Laporan */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <Card
          bg="green.100"
          cursor="pointer"
          onClick={() => router.push("/pengawas/sudah-laporan")} // Navigasi ke halaman baru
        >
          <CardBody
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Stat>
              <StatLabel>Total Sudah Laporan</StatLabel>
              <StatNumber>{dashboardData.reportedAnggota}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {(
                  (dashboardData.reportedAnggota / dashboardData.totalAnggota) *
                  100
                ).toFixed(1)}
                %
              </StatHelpText>
            </Stat>
            <Text fontSize="sm" textAlign="right" cursor="pointer">
              Lihat Detail
            </Text>
          </CardBody>
        </Card>

        {/* <Card bg="purple.100">
          <CardBody>
            <Stat>
              <StatLabel>Rata-rata Tilawah</StatLabel>
              <StatNumber>{formatTilawah(dashboardData.avgTilawah)}</StatNumber>
            </Stat>
          </CardBody>
        </Card> */}

        <Card
          bg="red.100"
          cursor="pointer"
          onClick={() => router.push("/pengawas/belum-laporan")} // Navigasi ke halaman baru
        >
          <CardBody>
            <Stat>
              <StatLabel>Total Belum Laporan</StatLabel>
              <StatNumber>
                {dashboardData.totalAnggota - dashboardData.reportedAnggota}
              </StatNumber>
            </Stat>
            <Text fontSize="sm" textAlign="right" cursor="pointer">
              Lihat Detail
            </Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Highlight Laporan Per Tholib */}
      <Heading size="sm" mt={6} mb={4}>
        Highlight Laporan Hari Ini
      </Heading>
      <VStack align="stretch" spacing={4}>
        {dashboardData.anggotaReports.length > 0 ? (
          dashboardData.anggotaReports.map((tholib) => (
            <Box
              key={tholib.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="md"
              cursor="pointer"
              _hover={{ bg: "gray.100" }} // Efek hover agar terlihat interaktif
              onClick={() => goToDetail(tholib.id, tholib.user_name)}
            >
              <HStack justifyContent="space-between">
                <Box>
                  <Text fontWeight="bold">{tholib.user_name}</Text>
                </Box>
                <Badge colorScheme="green">Sudah Laporan</Badge>
              </HStack>
            </Box>
          ))
        ) : (
          <Text textAlign="center" color="gray.500">
            Belum ada yang laporan hari ini.
          </Text>
        )}
      </VStack>
    </Box>
  );
};
export default withAuth(DashboardMurabbi, ["murabbi"]);
