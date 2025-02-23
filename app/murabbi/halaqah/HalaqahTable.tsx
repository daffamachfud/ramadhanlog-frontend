import { Table, Thead, Tbody, Tr, Th, Td, IconButton, Box } from "@chakra-ui/react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Halaqah } from "@/app/murabbi/halaqah/types";

type Props = {
  halaqahList: Halaqah[];
  onEdit: (halaqah: Halaqah) => void;
  onDelete: (id: string) => void;
};

export default function HalaqahTable({ halaqahList, onEdit, onDelete }: Props) {
  return (
    <Box overflowX="auto" w="full">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Nama Halaqah</Th>
            <Th display={{ base: "none", md: "table-cell" }}>Jumlah Anggota</Th>
            <Th>Kode Halaqah</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {halaqahList.map((halaqah) => (
            <Tr key={halaqah.id}>
              <Td whiteSpace="nowrap">{halaqah.nama}</Td>
              <Td display={{ base: "none", md: "table-cell" }}>{halaqah.jumlahAnggota}</Td>
              <Td whiteSpace="nowrap">{halaqah.kode}</Td>
              <Td>
                <IconButton
                  aria-label="Edit"
                  icon={<FiEdit />}
                  size="sm"
                  onClick={() => onEdit(halaqah)}
                  mr={2}
                />
                <IconButton
                  aria-label="Hapus"
                  icon={<FiTrash />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => onDelete(halaqah.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
