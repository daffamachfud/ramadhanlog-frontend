"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  Box,
  Spinner,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  HStack,
  IconButton,
  Heading,
  VStack,
  Badge,
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
          size="md"
        />
      </HStack>

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
                  <Badge
                    colorScheme={
                      item.nilai == null || item.nilai === "" ? "red" : "blue"
                    }
                  >
                    {item.nilai == null || item.nilai === ""
                      ? "Belum"
                      : item.nilai}
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
      {/* Modal Help */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Informasi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Daftar ini menampilkan detail amalan Tholib yang sudah dilakukan
              pada hari ini
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
