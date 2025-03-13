import { Table, Thead, Tbody, Tr, Th, Td, Button, Box } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LaporanTholibDetail from "./LaporanTholibDetail";
import { LaporanTholib } from "./types";

export default function LaporanTholibTable({ laporan }: { laporan: LaporanTholib[] }) {
  const [selectedTholib, setSelectedTholib] = useState<LaporanTholib | null>(null);
  const router = useRouter();

  const goToDetail = (id: number, name: string) => {
    const encodedName = encodeURIComponent(name); // Encode nama untuk URL
    router.push(`/pengawas/laporan-tholib/${id.toString()}?name=${encodedName}`);
  };
  
  return (
    <Box overflowX="auto" w="full">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Nama</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {laporan.map((tholib) => (
            <Tr key={tholib.id}>
              <Td whiteSpace="nowrap">{tholib.name}</Td>
              <Td>
                 {/* Navigasi ke halaman detail */}
                 <Button 
                  size="sm" 
                  colorScheme="blue" 
                  onClick={() => goToDetail(tholib.id, tholib.name)}
                >
                  Lihat Detail
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {selectedTholib && (
  <LaporanTholibDetail
    params={{ tholibId: String(selectedTholib.id) }} // Ubah ke format params yang sesuai
    onClose={() => setSelectedTholib(null)}
  />
)}
    </Box>
  );
}
