"use client";

import { useState, useEffect } from "react";
import { Box, Heading, Button, VStack, Text } from "@chakra-ui/react";
import IbadahList from "../laporan-amalan/components/IbadahList";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";

export default function LaporanAmalanPage() {
  const [filter, setFilter] = useState<"weekly" | "daily">("daily");
  const [loading, setLoading] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState([]);
  const [dailyReport, setDailyReport] = useState<DailyReport[]>([]);

  type DailyReport = {
    name: string;
    done: boolean;
  };

  // Tanggal sekarang
  const today = new Date();
  const formattedToday = format(today, "EEEE, dd MMMM yyyy", { locale: id });

  // Tanggal awal dan akhir minggu (Senin - Minggu)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Set ke Senin
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Set ke Minggu

  const formattedStartWeek = format(startOfWeek, "dd MMMM yyyy", { locale: id });
  const formattedEndWeek = format(endOfWeek, "dd MMMM yyyy", { locale: id });

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
        const { dataPerminggu, statusAmalan } = data;

        console.log("Data dari API:", data);
        
        // Format data mingguan
        const formattedWeekly = dataPerminggu.map((item: { name: string; value: number }) => ({
          day: item.name,
          completed: item.value,
          total: 17, // Sesuaikan dengan jumlah amalan total yang ada
        }));

        // Format data harian
        const formattedDaily: DailyReport[] = statusAmalan
        ? [
            ...(statusAmalan.completed?.map((item: string) => ({
              name: item,
              done: true,
            })) || []),
            ...(statusAmalan.notCompleted?.map((item: string) => ({
              name: item,
              done: false,
            })) || []),
          ]
        : [];

        setWeeklyReport(formattedWeekly);
        setDailyReport(formattedDaily);

      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <Box minH="100vh" p={6} bg="gray.100">
      <Box
        w={{ base: "100%", md: "500px" }}
        mx="auto"
        p={6}
        bg="white"
        boxShadow="md"
        borderRadius="md"
      >
        <Heading size="lg" textAlign="center" mb={4}>
          Laporan Amalan
        </Heading>

        {/* Informasi Tanggal */}
        <Text fontSize="sm" color="gray.600" textAlign="center" mb={2}>
          {filter === "daily"
            ? `Tanggal: ${formattedToday}`
            : `Minggu: ${formattedStartWeek} - ${formattedEndWeek}`}
        </Text>

        {/* Tombol Filter */}
        <VStack spacing={2} mb={4}>
          <Button
            colorScheme={filter === "daily" ? "blue" : "gray"}
            onClick={() => setFilter("daily")}
            w="full"
          >
            Harian
          </Button>
          <Button
            colorScheme={filter === "weekly" ? "blue" : "gray"}
            onClick={() => setFilter("weekly")}
            w="full"
          >
            Mingguan
          </Button>
        </VStack>

        {/* Daftar Ibadah */}
        <IbadahList filter={filter} weeklyData={weeklyReport} dailyData={dailyReport} />
      </Box>
    </Box>
  );
}
