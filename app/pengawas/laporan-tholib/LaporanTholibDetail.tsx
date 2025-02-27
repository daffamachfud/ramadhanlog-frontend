"use client";

import { useEffect, useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Spinner, Text, Input, Flex, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { fetchDetailLaporanTholib } from "./laporanTholibService";
import { DetailLaporanTholib } from "./types";

export default function LaporanTholibDetail({ params, onClose }: { params: { tholibId: string }; onClose: () => void }) {
  const router = useRouter();
  const { tholibId } = params;
  const [detailLaporan, setDetailLaporan] = useState<DetailLaporanTholib[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchDetailLaporanTholib(tholibId, selectedDate);
        console.log("hasil di front end : ",data)
        setDetailLaporan(data);
      } catch (error) {
        console.error("Gagal mengambil detail laporan:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tholibId, selectedDate]);

  return (
    <Box p={4}>
      <Flex align="center" mb={4}>
        <IconButton icon={<ArrowBackIcon />} aria-label="Back" onClick={() => router.back()} />
        <Text fontSize="xl" fontWeight="bold" ml={3}>
          Detail Laporan Amalan
        </Text>
      </Flex>
      
      <Input 
        type="date" 
        value={selectedDate} 
        onChange={(e) => setSelectedDate(e.target.value)} 
        maxW="200px" 
        mb={4} 
      />

      {loading ? (
        <Spinner size="lg" mt={4} />
      ) : detailLaporan.length > 0 ? (
        <Table variant="simple" size="sm" mt={4}>
          <Thead>
            <Tr>
              <Th>Tanggal</Th>
              <Th>Amalan</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {detailLaporan.map((item) => (
              <Tr key={item.id}>
                <Td>{item.tanggal}</Td>
                <Td>{item.nama_amalan}</Td>
                <Td>{item.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text mt={4}>Tidak ada data amalan.</Text>
      )}
    </Box>
  );
}
