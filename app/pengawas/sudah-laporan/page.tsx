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

const PageSudahLaporan = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [tholibList, setTholibList] = useState<Tholib[]>([]);
  const [halaqahList, setHalaqahList] = useState<Halaqah[]>([]);
  const [selectedHalaqah, setSelectedHalaqah] = useState("all");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  interface Tholib {
    id: string;
    name: string;
    nama_halaqah: string;
    total_amalan: string;
  }

  interface Halaqah {
    id: string;
    nama: string;
  }

  const goToDetail = (id: string, name: string) => {
    const encodedName = encodeURIComponent(name); // Encode nama untuk URL
    router.push(`/pengawas/sudah-laporan/${id}?name=${encodedName}`);
  };
  

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

        // Fetch daftar tholib yang sudah laporan
        const response = await fetch(api.getPengawasReported, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
        console.log("Data tholib:", data); // Debugging

        if (
          data.success &&
          data.data &&
          Array.isArray(data.data.tholibReports)
        ) {
          // Sesuaikan key yang sesuai dengan API response
          setTholibList(
            data.data.tholibReports.map((t: any) => ({
              id: t.id,
              name: t.name || "Unknown",
              nama_halaqah: t.nama_halaqah || "Tidak diketahui",
              total_amalan: t.total_amalan,
            }))
          );
        } else {
          setError("Gagal mengambil data tholib");
        }

        const responseHalaqah = await fetch(api.halaqahMurabbi, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const dataHalaqah = await responseHalaqah.json();
        console.log("Data halaqah:", dataHalaqah); // Debugging

        if (dataHalaqah.success && Array.isArray(dataHalaqah.data)) {
          setHalaqahList(
            dataHalaqah.data.map((h: any) => ({
              id: h.id,
              nama: h.nama_halaqah, // Sesuaikan key dengan API response
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

  const hijriDate = moment().locale("en").format("iD iMMMM iYYYY") + " H";

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
          <Heading size="md">Sudah Laporan</Heading>
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
              Tidak ada laporan
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
              .map((tholib) => {
                const totalAmalan = parseInt(tholib.total_amalan, 10) || 0; // Pastikan angka
                const maxAmalan = 21; // Batas maksimal amalan harian
                let bgColor = "red.100";

                if (totalAmalan >= 15) {
                  bgColor = "green.100"; // Baik
                } else if (totalAmalan >= 7) {
                  bgColor = "yellow.100"; // Cukup
                }

                return (
                  <HStack
                    key={tholib.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    boxShadow="md"
                    justifyContent="space-between"
                    width="100%"
                    bg={bgColor} // Warna background sesuai jumlah amalan
                  >
                    <Box>
                      <Text fontWeight="bold">
                        {tholib.name || "Nama Tidak Diketahui"}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {tholib.nama_halaqah || "Halaqah Tidak Diketahui"}
                      </Text>
                    </Box>
                    <Badge colorScheme="blue" fontSize="sm">
                      {`${totalAmalan}/${maxAmalan}`}
                    </Badge>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => goToDetail(tholib.id, tholib.name)}
                    >
                      Detail
                    </Button>
                  </HStack>
                );
              })
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
            <Text mb={2}>
              Menampilkan daftar tholib yang sudah laporan hari ini. Warna latar
              belakang menunjukkan tingkat pencapaian amalan:
            </Text>
            <VStack align="start" spacing={2}>
              <HStack>
                <Box w={4} h={4} bg="green.100" borderRadius="md" />
                <Text>13 - 17 amalan: Baik</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="yellow.100" borderRadius="md" />
                <Text>6 - 12 amalan: Cukup</Text>
              </HStack>
              <HStack>
                <Box w={4} h={4} bg="red.100" borderRadius="md" />
                <Text>0 - 5 amalan: Perlu Peningkatan</Text>
              </HStack>
            </VStack>
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

export default PageSudahLaporan;
