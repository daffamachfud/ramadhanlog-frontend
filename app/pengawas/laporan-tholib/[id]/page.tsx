"use client";
import { useParams, useRouter } from "next/navigation";
import { 
  Box, Spinner, Text, Button, Input, FormControl, FormLabel, 
  Table, Thead, Tbody, Tr, Th, Td 
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

      <Text fontSize="xl" fontWeight="bold">Detail Laporan Tholib</Text>

      {/* Form Input Tanggal */}
      <FormControl mt={4}>
        <FormLabel>Pilih Tanggal</FormLabel>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </FormControl>

      {loading ? (
        <Spinner size="lg" mt={4} />
      ) : detailLaporan.length > 0 ? (
        <Table variant="simple" mt={4} size="sm">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Nama Amalan</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {detailLaporan.map((item, index) => (
              <Tr key={item.id}>
                <Td>{index + 1}</Td>
                <Td>{item.nama_amalan}</Td>
                <Td>{item.status ? "✅" : "❌"}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text mt={4}>Tidak ada data amalan pada tanggal ini.</Text>
      )}
    </Box>
  );
}
