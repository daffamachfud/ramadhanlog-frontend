import { useEffect, useState } from "react";
import {
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Flex,
  CloseButton
} from "@chakra-ui/react";
import { Halaqah } from "./types";
import { addHalaqah } from "./halaqahService";

interface HalaqahFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData: Halaqah | null;
  setHalaqahList: (halaqahUpdater: (prev: Halaqah[]) => Halaqah[]) => void;
}

export default function HalaqahForm({
  isOpen,
  onClose,
  editData,
  setHalaqahList,
}: HalaqahFormProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [code_pengawas, setCodePengawas] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setName(editData?.nama || "");
    setCode(editData?.kode || "");
    setCodePengawas(editData?.kodePengawas || "");
  }, [editData]);

  const handleSubmit = async () => {
    if (!name || !code || !code_pengawas) {
      toast({
        title: "Error",
        description: "Nama dan kode halaqah wajib diisi",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (code_pengawas === code) {
      toast({
        title: "Error",
        description: "kode halaqah untuk pengawas harus di buat berbeda",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      if (editData) {
        // const updatedHalaqah = await updateHalaqah(editData.id, { name, code });
        // setHalaqahList((prev: Halaqah[]) => prev.map((h) => (h.id === updatedHalaqah.id ? updatedHalaqah : h)));
      } else {
        const newHalaqah = await addHalaqah({ name, code, code_pengawas });
        setHalaqahList((prev: Halaqah[]) => [...prev, newHalaqah]);
      }
      toast({
        title: "Sukses",
        description: `Halaqah ${editData ? "diperbarui" : "ditambahkan"}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
      <ModalHeader>
          <Flex justify="space-between" align="center">
            {editData ? "Edit Halaqah" : "Tambah Halaqah"}
            <CloseButton onClick={onClose} />
          </Flex>
        </ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>Nama Halaqah</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Kode</FormLabel>
            <Input value={code} onChange={(e) => setCode(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Kode Pengawas</FormLabel>
            <Input value={code_pengawas} onChange={(e) => setCodePengawas(e.target.value)} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
