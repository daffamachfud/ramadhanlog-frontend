import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Box, Text } from "@chakra-ui/react";
import { LaporanTholib } from "./types";

export default function LaporanTholibDetail({ tholib, onClose }: { tholib: LaporanTholib; onClose: () => void }) {
  return (
    <Modal isOpen={!!tholib} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detail Laporan - {tholib.nama}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Text><b>Halaqah:</b> {tholib.halaqah}</Text>
            <Text><b>Sholat Wajib:</b> {tholib.sholatWajib}/5</Text>
            <Text><b>Tilawah:</b> {tholib.tilawah}</Text>
            <Text><b>Sedekah:</b> {tholib.sedekah ? "✅ Ya" : "❌ Tidak"}</Text>
            <Text><b>Puasa:</b> {tholib.puasa ? "✅ Ya" : "❌ Tidak"}</Text>
            <Text><b>Dzikir:</b> {tholib.dzikir}</Text>
            <Text><b>Amalan Tambahan:</b> {tholib.amalanTambahan}</Text>
            <Text><b>Tanggal:</b> {tholib.tanggal}</Text>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
