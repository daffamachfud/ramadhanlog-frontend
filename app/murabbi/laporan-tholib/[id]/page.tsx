"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Spinner,
  Text,
  Button,
  HStack,
  VStack,
  Badge,
  SimpleGrid,
  IconButton,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { ArrowBackIcon, QuestionIcon } from "@chakra-ui/icons";
import { useEffect, useState, useRef } from "react";
import { fetchDetailLaporanTholib } from "../laporanTholibService";
import { DetailLaporanTholib } from "../types";
import AmalanChart from "@/app/tholib/components/AmalanChart";

export default function LaporanTholibDetail() {
  const { id } = useParams();
  const router = useRouter();
  const params = useSearchParams();
  const name = params.get("name") || "Nama Tidak Diketahui";
  const [loading, setLoading] = useState(true);
  const [selectedHijriDate, setSelectedHijriDate] = useState<string | null>(
    null
  );
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  );
  const [amalanList, setAmalanList] = useState<
    { nama_amalan: string; description: string; status: boolean }[]
  >([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!id) return;
  
    async function loadInitialData() {
      try {
        setLoading(true);
        const response = await fetchDetailLaporanTholib(id.toString(), "");
  
        if (response) {
          console.log("📌 API Initial Response:", response);
          setChartData(response.line_chart || []);
          setAvailableDates(response.button_dates || []);
  
          if (!selectedHijriDate && response.hijri_current_date) {
            console.log("🟢 Set Default Hijri Date:", response.hijri_current_date);
            setSelectedHijriDate(response.hijri_current_date);
          }
  
          setAmalanList(response.amalan_list || []);
        }
      } catch (error) {
        console.error("❌ Gagal mengambil laporan:", error);
      } finally {
        setLoading(false);
      }
    }
  
    loadInitialData();
  }, [id]); // ✅ Load hanya saat `id` berubah
  
  // 🔥 Trigger API ulang setelah `selectedHijriDate` tersedia
  useEffect(() => {
    if (!id || !selectedHijriDate) return;
  
    async function reloadWithHijriDate() {
      try {
        setLoading(true);
        console.log("🔥 API Dipanggil ulang dengan selectedHijriDate:", selectedHijriDate);
        const response = await fetchDetailLaporanTholib(id.toString(), selectedHijriDate || "");
  
        if (response) {
          console.log("📌 API Response with Date:", response);
          setChartData(response.line_chart || []);
          setAmalanList(response.amalan_list || []);
        }
      } catch (error) {
        console.error("❌ Gagal mengambil laporan dengan tanggal:", error);
      } finally {
        setLoading(false);
      }
    }
  
    reloadWithHijriDate();
  }, [id, selectedHijriDate]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current && selectedHijriDate) {
      const selectedDay = selectedHijriDate.split(" ")[0].trim();
      console.log("🟢 Selected Day:", selectedDay);

      // ✅ Cari button berdasarkan data-day (bukan textContent)
      const selectedButton = scrollRef.current.querySelector(
        `button[data-day="${selectedDay}"]`
      );

      console.log(
        "🔴 Selected Button Found:",
        selectedButton ? "✅ Yes" : "❌ No"
      );

      selectedButton?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedHijriDate]); // 🔥 Jalankan setiap kali tanggal berubah

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" mt={4}>
      {/* Tombol Kembali */}
      <HStack spacing={3} justify="space" align="center" mb={4}>
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Kembali"
          onClick={() => router.back()}
          colorScheme="blue"
          variant="ghost"
          size="md"
        />
        <Box textAlign="center" flex="1">
          <Heading size="sm">{name}</Heading>
        </Box>
        <IconButton
          icon={<QuestionIcon />}
          aria-label="Help"
          onClick={onOpen}
          colorScheme="gray"
          variant="ghost"
          size="md"
        />
      </HStack>

      {/* Line Chart */}
      <Box mt={4}>
        <AmalanChart data={chartData} />
      </Box>

      {/* Tombol Ramadhan Horizontal */}
      <Box mt={4} overflowX="auto" whiteSpace="nowrap" ref={scrollRef}>
        <HStack spacing={2} width="max-content">
          {availableDates.map((date, index) => {
            const day = date.split(" ")[0]; // Ambil angka saja, contoh "13"
            const isSelected = selectedHijriDate === date; // 🔥 Pastikan hanya satu button yang dipilih

            return (
              <Button
                key={`date-${index}`}
                size="sm"
                variant={
                  selectedHijriDate?.split(" ").slice(0, 2).join(" ") === date
                    ? "solid"
                    : "outline"
                } // ✅ Bandingkan hanya "13 Ramadhan"
                colorScheme={
                  selectedHijriDate?.split(" ").slice(0, 2).join(" ") === date
                    ? "blue"
                    : "gray"
                }
                className={
                  selectedHijriDate?.split(" ").slice(0, 2).join(" ") === date
                    ? "selected-date"
                    : ""
                }
                onClick={() => {
                  console.log(
                    "🔵 Button Clicked:",
                    date,
                    "🔥 Selected Hijri Date Sebelumnya:",
                    selectedHijriDate
                  );
                  setSelectedHijriDate(date);
                }}
                flexDirection="column"
                height="50px"
                borderRadius="md"
                data-day={day} // ✅ Tambahkan atribut data-day
              >
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color={
                    selectedHijriDate?.split(" ").slice(0, 2).join(" ") === date
                      ? "white"
                      : "gray.400"
                  }
                >
                  Rmd
                </Text>
                <Text fontSize="md">{day}</Text>
              </Button>
            );
          })}
        </HStack>
      </Box>

      {/* List Amalan dalam Dua Kolom */}
  <Box mt={8}>
  {loading ? (
    <Spinner size="lg" mt={4} />
  ) : amalanList.length > 0 ? (
    <SimpleGrid columns={[1, 2]} spacing={4}> {/* 1 kolom di mobile, 2 di tablet/desktop */}
      {amalanList.map((item, index) => (
        <Box
          key={index}
          p={3}
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          bg="gray.50"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <VStack align="start" spacing={1} flex="1">
            <Text fontWeight="bold" fontSize="sm">
              {item.nama_amalan}
            </Text>
            <Text fontSize="xs" color="gray.600">
              {item.description}
            </Text>
          </VStack>
          <Badge colorScheme={item.status ? "green" : "red"}>
            {item.status ? "Selesai" : "Belum"}
          </Badge>
        </Box>
      ))}
    </SimpleGrid>
  ) : (
    <Text mt={4}>Tidak ada data amalan pada tanggal ini.</Text>
  )}
</Box>

      {/* Modal Help */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Informasi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
            Laporan ini menampilkan grafik amalan dari bulan ramadhan.
            Untuk data lengkap nya bisa pilih per tanggal yang bisa dipilih
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Mengerti
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
