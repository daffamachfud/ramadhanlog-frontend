"use client";

import { Box, SimpleGrid, VStack, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, ScrollText, BarChart3 } from "lucide-react";
import { FaHands } from "react-icons/fa";

type Item = { label: string; icon: any; path: string };

export default function QuickLinks() {
  const router = useRouter();
  const pathname = usePathname();
  const bg = useColorModeValue("white", "gray.800");
  const ring = useColorModeValue("gray.200", "gray.700");
  const subtle = useColorModeValue("gray.700", "gray.200");

  // Role heuristik dari path
  const role = pathname?.startsWith('/murabbi')
    ? 'murabbi'
    : pathname?.startsWith('/pengawas')
    ? 'pengawas'
    : pathname?.startsWith('/tholib')
    ? 'tholib'
    : 'other';

  const laporanPath = role === 'pengawas' ? '/pengawas/laporan-tholib' : '/tholib/laporan-amalan';

  const items: Item[] = [
    { label: 'Al-Qur\'an', icon: BookOpen, path: '/quran' },
    { label: 'Doa', icon: FaHands, path: '/doa' },
    { label: 'Hadis', icon: ScrollText, path: '/hadist' },
    { label: 'Laporan', icon: BarChart3, path: laporanPath },
  ];

  const list = role === 'murabbi' ? items.filter((i) => i.label !== 'Laporan') : items;

  return (
    <SimpleGrid columns={role === 'murabbi' ? 3 : 4} gap={2} px={4}>
      {list.map((it) => (
        <VStack
          key={it.label}
          as="button"
          onClick={() => router.push(it.path)}
          spacing={1}
          p={2}
          bg={bg}
          borderWidth="1px"
          borderColor={ring}
          borderRadius="xl"
          boxShadow="sm"
          _hover={{ boxShadow: 'md', transform: 'translateY(-1px)' }}
          transition="all 0.15s ease"
        >
          <Box bg="gray.50" borderRadius="full" p={2}>
            <Icon as={it.icon} boxSize={5} color="blue.500" />
          </Box>
          <Text fontSize="xs" color={subtle} noOfLines={1} w="full" textAlign="center">
            {it.label}
          </Text>
        </VStack>
      ))}
    </SimpleGrid>
  );
}
