import { Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Halaqah } from "@/app/murabbi/halaqah/types";

type Props = {
  halaqahList: Halaqah[];
  onEdit: (halaqah: Halaqah) => void;
  onDelete: (id: string) => void;
};

export default function HalaqahTable({ halaqahList, onEdit, onDelete }: Props) {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Nama Halaqah</Th>
          <Th>Jumlah Anggota</Th> {/* Tambahkan kolom baru */}
          <Th>Kode Halaqah</Th>
          <Th>Aksi</Th>
        </Tr>
      </Thead>
      <Tbody>
        {halaqahList.map((halaqah) => (
          <Tr key={halaqah.id}>
            <Td>{halaqah.nama}</Td>
            <Td>{halaqah.jumlahAnggota}</Td> {/* Tampilkan jumlah anggota */}
            <Td>{halaqah.kode}</Td>
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
  );
}
