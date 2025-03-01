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
        <ModalHeader>⚠️ Pemberitahuan Penting</ModalHeader>
        <ModalBody>
          <Text fontSize="md">
            Terjadi kesalahan pergantian hari pencatatan amalan. Jika merasa sudah input amalan tetapi catatan hilang, silakan input ulang saja.
          </Text>
          <Text fontSize="sm" mt={2} fontStyle="italic" color="gray.600">
            Kami sedang memperbaiki sistem agar pergantian hari mengikuti matahari terbenam. Syukron.
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
