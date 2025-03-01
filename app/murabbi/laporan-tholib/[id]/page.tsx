"use client";
import { useParams, useRouter } from "next/navigation";
import { 
  Box, Spinner, Text, Button, Input, FormControl, FormLabel, 
  HStack
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
        const response = await fetchDetailLaporanTholib(id.toString(), selectedDate);
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
                    cursor="pointer"
                    _hover={{ bg: "gray.100" }}
                  >
                    <HStack justifyContent="space-between">
                      <Box>
                        <Text fontWeight="bold" fontSize="sm">
                          {item.nama_amalan}
                        </Text>
                      </Box>
                      {item.type === "dropdown" ? (
                        <Text fontWeight="bold">
                          {item.nilai === "" ? "-" : item.nilai}
                        </Text>
                      ) : (
                        <Text fontWeight="bold">{item.status ? "✅" : "❌"}</Text> // Menampilkan status sebagai ceklis
                      )}
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
