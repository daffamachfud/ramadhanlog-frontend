"use client";
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
import { QuestionIcon } from "@chakra-ui/icons";
import { useEffect, useState, useRef } from "react";
import { fetchAmalanLaporanTholib } from "@/app/pengawas/laporan-tholib/laporanTholibService";
import AmalanChart from "@/app/tholib/components/AmalanChart";

export default function LaporanAmalanPage() {
  const [loading, setLoading] = useState(true);
  const [selectedHijriDate, setSelectedHijriDate] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
  const [amalanList, setAmalanList] = useState<
    { nama_amalan: string; description: string; status: boolean }[]
  >([]);
  const [name, setName] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [hijriCurrentDate, setHijriCurrentDate] = useState<string>("");

  // Fetch pertama kali
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const response = await fetchAmalanLaporanTholib("");

        console.log("📦 Initial Response from API:");
        console.log("🟢 Hijri Current Date:", response?.hijri_current_date);
        console.log("📅 Button Dates:", response?.button_dates);
        console.log("📊 Line Chart:", response?.line_chart);
        console.log("📋 Amalan List:", response?.amalan_list);

        if (response) {
          setChartData(response.line_chart || []);
          setAvailableDates(response.button_dates || []);
          setAmalanList(response.amalan_list || []);
          setName(response.name || "");
          setHijriCurrentDate(response.hijri_current_date || "");
        }
      } catch (error) {
        console.error("❌ Gagal mengambil laporan:", error);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Set default selectedHijriDate setelah availableDates diisi
  useEffect(() => {
    if (availableDates.length > 0 && selectedHijriDate === "") {
      const defaultDate = availableDates.find((date) =>
        hijriCurrentDate.startsWith(date)
      ) || availableDates[availableDates.length - 1];

      console.log("📌 Auto-pilih default date:", defaultDate);
      setSelectedHijriDate(defaultDate);
    }
  }, [availableDates, hijriCurrentDate]);

  // Fetch ulang saat selectedHijriDate berubah
  useEffect(() => {
    if (!selectedHijriDate) return;

    async function reloadWithHijriDate() {
      try {
        setLoading(true);
        console.log("🔁 Fetch ulang untuk tanggal:", selectedHijriDate);

        const response = await fetchAmalanLaporanTholib(selectedHijriDate);

        console.log("📦 Response from API untuk tanggal:", selectedHijriDate);
        console.log("📊 Line Chart:", response?.line_chart);
        console.log("📋 Amalan List:", response?.amalan_list);

        if (response) {
          setChartData(response.line_chart || []);
          setAmalanList(response.amalan_list || []);
          setName(response.name || "");
        }
      } catch (error) {
        console.error("❌ Gagal mengambil laporan dengan tanggal:", error);
      } finally {
        setLoading(false);
      }
    }

    reloadWithHijriDate();
  }, [selectedHijriDate]);

  // Scroll ke button aktif
  useEffect(() => {
    if (scrollRef.current && selectedHijriDate) {
      const selectedDay = selectedHijriDate.split(" ")[0];
      const selectedButton = scrollRef.current.querySelector(
        `button[data-day="${selectedDay}"]`
      );

      console.log("🧭 Auto-scroll ke tanggal:", selectedDay, "| Found:", !!selectedButton);

      selectedButton?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedHijriDate]);

  // Debug log render
  console.log("🧪 Render State:");
  console.log("✅ selectedHijriDate:", selectedHijriDate);
  console.log("📆 availableDates:", availableDates);

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" mt={4}>
      <HStack spacing={2} justify="space-between" mb={4}>
        <Heading size="sm">Laporan - {name}</Heading>
        <IconButton
          icon={<QuestionIcon />}
          aria-label="Help"
          onClick={onOpen}
          colorScheme="gray"
          variant="ghost"
          size="md"
        />
      </HStack>

      <Box mt={4}>
        <AmalanChart data={chartData} />
      </Box>

      <Box mt={4} overflowX="auto" whiteSpace="nowrap" ref={scrollRef}>
        <HStack spacing={2} width="max-content">
          {availableDates.map((date, index) => {
            const [day, month] = date.split(" ");
            const isSelected = selectedHijriDate === date;

            return (
              <Button
                key={`date-${index}`}
                size="sm"
                variant={isSelected ? "solid" : "outline"}
                colorScheme={isSelected ? "blue" : "gray"}
                onClick={() => {
                  console.log("🖱️ Klik tanggal:", date);
                  setSelectedHijriDate(date);
                }}
                flexDirection="column"
                height="50px"
                borderRadius="md"
                data-day={day}
              >
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color={isSelected ? "white" : "gray.400"}
                >
                  {month}
                </Text>
                <Text fontSize="md">{day}</Text>
              </Button>
            );
          })}
        </HStack>
      </Box>

      <Box mt={8}>
        {loading ? (
          <Spinner size="lg" mt={4} />
        ) : amalanList.length > 0 ? (
          <SimpleGrid columns={[1, 2]} spacing={4}>
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Informasi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Laporan ini menampilkan grafik amalan selama 30 hari terakhir
              berdasarkan kalender Hijriah. Kamu bisa memilih tanggal tertentu
              untuk melihat detailnya.
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
