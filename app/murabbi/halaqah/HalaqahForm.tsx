import { useEffect, useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Halaqah } from "./types";
import { addHalaqah, updateHalaqah } from "./halaqahService";

interface HalaqahFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData: Halaqah | null;
  setHalaqahList: (halaqahUpdater: (prev: Halaqah[]) => Halaqah[]) => void;
}

export default function HalaqahForm({ isOpen, onClose, editData, setHalaqahList }: HalaqahFormProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    setName(editData?.nama || "");
    setCode(editData?.kode || "");
  }, [editData]);

  const handleSubmit = async () => {
    if (editData) {
      const updatedHalaqah = await updateHalaqah(editData.id, { name, code });
      setHalaqahList((prev: Halaqah[]) => prev.map((h) => (h.id === updatedHalaqah.id ? updatedHalaqah : h)));
    } else {
      const newHalaqah = await addHalaqah({ name, code });
      setHalaqahList((prev: Halaqah[]) => [...prev, newHalaqah]);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{editData ? "Edit Halaqah" : "Tambah Halaqah"}</ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>Nama Halaqah</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Kode</FormLabel>
            <Input value={code} onChange={(e) => setCode(e.target.value)} />
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
