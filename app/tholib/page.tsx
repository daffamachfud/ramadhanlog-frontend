"use client";

import { useState, useEffect } from "react";
import { Box, VStack, SimpleGrid, Text } from "@chakra-ui/react";
import DailySummary from "./components/DailySummary";
import AmalanChart from "./components/AmalanChart";
import ReminderHadist from "./components/ReminderHadist";
import withAuth from "@/app/utils/withAuth";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";
import moment from "moment-hijri";
import PrayerTimesHeader from "./components/PrayerTimesHeader";

const TholibDashboard = () => {
  // State untuk ringkasan amalan harian dan mingguan
  const [dailyData, setDailyData] = useState({
    totalAmalan: 21,
    completedAmalan: 0,
  }); // Total 21 amalan
  const [loading, setLoading] = useState(true);
  // Data untuk chart mingguan
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );

  // Daftar amalan harian
  const [amalanList, setAmalanList] = useState<
    { name: string; completed: boolean }[]
  >([]);

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
    HijriDate: "-"
  });

  // Simulasi pengambilan data dari API
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const cookies = parseCookies();
        const token = cookies.token;
        if (!token){
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
        const { ringkasanHarian, dataPerminggu, statusAmalan } = data;

        console.log("Data dari API:", data);
        console.log("dataPerminggu:", dataPerminggu);

        // Update state dengan data dari backend
        setDailyData({
          totalAmalan: 21, // Total tetap 21
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
