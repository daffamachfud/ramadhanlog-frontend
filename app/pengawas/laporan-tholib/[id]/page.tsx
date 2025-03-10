"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Spinner,
  Text,
  Button,
  Select,
  FormControl,
  FormLabel,
  HStack,
  VStack,
  Badge,
  Switch
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchDetailLaporanTholib, fetchDetailLaporanTholibMingguan } from "../laporanTholibService";
import { DetailLaporanTholib } from "../types";
import AmalanChart from "@/app/tholib/components/AmalanChart";

export default function LaporanTholibDetail() {
  const { id } = useParams();
  const router = useRouter();
  const params = useSearchParams();
  const name = params.get("name") || "Nama Tidak Diketahui";
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"daily" | "weekly">("daily"); // State mode tampilan
  const [amalanPerHari, setAmalanPerHari] = useState<{ [key: string]: DetailLaporanTholib[] }>({});
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
  const [ringkasanMingguan, setRingkasanMingguan] = useState<{ name: string; value: number }[]>([]);

  const [availableDates, setAvailableDates] = useState<string[]>([]); // Daftar tanggal yang tersedia

  const [selectedDailyHijriDate, setSelectedDailyHijriDate] = useState<string | null>(null);
const [selectedWeeklyHijriDate, setSelectedWeeklyHijriDate] = useState<string | null>(null);


  useEffect(() => {
    if (!id) return;
  
    async function fetchInitialDate() {
      try {
        setLoading(true);
        const response = await fetchDetailLaporanTholib(id.toString(), "");
        console.log("Response (fetchInitialDate):", response);
  
        if (response && response.hijriDate) {
          const currentHijriDate = response.hijriDate; // Contoh: "3 Ramadhan 1446 H"
          const hijriParts = currentHijriDate.split(" "); // ["3", "Ramadhan", "1446", "H"]
          const formattedHijriDate = `${hijriParts[0]} ${hijriParts[1]} ${hijriParts[2]}`; // "3 Ramadhan 1446"
  
          // Buat daftar tanggal dari 1 hingga tanggal sekarang
          const currentHijriDay = parseInt(hijriParts[0]); // Ambil angka tanggalnya
          const datesArray = [];
          for (let i = 1; i <= currentHijriDay; i++) {
            datesArray.push(`${i} Ramadhan ${hijriParts[2]}`); // Format "1 Ramadhan 1446"
          }
  
          setAvailableDates(datesArray);
          setSelectedDailyHijriDate(formattedHijriDate); // Simpan dalam format yang benar
        }
      } catch (error) {
        console.error("Gagal mengambil tanggal awal:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchInitialDate();
  }, [id]);
  
  // Fetch laporan setelah selectedHijriDate tersedia
  useEffect(() => {
    if (!id || !mode) return;
  
    async function loadData() {
      try {
        setLoading(true);
  
        if (mode === "daily") {
          console.log("Fetching daily report for ID:", id, "and Hijri Date:", selectedDailyHijriDate);
          const response = await fetchDetailLaporanTholib(id.toString(), selectedDailyHijriDate || "");
          console.log("Response (daily):", response);
  
          if (response?.data) {
            setDetailLaporan(response.data);
          } else {
            setDetailLaporan([]);
          }
  
        } else {
          console.log("Fetching weekly report for ID:", id);
          const response = await fetchDetailLaporanTholibMingguan(id.toString());
          console.log("Response (weekly):", response);
  
          if (response && response.ringkasan_mingguan?.length > 0) {
            setAmalanPerHari(response.amalan);
            setRingkasanMingguan(response.ringkasan_mingguan);
            setChartData(
              response.ringkasan_mingguan.map((item: { name: string; value: number }) => ({
                name: item.name,
                value: item.value,
              }))
            );
  
            // Ambil tanggal pertama sebagai default jika belum ada selectedHijriDate
            if (!selectedWeeklyHijriDate) {
              setSelectedWeeklyHijriDate(response.ringkasan_mingguan[0].name);
            }
          } else {
            setAmalanPerHari({});
            setChartData([]);
            setSelectedWeeklyHijriDate(null); // Reset jika tidak ada data
          }
        }
      } catch (error) {
        console.error("Gagal mengambil laporan:", error);
      } finally {
        setLoading(false);
      }
    }
  
    loadData();
  }, [id, mode, selectedDailyHijriDate, selectedWeeklyHijriDate]);

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" mt={4}>
      {/* Tombol Kembali */}
      <Button colorScheme="gray" size="sm" onClick={() => router.back()} mb={4}>
        ← Kembali
      </Button>

      {/* Toggle Mode (Harian / Mingguan) */}
     {/* Tombol Pilih Mode (Daily / Weekly) */}
<HStack mt={2} spacing={2}>
  <Button
    size="sm"
    colorScheme={mode === "daily" ? "blue" : "gray"}
    onClick={() => setMode("daily")}
  >
    Harian
  </Button>
  <Button
    size="sm"
    colorScheme={mode === "weekly" ? "blue" : "gray"}
    onClick={() => setMode("weekly")}
  >
    Mingguan
  </Button>
</HStack>

      {/* Form Pilih Tanggal (Hanya untuk Mode Harian) */}
      {mode === "daily" && (
        <FormControl mt={4}>
          <FormLabel>Pilih Tanggal Hijriah</FormLabel>
          <Select
            placeholder="Pilih Tanggal"
            value={selectedDailyHijriDate || ""}
            onChange={(e) => setSelectedDailyHijriDate(e.target.value)}
          >
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Pilih Tanggal (Hanya untuk Mode Mingguan) */}
      {mode === "weekly" && ringkasanMingguan.length > 0 && (
        <Box mt={4} overflowX="auto" whiteSpace="nowrap">
          <HStack spacing={2} width="max-content">
            {ringkasanMingguan.map((item, index) => {
              // Jika belum ada selectedHijriDate, set default ke tanggal pertama
              if (!selectedWeeklyHijriDate && index === 0) {
                setSelectedWeeklyHijriDate(item.name);
              }

              return (
                <Button
                  key={index}
                  size="sm"
                  colorScheme={
                    selectedWeeklyHijriDate === item.name ? "blue" : "gray"
                  }
                  onClick={() => setSelectedWeeklyHijriDate(item.name)}
                >
                  {item.name}
                </Button>
              );
            })}
          </HStack>
        </Box>
      )}

      {/* Ringkasan Mingguan (Hanya untuk Mode Mingguan) */}
      {mode === "weekly" && <AmalanChart data={chartData} />}

      {/* Daftar Data Amalan */}
      <Box mt={8}>
        {loading ? (
          <Spinner size="lg" mt={4} />
        ) : mode === "daily" ? (
          // TAMPILAN MODE HARIAN
          detailLaporan.length > 0 ? (
            detailLaporan.map((item) => (
              <Box
                key={item.id}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
              >
                <HStack
                  justifyContent="space-between"
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                >
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" fontSize="sm">
                      {item.nama_amalan}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {item.description}
                    </Text>
                  </VStack>
                  <Box>
                    <Badge colorScheme={item.status ? "green" : "red"}>
                      {item.status ? "Selesai" : "Belum"}
                    </Badge>
                  </Box>
                </HStack>
              </Box>
            ))
          ) : (
            <Text mt={4}>Tidak ada data amalan pada tanggal ini.</Text>
          )
        ) : amalanPerHari[selectedWeeklyHijriDate || ""] ? (
          amalanPerHari[selectedWeeklyHijriDate || ""].map((item) => (
            <Box
              key={item.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="md"
            >
              <HStack
                justifyContent="space-between"
                p={3}
                borderWidth="1px"
                borderRadius="md"
              >
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold" fontSize="sm">
                    {item.nama_amalan}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    {item.description}
                  </Text>
                </VStack>
                <Box>
                  <Badge colorScheme={item.status ? "green" : "red"}>
                    {item.status ? "Selesai" : "Belum"}
                  </Badge>
                </Box>
              </HStack>
            </Box>
          ))
        ) : (
          <Text mt={4}>Tidak ada data amalan pada hari ini.</Text>
        )}
      </Box>
    </Box>
  );
}
