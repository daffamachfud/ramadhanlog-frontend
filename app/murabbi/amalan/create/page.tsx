"use client";

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  IconButton,
  Text,
  Skeleton,
  HStack,
  Select,
  useToast,
} from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { api } from "@/lib/api";

export default function CreateAmalanPage() {
  const router = useRouter();
  const toast = useToast();

  const [forAll, setForAll] = useState(true);
  const [name, setNama] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState("");
  const [type, setType] = useState("checklist");
  const [halaqahList, setHalaqahList] = useState<Halaqah[]>([]);
  const [selectedHalaqah, setSelectedHalaqah] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  interface Halaqah {
    id: string;
    nama_halaqah: string;
    code: string;
    code_pengawas: string;
    jumlah_anggota: string;
  }

  useEffect(() => {
    if (
      !forAll &&
      halaqahList.length > 0 &&
      selectedHalaqah.length === halaqahList.length
    ) {
      setForAll(true);
      setSelectedHalaqah([]);
      toast({
        title: "Semua halaqah telah dipilih",
        description: "Sistem otomatis mengaktifkan Untuk semua halaqah",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [selectedHalaqah, halaqahList]);

  const fetchHalaqah = async () => {
    setLoading(true);
    try {
      const cookies = parseCookies();
      const token = cookies.token;
      const response = await fetch(api.halaqahMurabbi, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setHalaqahList(data.data);
      }
    } catch (error) {
      console.error("Gagal memuat halaqah", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!forAll) fetchHalaqah();
  }, [forAll]);

  const handleHalaqahCheck = (id: string) => {
    setSelectedHalaqah((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    // Validasi
    if (!name.trim() || !description.trim()) {
      toast({
        title: "Lengkapi semua kolom yang wajib diisi.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
  
    if (type === "dropdown" && !options.trim()) {
      toast({
        title: "Masukkan opsi dropdown.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
  
    if (!forAll && selectedHalaqah.length === 0) {
      toast({
        title: "Pilih minimal satu halaqah.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
  
    const cookies = parseCookies();
    const token = cookies.token;
  
    const payload = {
      name,
      description,
      type,
      options: type === "dropdown" ? options.split(",").map((o) => o.trim()) : [],
      is_for_all_halaqah: forAll,
      halaqah_ids: forAll ? [] : selectedHalaqah,
    };
  
    console.log("Payload to backend:", payload);
  
    try {
      const response = await fetch(api.addAmalan, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Gagal menambahkan amalan");
      }
  
      toast({
        title: "Amalan berhasil ditambahkan.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      router.push("/murabbi/amalan");
    } catch (error: any) {
      toast({
        title: "Gagal",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  return (
    <Box px={4} py={6}>
      <HStack>
        <IconButton
          aria-label="Kembali"
          icon={<FiArrowLeft />}
          onClick={() => router.back()}
          mb={4}
          variant="ghost"
        />
        <Heading size="md" mb={6}>
          Tambah Amalan
        </Heading>
      </HStack>

      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Nama Amalan</FormLabel>
          <Input
            placeholder="Contoh: Tilawah 1 Juz"
            value={name}
            onChange={(e) => setNama(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Deskripsi</FormLabel>
          <Textarea
            placeholder="Jelaskan amalan secara singkat..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Tipe Amalan</FormLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="checklist">Checklist</option>
            <option value="dropdown">Dropdown</option>
          </Select>
          <Text fontSize="sm" color="gray.500">
            Checklist untuk centang selesai, Dropdown untuk memilih dari
            beberapa opsi.
          </Text>
        </FormControl>

        {type === "dropdown" && (
          <FormControl>
            <FormLabel>Opsi Dropdown (pisahkan dengan koma)</FormLabel>
            <Input
              placeholder="Contoh: 2 rakaat, 4 rakaat, 6 rakaat"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
            />
            <Text fontSize="sm" color="gray.500">
              Hanya digunakan jika tipe amalan adalah dropdown.
            </Text>
          </FormControl>
        )}

        <FormControl>
          <Checkbox
            isChecked={forAll}
            onChange={(e) => setForAll(e.target.checked)}
          >
            Untuk semua halaqah?
          </Checkbox>
        </FormControl>

        {!forAll && (
          <Box>
            <Text mb={2} fontWeight="semibold">
              Pilih Halaqah:
            </Text>
            {loading ? (
              <Skeleton height="60px" />
            ) : (
              <VStack align="start" spacing={2}>
                {halaqahList.map((h: any) => (
                  <Checkbox
                    key={h.id}
                    isChecked={selectedHalaqah.includes(h.id)}
                    onChange={() => handleHalaqahCheck(h.id)}
                  >
                    {h.nama_halaqah}
                  </Checkbox>
                ))}
              </VStack>
            )}
          </Box>
        )}

        <Button colorScheme="teal" onClick={handleSubmit}>
          Simpan Amalan
        </Button>
      </VStack>
    </Box>
  );
}
