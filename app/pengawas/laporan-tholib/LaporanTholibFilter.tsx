import { useState, useEffect, useCallback } from "react";
import { Input, Button, Stack, Select } from "@chakra-ui/react";

interface Props {
  setFilters: (filters: { nama: string }) => void;
}

export default function LaporanTholibFilter({ setFilters }: Props) {
  const [nama, setNama] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters({ nama });
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeout);
  }, [nama, setFilters]);

  return (
    <Stack spacing={3} mb={4}>
      <Input
        placeholder="Cari berdasarkan nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
      />
    </Stack>
  );
}