import { Table, Thead, Tbody, Tr, Th, Td, Button } from "@chakra-ui/react";
import { useState } from "react";
import LaporanTholibDetail from "./LaporanTholibDetail";
import { LaporanTholib } from "./types"; // Import tipe

export default function LaporanTholibTable({ laporan }: { laporan: LaporanTholib[] }) {
  const [selectedTholib, setSelectedTholib] = useState<LaporanTholib | null>(null);

  return (
    <>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nama</Th>
            <Th>Halaqah</Th>
            <Th>Sholat</Th>
            <Th>Tilawah</Th>
            <Th>Sedekah</Th>
            <Th>Puasa</Th>
            <Th>Dzikir</Th>
            <Th>Amalan Tambahan</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {laporan.map((tholib) => (
            <Tr key={tholib.id}>
              <Td>{tholib.nama}</Td>
              <Td>{tholib.halaqah}</Td>
              <Td>{tholib.sholatWajib}/5</Td>
              <Td>{tholib.tilawah}</Td>
              <Td>{tholib.sedekah ? "✅" : "❌"}</Td>
              <Td>{tholib.puasa ? "✅" : "❌"}</Td>
              <Td>{tholib.dzikir}</Td>
              <Td>{tholib.amalanTambahan}</Td>
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
    </>
  );
}
