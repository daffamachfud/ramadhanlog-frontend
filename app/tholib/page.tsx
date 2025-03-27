"use client";

import { useState, useEffect } from "react";
import { Box, VStack, SimpleGrid, Flex, Icon, Text } from "@chakra-ui/react";
import DailySummary from "./components/DailySummary";
import AmalanChart from "./components/AmalanChart";
import ReminderHadist from "./components/ReminderHadist";
import withAuth from "@/app/utils/withAuth";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";
import moment from "moment-hijri";
import PrayerTimesHeader from "./components/PrayerTimesHeader";
import { useRouter } from "next/navigation";
import { FaChartBar } from "react-icons/fa";
import { ChevronRightIcon } from "@chakra-ui/icons";

const TholibDashboard = () => {
  // State untuk ringkasan amalan harian dan mingguan
  const [dailyData, setDailyData] = useState({
    totalAmalan: 20,
    completedAmalan: 0,
  }); // Total 20 amalan
  const [loading, setLoading] = useState(true);
  // Data untuk chart mingguan
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );

  // Daftar amalan harian
  const [amalanList, setAmalanList] = useState<
    { name: string; completed: boolean }[]
  >([]);

  const router = useRouter();

  const [prayerTimes, setPrayerTimes] = useState<{
    Subuh: string;
    Dzuhur: string;
    Ashar: string;
    Maghrib: string;
    Isya: string;
    HijriDate: string;
  }>({
    Subuh: "-",
    Dzuhur: "-",
    Ashar: "-",
    Maghrib: "-",
    Isya: "-",
    HijriDate: "-",
  });

  // Simulasi pengambilan data dari API
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const cookies = parseCookies();
        const token = cookies.token;
        if (!token) {
          window.location.href = "https://haizumapp.com";
          return;
        }

        const response = await fetch(api.dashboardTholib, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data dashboard");
        }

        const data = await response.json();
        const { ringkasanHarian, line_chart, statusAmalan } = data;

        console.log("Data dari API:", data);
        console.log("dataPerminggu:", line_chart);

        // Update state dengan data dari backend
        setDailyData({
          totalAmalan: 20, // Total tetap 21
          completedAmalan: ringkasanHarian.completed,
        });

        setChartData(line_chart || []);

        setAmalanList([
          ...(statusAmalan?.completed?.map((item: string) => ({
            name: item,
            completed: true,
          })) || []),
          ...(statusAmalan?.notCompleted?.map((item: string) => ({
            name: item,
            completed: false,
          })) || []),
        ]);

        if (data.prayerTimes) {
          setPrayerTimes(data.prayerTimes);
        }
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  moment.locale("en");

  // Format tanggal Hijriah dengan nama bulan dalam huruf Latin
  const hijriDate = moment().format("iD iMMMM iYYYY") + " H";
  return (
    <Box p={6}>
      <PrayerTimesHeader prayerTimes={prayerTimes} />

      <VStack spacing={6} align="stretch">
        {/* Ringkasan Amalan Mingguan dan Harian */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={4}
          borderRadius="lg"
          boxShadow="sm"
          bg="white"
          cursor="pointer"
          onClick={() => router.push("/wrapped")}
          _hover={{ boxShadow: "md", bg: "gray.100" }}
        >
          <Flex align="center">
            <Icon as={FaChartBar} boxSize={6} color="blue.500" mr={3} />{" "}
            {/* Icon Laporan */}
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              Lihat Raport Ramadhan
            </Text>
          </Flex>
          <ChevronRightIcon boxSize={6} color="gray.500" />
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <DailySummary
            totalAmalan={dailyData.totalAmalan}
            completedAmalan={dailyData.completedAmalan}
          />
        </SimpleGrid>

        {/* Reminder Hadis */}
        <ReminderHadist amalanList={amalanList} />

        {/* Grafik Amalan Mingguan */}
        <AmalanChart data={chartData} />
      </VStack>
    </Box>
  );
};

export default withAuth(TholibDashboard, ["tholib"]);
