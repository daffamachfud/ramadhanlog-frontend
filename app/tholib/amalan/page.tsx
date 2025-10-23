"use client";

import { useState, useEffect } from "react";
import { Box, VStack, SimpleGrid, Flex, Icon, Text } from "@chakra-ui/react";
import withAuth from "@/app/utils/withAuth";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";
import moment from "moment-hijri";
import { useRouter } from "next/navigation";
import { FaChartBar } from "react-icons/fa";
import { ChevronRightIcon } from "@chakra-ui/icons";
import AmalanChart from "../components/AmalanChart";
import ReminderHadist from "../components/ReminderHadist";

const AmalanPage = () => {
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
    Terbit: string;
    Dzuhur: string;
    Ashar: string;
    Maghrib: string;
    Isya: string;
    HijriDate: string;
  }>({
    Subuh: "-",
    Terbit: "-",
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
  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Tanggal Hijriah dan Masehi */}
        <Flex direction="column" align="center" mt={4} mb={2}>
          <Text fontWeight="bold" fontSize="xl" color="gray.800">
            {prayerTimes.HijriDate}
          </Text>
          <Text fontSize="md" color="gray.500" mb={3}>
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Box>
            <Flex
              as="button"
              align="center"
              px={4}
              py={2}
              bg="green.500"
              color="white"
              fontWeight="semibold"
              borderRadius="md"
              _hover={{ bg: "green.600" }}
              _active={{ bg: "green.700" }}
              onClick={() => router.push("/tholib/catat-amalan")}
            >
              <Icon as={FaChartBar} mr={2} />
              Catat Amalan
              <ChevronRightIcon ml={2} />
            </Flex>
          </Box>
        </Flex>

        {/* Reminder Hadis */}
        <ReminderHadist amalanList={amalanList} />

        {/* Grafik Amalan Mingguan */}
        <AmalanChart data={chartData} hijriDate={prayerTimes.HijriDate} loading={loading} />
      </VStack>
    </Box>
  );
};

export default withAuth(AmalanPage, ["tholib"]);
