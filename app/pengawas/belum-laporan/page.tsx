"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowBackIcon, QuestionIcon } from "@chakra-ui/icons";
import {
  HStack,
  IconButton,
  Heading,
  Text,
  Box,
  Input,
  VStack,
  Spinner,
  Badge,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@chakra-ui/react";
import moment from "moment-hijri";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";

const PageBelumLaporan = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [tholibList, setTholibList] = useState<Tholib[]>([]);
  const [halaqahList, setHalaqahList] = useState<Halaqah[]>([]);
  const [selectedHalaqah, setSelectedHalaqah] = useState("all");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hijriDate, setHijriDate] = useState<string | null>(
    null
  );

  interface Tholib {
    id: string;
    name: string;
    nama_halaqah: string;
  }

  interface Halaqah {
    id: string;
    nama: string;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.token;
        if (!token) {
          setError("Anda harus login terlebih dahulu.");
          setLoading(false);
          return;
        }

        // Fetch daftar tholib yang belum laporan
        const response = await fetch(api.getPengawasUnreported, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
        console.log("Data tholib belum laporan:", data);

        if (data.success && Array.isArray(data.data)) {
          setHijriDate(
            data.hijri_date
          )
          setTholibList(
            data.data.map((t: any) => ({
              id: t.id,
              name: t.name || "Unknown",
              nama_halaqah: t.nama_halaqah || "Tidak diketahui",
            }))
          );
        } else {
          setError("Gagal mengambil data tholib");
        }

        const responseHalaqah = await fetch(api.halaqahMurabbi, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const dataHalaqah = await responseHalaqah.json();
        console.log("Data halaqah:", dataHalaqah);

        if (dataHalaqah.success && Array.isArray(dataHalaqah.data)) {
          setHalaqahList(
            dataHalaqah.data.map((h: any) => ({
              id: h.id,
              nama: h.nama_halaqah,
            }))
          );
        } else {
          setHalaqahList([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box p={6}>
      {/* Header */}
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
          <Heading size="md">Belum Laporan</Heading>
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

      <Divider mb={4} />

      {/* Dropdown Halaqah & Pencarian */}
      <HStack mb={4} spacing={3}>
        <Input
          placeholder="Cari Nama..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          flex="1"
        />
      </HStack>

      {/* Loading & Error Handling */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <VStack align="stretch" spacing={3}>
          {tholibList.filter(
            (t) =>
              (selectedHalaqah === "all" ||
                t.nama_halaqah === selectedHalaqah) &&
              (t.name
                ? t.name.toLowerCase().includes(search.toLowerCase())
                : false)
          ).length === 0 ? (
            <Text textAlign="center" color="gray.500">
              Data tidak ditemukan
            </Text>
          ) : (
            tholibList
              .filter(
                (t) =>
                  (selectedHalaqah === "all" ||
                    t.nama_halaqah === selectedHalaqah) &&
                  (t.name
                    ? t.name.toLowerCase().includes(search.toLowerCase())
                    : false)
              )
              .map((tholib) => (
                <HStack
                  key={tholib.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="md"
                  justifyContent="space-between"
                  width="100%"
                  bg="gray.100" // Warna abu-abu untuk indikasi belum laporan
                >
                  <Box>
                    <Text fontWeight="bold">
                      {tholib.name || "Nama Tidak Diketahui"}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {tholib.nama_halaqah || "Halaqah Tidak Diketahui"}
                    </Text>
                  </Box>
                  <Badge colorScheme="red" fontSize="sm">
                    Belum Laporan
                  </Badge>
                </HStack>
              ))
          )}
        </VStack>
      )}

      {/* Modal Help */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Informasi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Daftar ini menampilkan para Tholib yang belum mengisi laporan hari
              ini. Anda bisa mengingatkan mereka untuk segera melaporkan
              amalan.
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
};

export default PageBelumLaporan;
