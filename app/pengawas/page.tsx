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
  Flex,
  Icon
} from "@chakra-ui/react";
import withAuth from "@/app/utils/withAuth";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";
import moment from "moment-hijri";
import { useRouter } from "next/navigation"; // Import Next.js router
import HeroNextPrayer from "@/components/Home/HeroNextPrayer";
import PrayerChips from "@/components/Home/PrayerChips";
import QuickLinks from "@/components/Home/QuickLinks";
import MurabbiReportCards from "@/components/Home/MurabbiReportCards";
import SmartCTA from "@/components/Home/SmartCTA";
import { PrayerKey, PrayerTime, diffNowMinutes, formatEtaLabel, findUpcoming } from "@/utils/time";

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
    Terbit: string;
    Dzuhur: string;
    Ashar: string;
    Maghrib: string;
    Isya: string;
    HijriDate: string
  }>({
    Subuh: "-",
    Terbit: "-",
    Dzuhur: "-",
    Ashar: "-",
    Maghrib: "-",
    Isya: "-",
    HijriDate: "-"
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
              Terbit: data.data.prayerTimes.Terbit || "-",
              Dzuhur: data.data.prayerTimes.Dzuhur || "-",
              Ashar: data.data.prayerTimes.Ashar || "-",
              Maghrib: data.data.prayerTimes.Maghrib || "-",
              Isya: data.data.prayerTimes.Isya || "-",
              HijriDate: data.data.prayerTimes.HijriDate || "-"
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

  // Map prayerTimes into PrayerTime[] safely
  const toHHMM = (t: string): `${number}${number}:${number}${number}` => {
    const s = t && t.includes(":") ? t : "00:00";
    return s as `${number}${number}:${number}${number}`;
  };
  const prayers: PrayerTime[] = [
    { key: 'subuh', label: 'Subuh', time: toHHMM(prayerTimes.Subuh) },
    { key: 'terbit', label: 'Terbit', time: toHHMM(prayerTimes.Terbit) },
    { key: 'dzuhur', label: 'Dzuhur', time: toHHMM(prayerTimes.Dzuhur) },
    { key: 'ashar', label: 'Ashar', time: toHHMM(prayerTimes.Ashar) },
    { key: 'maghrib', label: 'Maghrib', time: toHHMM(prayerTimes.Maghrib) },
    { key: 'isya', label: 'Isya', time: toHHMM(prayerTimes.Isya) },
  ];
  const upKey: PrayerKey = (findUpcoming(prayers) as PrayerKey) || 'dzuhur';
  const nextItem = prayers.find((p) => p.key === upKey) || prayers[2];
  const etaMin = diffNowMinutes(nextItem.time);
  const etaLabel = formatEtaLabel(Number.isNaN(etaMin) ? 0 : etaMin);
  const gregDate = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()) + ' -';

  return (
    <Box>
      <HeroNextPrayer
        city="Bandung"
        gregDate={gregDate}
        hijriDate={prayerTimes.HijriDate}
        prayerLabel={nextItem.label}
        time={nextItem.time}
        etaLabel={etaLabel || "Sudah Masuk Waktu"}
      >
        <PrayerChips
          items={prayers}
          upcomingKey={upKey}
          fullWidth
          showTime
          onHero
        />
      </HeroNextPrayer>

      <Box mt={2}>
        <QuickLinks />
      </Box>

       {/* CTA untuk mencatat amalan pengawas */}
      <VStack spacing={3} align="stretch" mt={2}>
        <SmartCTA href="/pengawas/catat-amalan" labelBase="Catat Amalan" />
      </VStack>

      {/* Ringkasan Laporan modern */}
      <Box mt={3}>
        <MurabbiReportCards
          reported={dashboardData.reportedAnggota}
          total={dashboardData.totalAnggota}
          onClickReported={() => router.push("/pengawas/sudah-laporan")}
          onClickUnreported={() => router.push("/pengawas/belum-laporan")}
        />
      </Box>


      {/* Highlight Laporan Hari Ini
      <Heading size="sm" mt={6} mb={3} p={2}>
        Highlight Laporan Hari Ini
      </Heading>
      <VStack align="stretch" spacing={3} px={4}>
        {dashboardData.anggotaReports.length > 0 ? (
          dashboardData.anggotaReports.map((tholib) => (
            <Box
              key={tholib.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="sm"
              cursor="pointer"
              _hover={{ bg: "gray.50" }}
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
      </VStack> */}
    </Box>
  );
};
export default withAuth(DashboardMurabbi, ["pengawas"]);
