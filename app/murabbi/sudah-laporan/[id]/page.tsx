"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  Box,
  Spinner,
  Text,
  Button,
  Input,
  FormLabel,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchDetailLaporanTholib } from "../../laporan-tholib/laporanTholibService";
import { DetailLaporanTholib } from "../../laporan-tholib/types";
import { ArrowBackIcon, QuestionIcon } from "@chakra-ui/icons";
import moment from "moment-hijri";

export default function SudahLaporanDetail() {
  const { id } = useParams();
  const router = useRouter();
  const params = useSearchParams();
  const name = params.get("name") || "Nama Tidak Diketahui";
  const [detailLaporan, setDetailLaporan] = useState<DetailLaporanTholib[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
    return today;
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const hijriDate = moment().locale("en").format("iD iMMMM iYYYY") + " H";

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" mt={4}>
      {/* Tombol Kembali */}
      <HStack spacing={3} justify="space-between" align="center" mb={4}>
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Kembali"
          onClick={() => router.back()}
          colorScheme="blue"
          variant="ghost"
          size="sm"
        />
        <Box textAlign="center" flex="1">
          <Heading size="md">{name}</Heading>
          <Text color="gray.500" fontSize="sm">
            {hijriDate}
          </Text>
        </Box>
        <IconButton
          icon={<QuestionIcon />}
          aria-label="Help"
          onClick={onOpen}
          colorScheme="gray"
          variant="ghost"
          size="sm"
        />
      </HStack>

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
