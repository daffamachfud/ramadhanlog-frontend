"use client";

import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Flex,
  Icon,
  Badge,
  Text,
  Skeleton,
  Tag,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { FiGlobe, FiPlus, FiCheckCircle } from "react-icons/fi";
import withAuth from "@/app/utils/withAuth";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";
import AmalanStatusIcon from "@/components/AmalanStatusIcon";
import Link from "next/link";

const AmalanPage = () => {
  const [loading, setLoading] = useState(true);
  const [amalanList, setAmalanList] = useState<any[]>([]); // ganti dengan interface kalau mau lebih strict

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const cookies = parseCookies();
        const token = cookies.token;
        if (!token) {
          window.location.href = "https://haizumapp.com";
          return;
        }

        const response = await fetch(api.getAmalanForMurabbi, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data amalan");
        }

        const data = await response.json();
        if (data.success) {
          setAmalanList(data.data);
        }
      } catch (error) {
        console.error("Gagal memuat data amalan:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <Box px={4} py={6}>
      <VStack spacing={4} align="stretch">
        {loading
          ? [...Array(3)].map((_, i) => (
              <Skeleton key={i} height="80px" borderRadius="md" />
            ))
          : amalanList.map((amalan) => (
              <Box
                key={amalan.id}
                p={4}
                borderWidth={1}
                borderRadius="md"
                shadow="sm"
                _hover={{ bg: "gray.50", cursor: "pointer" }}
                onClick={() => {
                  localStorage.setItem(
                    "selectedAmalan",
                    JSON.stringify(amalan)
                  );
                  router.push(`/murabbi/amalan/${amalan.id}`);
                }}
              >
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontWeight="bold" fontSize="lg">
                    {amalan.nama}
                  </Text>
                  <Flex gap={2}>
                    <AmalanStatusIcon status={amalan.status} />
                    {amalan.is_for_all_halaqah ? (
                      <Badge colorScheme="blue" fontSize="xs" borderRadius="sm">
                        Semua
                      </Badge>
                    ) : (
                      <Badge
                        colorScheme="purple"
                        fontSize="xs"
                        borderRadius="sm"
                      >
                        Tidak Semua
                      </Badge>
                    )}
                  </Flex>
                </Flex>
                <Text fontSize="sm" color="gray.600">
                  {amalan.description || "Tanpa deskripsi."}
                </Text>
              </Box>
            ))}
      </VStack>
    </Box>
  );
};

export default withAuth(AmalanPage, ["murabbi"]);
