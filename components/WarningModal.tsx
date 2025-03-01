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
            Sistem sekarang sudah menerapkan batas waktu submit amalan di waktu magrib.
          </Text>
          <Text fontSize="sm" mt={2} fontStyle="italic" color="gray.600">
          Jadi nanti jika sudah masuk magrib, pada halaman catatan amalan akan di reset.
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
