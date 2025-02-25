import { useState, useEffect } from "react";
import { Input, Button, Stack, Select } from "@chakra-ui/react";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";

interface Props {
  setFilters: (filters: { nama: string; halaqah: string }) => void;
}

export default function LaporanTholibFilter({ setFilters }: Props) {
  const [nama, setNama] = useState("");
  const [halaqah, setHalaqah] = useState("");
  const [halaqahList, setHalaqahList] = useState<{ id: number; nama_halaqah: string }[]>([]);

  useEffect(() => {
    async function fetchHalaqah() {
      const cookies = parseCookies();
      const token = cookies.token;
      if (!token) return;
  
      try {
        const response = await fetch(api.halaqahMurabbi, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const result = await response.json();
        console.log("Halaqah API Response:", result); // Debugging
  
        if (Array.isArray(result.data)) {
          setHalaqahList(result.data); // Ambil dari `data`
        } else {
          console.error("Response bukan array:", result);
          setHalaqahList([]);
        }
      } catch (error) {
        console.error("Gagal mengambil daftar halaqah:", error);
        setHalaqahList([]);
      }
    }
  
    fetchHalaqah();
  }, []);

  const handleFilter = () => {
    setFilters({ nama, halaqah });
  };

  return (
    <Stack spacing={3} mb={4}>
      <Input
        placeholder="Cari berdasarkan nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
      />

      <Select
        placeholder="Pilih Halaqah"
        value={halaqah}
        onChange={(e) => setHalaqah(e.target.value)}
      >
        {halaqahList.map((h) => (
          <option key={h.id} value={h.nama_halaqah}>
            {h.nama_halaqah}
          </option>
        ))}
      </Select>

      <Button colorScheme="blue" onClick={handleFilter}>
        Terapkan Filter
      </Button>
    </Stack>
  );
}
