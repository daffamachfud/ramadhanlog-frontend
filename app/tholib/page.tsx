"use client";

import { useState, useEffect } from "react";
import { Box, VStack, SimpleGrid, Flex, Icon, Text, Skeleton, SkeletonText } from "@chakra-ui/react";
import DailySummary from "./components/DailySummary";
import AmalanChart from "./components/AmalanChart";
import ReminderHadist from "./components/ReminderHadist";
import withAuth from "@/app/utils/withAuth";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";
import moment from "moment-hijri";
import PrayerTimesHeader from "./components/PrayerTimesHeader";
import { useRouter } from "next/navigation";
import {
  FaChartBar,
  FaPen,
  FaQuran,
  FaBookOpen,
  FaHands,
} from "react-icons/fa";

const TholibDashboard = () => {
  // State untuk ringkasan amalan harian dan mingguan
  const [dailyData, setDailyData] = useState({
    totalAmalan: 0,
    completedAmalan: 0,
    hijriDate: ""
  });
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
        console.log("ringkasa harian:", ringkasanHarian);

        // Update state dengan data dari backend
        setDailyData({
          totalAmalan: ringkasanHarian.total,
          completedAmalan: ringkasanHarian.completed,
          hijriDate : ringkasanHarian.date
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

  return (
    <Box>
      <PrayerTimesHeader prayerTimes={prayerTimes} />

      <VStack spacing={6} align="stretch">
        {/* Ringkasan Amalan Mingguan dan Harian */}

        {/* Tambahan grid tombol menu */}
        <SimpleGrid columns={4} spacing={4} mt={4} px={4}>
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <Box
                  key={index}
                  bg="white"
                  p={2}
                  borderRadius="md"
                  boxShadow="sm"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Skeleton height="20px" width="20px" borderRadius="full" />
                  <Skeleton mt={1} height="10px" width="70%" />
                </Box>
              ))
            : [
                {
                  title: "Catat Amalan",
                  icon: FaPen,
                  link: "/tholib/catat-amalan",
                },
                {
                  title: "Al-Qur'an",
                  icon: FaQuran,
                  link: "/quran",
                  isComingSoon: true,
                },
                {
                  title: "Hadist",
                  icon: FaBookOpen,
                  link: "/hadist",
                  isComingSoon: true,
                },
                { title: "Doa", icon: FaHands, link: "/doa", isComingSoon: true },
                {
                  title: "Rapot Ramadhan",
                  icon: FaChartBar,
                  link: "/wrapped",
                  isNew: true,
                },
              ].map((item, index) => (
                <Box
                  key={index}
                  as="button"
                  onClick={() => {
                    if (item.isComingSoon) {
                      alert(
                        "Fitur ini sedang dalam proses pengembangan. InsyaAllah segera hadir untuk menemani ibadahmu. Mohon doanya ya 🙏"
                      );
                    } else {
                      router.push(item.link);
                    }
                  }}
                  bg="white"
                  p={2}
                  borderRadius="md"
                  boxShadow="sm"
                  _hover={{ bg: "gray.100", boxShadow: "md" }}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                >
                  <Icon as={item.icon} boxSize={5} color="blue.500" />
                  <Text
                    mt={1}
                    fontSize="x-small"
                    fontWeight="medium"
                    color="gray.700"
                  >
                    {item.title}
                  </Text>

                  {/* Badge "Baru" */}
                  {item.isNew && (
                    <Box
                      position="absolute"
                      top="0"
                      right="0"
                      bg="red.500"
                      color="white"
                      fontSize="xx-small"
                      fontWeight="bold"
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      transform="translate(30%, -30%)"
                      boxShadow="md"
                    >
                      Baru
                    </Box>
                  )}

                  {/* Badge "Coming Soon" */}
                  {item.isComingSoon && (
                    <Box
                      position="absolute"
                      top="0"
                      right="0"
                      bg="yellow.400"
                      color="black"
                      fontSize="6px"
                      fontWeight="bold"
                      px={1.5}
                      py={0.5}
                      borderRadius="full"
                      transform="translate(30%, -30%)"
                      boxShadow="md"
                    >
                      Coming Soon
                    </Box>
                  )}
                </Box>
              ))}
        </SimpleGrid>

        {/* Komponen lainnya bisa ditambahkan di sini */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {loading ? (
            <Box p={5} borderRadius="lg" boxShadow="md" bg="white">
              <SkeletonText noOfLines={1} skeletonHeight={4} w="40%" />
              <Flex justify="space-between" mt={4}>
                <VStack align="start" spacing={4} w="50%">
                  <Box>
                    <Skeleton height="20px" width="60px" mb={2} />
                    <Skeleton height="14px" width="140px" />
                  </Box>
                  <Box>
                    <Skeleton height="20px" width="60px" mb={2} />
                    <Skeleton height="14px" width="120px" />
                  </Box>
                </VStack>
                <Skeleton height="90px" width="90px" borderRadius="full" />
              </Flex>
            </Box>
          ) : (
            <DailySummary
              totalAmalan={dailyData.totalAmalan}
              completedAmalan={dailyData.completedAmalan}
              hijriDate={dailyData.hijriDate}
            />
          )}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default withAuth(TholibDashboard, ["tholib"]);
