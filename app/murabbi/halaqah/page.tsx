"use client";

import { useState, useEffect } from "react";
import { Box, Heading, Input, Button, useDisclosure } from "@chakra-ui/react";
import HalaqahTable from "./HalaqahTable";
import HalaqahForm from "./HalaqahForm";
import { getHalaqahList, addHalaqah, updateHalaqah, deleteHalaqah } from "./halaqahService";
import { Halaqah } from "./types";

export default function HalaqahPage() {
  const [halaqahList, setHalaqahList] = useState<Halaqah[]>([]);
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState<Halaqah | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    async function fetchData() {
      const data = await getHalaqahList();
      setHalaqahList(data);
    }
    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleAdd = () => {
    setEditData(null);
    onOpen();
  };

  const handleEdit = (halaqah: Halaqah) => {
    setEditData(halaqah);
    onOpen();
  };

  const handleDelete = async (id: string) => {
    await deleteHalaqah(id);
    setHalaqahList(halaqahList.filter((h) => h.id !== id));
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Halaqah Saya</Heading>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Input placeholder="Cari Halaqah..." value={search} onChange={handleSearch} width="300px" />
        <Button colorScheme="green" onClick={handleAdd}>
          Tambah Halaqah
        </Button>
      </Box>
      <HalaqahTable halaqahList={halaqahList} onEdit={handleEdit} onDelete={handleDelete} />
      <HalaqahForm isOpen={isOpen} onClose={onClose} editData={editData} setHalaqahList={setHalaqahList} />
    </Box>
  );
}
