"use client";

import {
  Box,
  Spinner,
  Text,
  Button,
  HStack,
  VStack,
  Badge,
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
  Switch,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon, QuestionIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { parseCookies } from "nookies";
import { api } from "@/lib/api";

export default function AmalanDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [amalanDetail, setAmalanDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api"; 

  const fetchAmalanDetail = async () => {
    try {
      const cookies = parseCookies();
      const token = cookies.token;

      const response = await fetch(`${baseUrl}/amalan/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Gagal ambil detail amalan");

      const data = await response.json();
      console.log("hasil detail :", data)


      // Pastikan options dalam bentuk array
      if (data.type === "dropdown" && typeof data.options === "string") {
        data.options = data.options.split(",").map((o: string) => o.trim());
      }

      setAmalanDetail(data);
    } catch (error) {
      console.error("❌ Gagal ambil detail amalan:", error);
      toast({
        title: "Gagal memuat data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmalanDetail();
  }, []);

  const handleToggleStatus = async () => {
    if (!amalanDetail) return;

    const newStatus = amalanDetail.status === "active" ? "inactive" : "active";

    try {
      const cookies = parseCookies();
      const token = cookies.token;

      const response = await fetch(api.updateStatusAmalan, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: amalanDetail.id,
          status: newStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Gagal update status");

      setAmalanDetail((prev: any) => ({
        ...prev,
        status: newStatus,
      }));

      toast({
        title: "Status diperbarui",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error("❌ Gagal update status:", error);
      toast({
        title: "Gagal mengubah status",
        description: error.message || "Terjadi kesalahan",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" mt={4}>
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
          <Heading size="sm">
            {amalanDetail ? amalanDetail.name : "Memuat..."}
          </Heading>
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
        <Spinner size="lg" mt={10} />
      ) : amalanDetail ? (
        <VStack spacing={4} align="start">
          <Text fontSize="sm" color="gray.600">
            {amalanDetail.description || "Tidak ada deskripsi"}
          </Text>

          <Badge colorScheme={amalanDetail.is_for_all_halaqah ? "blue" : "purple"}>
            {amalanDetail.is_for_all_halaqah ? "Untuk Semua Halaqah" : "Tertentu"}
          </Badge>

          <Text>
            <strong>Tipe:</strong> {amalanDetail.type}
          </Text>

          {amalanDetail.type === "dropdown" && Array.isArray(amalanDetail.options) && (
            <Box>
              <Text fontWeight="bold">Opsi:</Text>
              <VStack align="start" spacing={1}>
                {amalanDetail.options.map((opt: string, idx: number) => (
                  <Badge key={idx} colorScheme="gray">
                    {opt}
                  </Badge>
                ))}
              </VStack>
            </Box>
          )}

          <Flex align="center" gap={3}>
            <Text>Status:</Text>
            <Switch
              isChecked={amalanDetail.status === "active"}
              colorScheme="green"
              onChange={handleToggleStatus}
            />
            <Badge colorScheme={amalanDetail.status === "active" ? "green" : "gray"}>
              {amalanDetail.status === "active" ? "Aktif" : "Tidak Aktif"}
            </Badge>
          </Flex>
        </VStack>
      ) : (
        <Text color="red.500">Data amalan tidak ditemukan</Text>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Informasi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Ini adalah detail dari amalan yang Anda buat. Anda dapat melihat
              tipe, cakupan, dan juga mengatur status aktif atau tidak aktif.
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
