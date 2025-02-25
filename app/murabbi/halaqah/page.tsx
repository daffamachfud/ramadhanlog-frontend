"use client";

import { useState, useEffect } from "react";
import { Box, Heading, Input, Button, useDisclosure, Flex } from "@chakra-ui/react";
import HalaqahTable from "./HalaqahTable";
import HalaqahForm from "./HalaqahForm";
import { Halaqah } from "./types";
import { getHalaqahList } from "./halaqahService";

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

  const handleDelete = async (id: string) => {
    // await deleteHalaqah(id);
    setHalaqahList(halaqahList.filter((h) => h.id !== id));
  };

  return (
    <Box w="full" maxW="container.md" mx="auto" p={4} overflow="hidden">
      <Heading mb={4} textAlign="center">
        Halaqah Saya
      </Heading>
      <Flex direction={{ base: "column", md: "row" }} gap={2} mb={4}>
        <Input placeholder="Cari Halaqah..." value={search} onChange={handleSearch} flex="1" />
        <Button colorScheme="green" onClick={handleAdd} w={{ base: "full", md: "auto" }}>
          Tambah Halaqah
        </Button>
      </Flex>
      <HalaqahTable halaqahList={halaqahList} onEdit={setEditData} onDelete={handleDelete} />
      <HalaqahForm isOpen={isOpen} onClose={onClose} editData={editData} setHalaqahList={setHalaqahList} />
    </Box>
  );
}
