"use client";

import { useState, useEffect } from "react";
import { Box, Heading, VStack, SimpleGrid } from "@chakra-ui/react";
import WeeklySummary from "./components/WeeklySummary";
import DailySummary from "./components/DailySummary";
import AmalanChart from "./components/AmalanChart";
import AmalanList from "./components/AmalanList";

const TholibDashboard = () => {
  // State untuk ringkasan amalan harian dan mingguan
  const [weeklyData, setWeeklyData] = useState({ totalAmalan: 0, completedAmalan: 0 });
  const [dailyData, setDailyData] = useState({ totalAmalan: 0, completedAmalan: 0 });

  // Data untuk chart amalan mingguan
  const [chartData, setChartData] = useState([
    { name: "Senin", value: 5 },
    { name: "Selasa", value: 3 },
    { name: "Rabu", value: 4 },
    { name: "Kamis", value: 6 },
    { name: "Jumat", value: 2 },
    { name: "Sabtu", value: 7 },
    { name: "Ahad", value: 5 },
  ]);

  // Daftar amalan harian
  const [amalanList, setAmalanList] = useState([
    { name: "Sholat Tahajud", completed: true },
    { name: "Tilawah 1 Juz", completed: false },
    { name: "Sholat Dhuha", completed: true },
    { name: "Sedekah Subuh", completed: false },
  ]);

  // Simulasi pengambilan data dari API
  useEffect(() => {
    setWeeklyData({ totalAmalan: 30, completedAmalan: 25 });
    setDailyData({ totalAmalan: 5, completedAmalan: 3 });
  }, []);

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>
        Dashboard Tholib
      </Heading>

      <VStack spacing={6} align="stretch">
        {/* Ringkasan Amalan Mingguan dan Harian */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <WeeklySummary totalAmalan={weeklyData.totalAmalan} completedAmalan={weeklyData.completedAmalan} />
          <DailySummary totalAmalan={dailyData.totalAmalan} completedAmalan={dailyData.completedAmalan} />
        </SimpleGrid>

        {/* Grafik Amalan Mingguan */}
        <AmalanChart data={chartData} />

        {/* Daftar Amalan Harian */}
        <AmalanList items={amalanList} />
      </VStack>
    </Box>
  );
};

export default TholibDashboard;
