"use client";

import { Box, Button, Heading, Text, VStack, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.token;
    const role = cookies.role; // Ambil role dari cookie

    if (token && role) {
      // Redirect ke dashboard sesuai role
      if (role === "murabbi") router.push("/murabbi");
      else if (role === "tholib") router.push("/tholib");
      else if (role === "pengawas") router.push("/pengawas");
    }
  }, [router]);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" justifyContent="space-between" bg="gray.100">
      {/* Konten Utama */}
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" flex="1">
        {/* Judul & Deskripsi */}
        <VStack spacing={4} mb={6}>
          <Heading as="h1" size="xl">
            Haizum App
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Aplikasi amalan harian dan lainnya.
          </Text>
        </VStack>

        {/* Tombol Aksi */}
        <VStack spacing={4}>
          <Button colorScheme="blue" size="lg" onClick={() => router.push("/auth/login")}>
            Masuk
          </Button>
          <Button colorScheme="green" size="lg" onClick={() => router.push("/auth/register")}>
            Daftar
          </Button>
        </VStack>
      </Box>

      {/* Footer */}
      <Flex as="footer" py={4} justifyContent="center" bg="gray.200">
        <Text fontSize="sm" color="gray.600">
          © 2025 Haizum. All Rights Reserved.
        </Text>
      </Flex>
    </Box>
  );
}
