import { Input, Select, Flex } from "@chakra-ui/react";
import { LaporanTholib } from "./types";

export default function LaporanTholibFilter({
  laporan,
  setFilteredLaporan,
}: {
  laporan: LaporanTholib[];
  setFilteredLaporan: (data: LaporanTholib[]) => void;
}) {
  const handleFilter = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let filteredData = laporan;

    if (name === "search" && value) {
      filteredData = filteredData.filter((tholib) =>
        tholib.nama.toLowerCase().includes(value.toLowerCase())
      );
    }

    if (name === "halaqah" && value) {
      filteredData = filteredData.filter((tholib) => tholib.halaqah === value);
    }

    setFilteredLaporan(filteredData);
  };

  return (
    <Flex gap={4} mb={4}>
      <Input
        name="search"
        placeholder="Cari Nama Tholib"
        onChange={handleFilter}
      />
      <Select
        name="halaqah"
        placeholder="Pilih Halaqah"
        onChange={handleFilter}
      >
        {Array.from(new Set(laporan.map((tholib) => tholib.halaqah || ""))).map(
          (halaqah) => (
            <option key={halaqah} value={halaqah}>
              {halaqah}
            </option>
          )
        )}
      </Select>
    </Flex>
  );
}
