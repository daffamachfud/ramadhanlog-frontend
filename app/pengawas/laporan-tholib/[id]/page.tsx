"use client";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Spinner,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  HStack,
  VStack,
  Badge
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchDetailLaporanTholib } from "../laporanTholibService";
import { DetailLaporanTholib } from "../types";

export default function LaporanTholibDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [detailLaporan, setDetailLaporan] = useState<DetailLaporanTholib[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
    return today;
  });

  // Fetch data ketika id atau tanggal berubah
  useEffect(() => {
    if (!id || !selectedDate) return;

    async function loadData() {
      try {
        console.log("Fetching data for ID:", id, "and Date:", selectedDate);
        const response = await fetchDetailLaporanTholib(
          id.toString(),
          selectedDate
        );
        console.log("Response data:", response);

        if (response && response.data) {
          setDetailLaporan(response.data);
        } else {
          setDetailLaporan([]);
        }
      } catch (error) {
        console.error("Gagal mengambil detail laporan:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, selectedDate]);

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" mt={4}>
      {/* Tombol Kembali */}

      <Button colorScheme="gray" size="sm" onClick={() => router.back()} mb={4}>
        ← Kembali
      </Button>

      {/* Form Input Tanggal */}
      <FormControl mt={4}>
        <FormLabel>Pilih Tanggal</FormLabel>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </FormControl>

      {/* Daftar Data Amalan */}
      <Box mt={8}> {/* Menambahkan margin top */}
        {loading ? (
          <Spinner size="lg" mt={4} />
        ) : detailLaporan.length > 0 ? (
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
                            {item.type === "dropdown" ? (
                              <Badge colorScheme={item.nilai == null || item.nilai === "" ? "red" : "blue"}>
                              {item.nilai == null || item.nilai === "" ? "Belum" : item.nilai}
                            </Badge>
                            ) : (
                              <Badge colorScheme={item.status ? "green" : "red"}>
                                {item.status ? "Selesai" : "Belum"}
                              </Badge>
                            )}
                          </Box>
                        </HStack>
                      </Box>
          ))
        ) : (
          <Text mt={4}>Tidak ada data amalan pada tanggal ini.</Text>
        )}
      </Box>
    </Box>
  );
}