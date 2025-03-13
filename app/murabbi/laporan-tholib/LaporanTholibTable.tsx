import { Box, Table, Tbody, Tr, Td, Button, VStack, Text, Center } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LaporanTholibDetail from "./LaporanTholibDetail";
import { LaporanTholib } from "./types";

export default function LaporanTholibTable({ laporan }: { laporan: LaporanTholib[] }) {
  const [selectedTholib, setSelectedTholib] = useState<LaporanTholib | null>(null);
  const router = useRouter();

  const goToDetail = (id: number, name: string) => {
    const encodedName = encodeURIComponent(name);
    router.push(`/murabbi/laporan-tholib/${id.toString()}?name=${encodedName}`);
  };

  return (
    <Box overflowX="auto" w="full">
      <Table variant="simple" size="sm">
        <Tbody>
          {laporan.map((tholib) => (
            <Tr key={tholib.id}>
              <Td>
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" fontSize="md">{tholib.name}</Text>
                  <Text fontSize="xs" color="gray.500">{tholib.halaqah}</Text>
                </VStack>
              </Td>
              <Td>
                <Center>
                  <Button 
                    size="sm" 
                    colorScheme="blue"
                    onClick={() => goToDetail(tholib.id, tholib.name)}
                  >
                    Lihat Detail
                  </Button>
                </Center>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {selectedTholib && (
        <LaporanTholibDetail
          params={{ tholibId: String(selectedTholib.id) }}
          onClose={() => setSelectedTholib(null)}
        />
      )}
    </Box>
  );
}
