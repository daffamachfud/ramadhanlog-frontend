"use client";

import { Box, Button, Heading, Text, VStack, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <Box minH="100vh" display="flex" flexDirection="column" justifyContent="space-between" bg="gray.100">
      {/* Konten Utama */}
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" flex="1">
        {/* Judul & Deskripsi */}
        <VStack spacing={4} mb={6}>
          <Heading as="h1" size="xl">
            Selamat Datang di Catatan Amalan Yaumiyah Ramadhan 1446 H
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Catat amalan harianmu selama Ramadhan dengan mudah dan rapi.
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
