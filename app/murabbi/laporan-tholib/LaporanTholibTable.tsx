import { Table, Thead, Tbody, Tr, Th, Td, Button, Box } from "@chakra-ui/react";
import { useState } from "react";
import LaporanTholibDetail from "./LaporanTholibDetail";
import { LaporanTholib } from "./types"; // Import tipe

export default function LaporanTholibTable({ laporan }: { laporan: LaporanTholib[] }) {
  const [selectedTholib, setSelectedTholib] = useState<LaporanTholib | null>(null);

  return (
    <Box overflowX="auto" w="full">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Nama</Th>
            <Th>Halaqah</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {laporan.map((tholib) => (
            <Tr key={tholib.id}>
              <Td whiteSpace="nowrap">{tholib.nama}</Td>
              <Td whiteSpace="nowrap">{tholib.halaqah}</Td>
              <Td>
                <Button size="sm" colorScheme="blue" onClick={() => setSelectedTholib(tholib)}>
                  Lihat Detail
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {selectedTholib && <LaporanTholibDetail tholib={selectedTholib} onClose={() => setSelectedTholib(null)} />}
    </Box>
  );
}
