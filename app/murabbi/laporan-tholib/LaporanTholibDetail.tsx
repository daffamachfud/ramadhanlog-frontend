"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Spinner,
  Text,
  Input,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { fetchDetailLaporanTholib } from "./laporanTholibService";
import { DetailLaporanTholib } from "./types";

export default function LaporanTholibDetail({
  params,
  onClose,
}: {
  params: { tholibId: string };
  onClose: () => void;
}) {
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
        console.log("hasil di front end : ", data);
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
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Back"
          onClick={() => router.back()}
        />
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
        detailLaporan.map((item) => (
          <Box
            key={item.id}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            boxShadow="md"
            cursor="pointer"
            _hover={{ bg: "gray.100" }} // Efek hover agar terlihat interaktif
          >
            <HStack justifyContent="space-between">
              <Box>
                <Text fontWeight="bold">{item.nama_amalan}</Text>
              </Box>
            </HStack>
          </Box>
        ))
      ) : (
        <Text mt={4}>Tidak ada data amalan.</Text>
      )}
    </Box>
  );
}
