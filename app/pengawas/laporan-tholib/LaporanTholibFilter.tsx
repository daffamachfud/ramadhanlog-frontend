import { useState, useEffect } from "react";
import { Input, Button, Stack, Select } from "@chakra-ui/react";

interface Props {
  setFilters: (filters: { nama: string; }) => void;
}

export default function LaporanTholibFilter({ setFilters }: Props) {
  const [nama, setNama] = useState("");
 
  const handleFilter = () => {
    setFilters({ nama });
  };

  return (
    <Stack spacing={3} mb={4}>
      <Input
        placeholder="Cari berdasarkan nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
      />

      <Button colorScheme="blue" onClick={handleFilter}>
        Terapkan Filter
      </Button>
    </Stack>
  );
}
