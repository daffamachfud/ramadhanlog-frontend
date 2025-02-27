import { Table, Thead, Tbody, Tr, Th, Td, IconButton, Box, Tooltip, useToast } from "@chakra-ui/react";
import { FiEdit, FiTrash, FiCopy } from "react-icons/fi";
import { Halaqah } from "@/app/murabbi/halaqah/types";

type Props = {
  halaqahList: Halaqah[];
  onEdit: (halaqah: Halaqah) => void;
  onDelete: (id: string) => void;
};

export default function HalaqahTable({ halaqahList, onEdit, onDelete }: Props) {
  const toast = useToast();
  // Fungsi untuk menyalin teks ke clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} disalin!`,
      description: `Kode "${text}" telah disalin ke clipboard.`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box overflowX="auto" w="full">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Nama Halaqah</Th>
            <Th display={{ base: "none", md: "table-cell" }}>Jumlah Anggota</Th>
            <Th>Kode Halaqah</Th>
            <Th>Kode Pengawas</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {halaqahList.map((halaqah) => (
            <Tr key={halaqah.id}>
              <Td whiteSpace="nowrap">{halaqah.nama}</Td>
              <Td display={{ base: "none", md: "table-cell" }}>{halaqah.jumlahAnggota}</Td>
              {/* Kode Halaqah + Tombol Copy */}
              <Td whiteSpace="nowrap">
                {halaqah.kode}{" "}
                <Tooltip label="Salin Kode Halaqah">
                  <IconButton
                    aria-label="Copy Kode Halaqah"
                    icon={<FiCopy />}
                    size="xs"
                    ml={2}
                    onClick={() => copyToClipboard(halaqah.kode, "Kode Halaqah")}
                  />
                </Tooltip>
              </Td>

              {/* Kode Pengawas + Tombol Copy */}
              <Td whiteSpace="nowrap">
                {halaqah.kodePengawas}{" "}
                <Tooltip label="Salin Kode Pengawas">
                  <IconButton
                    aria-label="Copy Kode Pengawas"
                    icon={<FiCopy />}
                    size="xs"
                    ml={2}
                    onClick={() => copyToClipboard(halaqah.kodePengawas, "Kode Pengawas")}
                  />
                </Tooltip>
              </Td>
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
