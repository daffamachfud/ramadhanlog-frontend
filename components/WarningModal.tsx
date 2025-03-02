"use client";

import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";

const WarningModal = () => {
  const [isOpen, setIsOpen] = useState(true); // Modal muncul saat pertama kali render

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered>
      <ModalOverlay />
      <ModalContent 
        maxW={{ base: "90%", md: "500px" }} // 🔹 Batasi lebar modal, lebih kecil di mobile
        p={4} // 🔹 Padding agar tidak terlalu mepet
        borderRadius="md" // 🔹 Tambahkan border radius agar tidak terlalu kaku
      >
        <ModalHeader>⚠️ Pemberitahuan Penting ⚠️</ModalHeader>
        <ModalBody>
         <Text fontSize="md">
         📅 3 Ramadhan 1446 H
          </Text>
          <Text fontSize="md">
            Pembaruan Fitur : 
            - Untuk laporan amalan tidak terbatas oleh waktu matahari terbenam.
            - Bisa memilih tanggal untuk input laporan catatan amalan
          </Text>
          <Text fontSize="sm" mt={2} fontStyle="italic" color="gray.600">
            Masih ada beberapa data yang belum sesuai seperti detail laporan amalan. InsyaAllah masih dalam proses perkembangan, tetapi jika masih ada masalah ketika laporan amalan silahkan hubungi PJ masing - masing
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={() => setIsOpen(false)}>
            Oke, Mengerti
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WarningModal;
