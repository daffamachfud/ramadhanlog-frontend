"use client";

import { useState, useEffect } from "react";
import { Box, VStack, SimpleGrid, Text } from "@chakra-ui/react";
import DailySummary from "./components/DailySummary";
import AmalanChart from "./components/AmalanChart";
import AmalanList from "./components/AmalanList";
import withAuth from "@/app/utils/withAuth";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";
import moment from "moment-hijri";

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

  // Simulasi pengambilan data dari API
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const cookies = parseCookies();
        const token = cookies.token;
        if (!token) return;

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
        const { ringkasanHarian, dataPerminggu, statusAmalan } = data;

        console.log("Data dari API:", data);
        console.log("dataPerminggu:", dataPerminggu);

        // Update state dengan data dari backend
        setDailyData({
          totalAmalan: 20, // Total tetap 17
          completedAmalan: ringkasanHarian.completed,
        });

        setChartData(
          dataPerminggu.map((item: { name: string; value: number }) => ({
            name: item.name,
            value: item.value,
          }))
        );

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

  // Fungsi untuk mendapatkan tanggal dalam format "Senin, 26 Februari 2025"
  const getFormattedDate = (): string => {
    const today = new Date();
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(today);
  };

  return (
    <Box p={6}>
      <Text fontSize="md" fontWeight="bold" mb={2} textAlign="center">
        📅 {hijriDate}
      </Text>
      <Text fontSize="small" fontWeight="bold" mb={3} textAlign="center">
        {getFormattedDate()}
      </Text>

      <VStack spacing={6} align="stretch">
        {/* Ringkasan Amalan Mingguan dan Harian */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <DailySummary
            totalAmalan={dailyData.totalAmalan}
            completedAmalan={dailyData.completedAmalan}
          />
        </SimpleGrid>

        {/* Grafik Amalan Mingguan */}
        <AmalanChart data={chartData} />

        {/* Daftar Amalan Harian */}
        <AmalanList items={amalanList} />
      </VStack>
    </Box>
  );
};

export default withAuth(TholibDashboard, ["tholib"]);
