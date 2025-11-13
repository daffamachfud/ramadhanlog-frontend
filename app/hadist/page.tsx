"use client";
import {
  Box,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  useDisclosure,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { FaHands } from "react-icons/fa";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HadistPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    onOpen(); // auto open dialog saat halaman dibuka
  }, []);

  return (
    <Box p={6}>
      <IconButton
        aria-label="Kembali"
        icon={<ArrowBackIcon />}
        variant="ghost"
        onClick={() => router.back()}
        mb={4}
      />
      <VStack spacing={4} align="center" justify="center" textAlign="center">
        <Icon as={FaHands} boxSize={12} color="gray.400" />
        <Text fontSize="2xl" fontWeight="bold">
          Hadist
        </Text>
        <Text color="gray.600">Fitur ini akan segera hadir, insyaAllah!</Text>
        <Button onClick={onOpen} colorScheme="blue" variant="outline">
          Info Fitur
        </Button>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Fitur dalam Pengembangan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Fitur ini sedang dalam proses pengembangan. InsyaAllah segera hadir untuk menemani ibadahmu. Mohon doanya ya 🙏
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Mengerti
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
