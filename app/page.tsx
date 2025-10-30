"use client";

import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Flex,
  SimpleGrid,
  HStack,
  Icon,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import {
  CheckCircle2 as CheckIcon,
  BookOpen,
  Sparkles,
  BarChart3,
  Bell,
  Newspaper,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.token;
    const role = cookies.role;
    if (token && role) {
      if (role === "murabbi") router.push("/murabbi");
      else if (role === "tholib") router.push("/tholib");
      else if (role === "pengawas") router.push("/pengawas");
    }
  }, [router]);

  const cardBg = useColorModeValue("white", "gray.800");
  const subtle = useColorModeValue("gray.600", "gray.300");
  const ring = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-b, gray.50, white)"
      position="relative"
      overflow="hidden"
    >
      {/* Background accents */}
      <Box
        position="absolute"
        top="-20"
        right="-20"
        w="56"
        h="56"
        bgGradient="radial(teal.100, transparent 60%)"
        filter="blur(12px)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-24"
        left="-24"
        w="72"
        h="72"
        bgGradient="radial(blue.100, transparent 60%)"
        filter="blur(14px)"
        pointerEvents="none"
      />

      {/* Hero */}
      <Box as="section" pt={{ base: 16, md: 24 }} pb={{ base: 12, md: 16 }}>
        <VStack spacing={6} maxW="960px" mx="auto" textAlign="center" px={6}>
          <Badge colorScheme="blue" variant="subtle" borderRadius="full" px={3} py={1}>
            Haizum Apps
          </Badge>
          <Heading fontSize={{ base: "3xl", md: "5xl" }} lineHeight={1.1}>
            Catat. Amalkan. Tumbuh Lebih Baik.
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color={subtle} maxW="700px">
            Aplikasi Haizum membantu tholib, murabbi, dan pengawas menjaga rutinitas ibadah harian
            dengan catatan amalan, reminder inspiratif, dan laporan progres yang elegan.
          </Text>
          <HStack spacing={3} pt={2}>
            <Button colorScheme="blue" size="lg" onClick={() => router.push("/auth/login")}>Masuk</Button>
            <Button variant="outline" size="lg" onClick={() => router.push("/auth/register")}>Daftar</Button>
          </HStack>
        </VStack>
      </Box>

      {/* Features */}
      <Box as="section" pb={{ base: 12, md: 20 }} px={6}>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} maxW="1100px" mx="auto">
          {[
            {
              icon: BookOpen,
              title: "Catat Amalan Harian",
              desc: "Checklist harian yang rapi untuk menjaga konsistensi ibadah Anda.",
            },
            {
              icon: BarChart3,
              title: "Rapot Ramadhan",
              desc: "Lihat progres bulanan dengan visual yang sederhana namun informatif.",
            },
            {
              icon: Newspaper,
              title: "Feed Tulisan",
              desc: "Bagikan insight dan kisah Anda, serta baca postingan teman-teman.",
            },
            {
              icon: Bell,
              title: "Pengingat & Hadis",
              desc: "Motivasi harian lewat kutipan hadis pilihan yang terus berganti.",
            },
            {
              icon: Sparkles,
              title: "Desain Minimalis",
              desc: "Fokus pada hal penting. Antarmuka bersih, nyaman, dan cepat.",
            },
            {
              icon: CheckIcon,
              title: "Peran Terintegrasi",
              desc: "Alur tholib, murabbi, dan pengawas berjalan selaras tanpa ribet.",
            },
          ].map((f, i) => (
            <VStack
              key={i}
              align="start"
              spacing={3}
              p={6}
              bg={cardBg}
              borderWidth="1px"
              borderColor={ring}
              borderRadius="lg"
              boxShadow="sm"
              transition="all 0.2s ease"
              _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
            >
              <Box
                bg="blue.50"
                color="blue.600"
                borderRadius="full"
                p={2}
                borderWidth="1px"
                borderColor={ring}
              >
                <Icon as={f.icon} boxSize={5} />
              </Box>
              <Heading as="h3" size="md">{f.title}</Heading>
              <Text color={subtle}>{f.desc}</Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Box>

      {/* Footer */}
      <Flex as="footer" py={8} justifyContent="center" borderTop="1px" borderColor={ring}>
        <Text fontSize="sm" color={subtle}>© 2025 Haizum. All Rights Reserved.</Text>
      </Flex>
    </Box>
  );
}
