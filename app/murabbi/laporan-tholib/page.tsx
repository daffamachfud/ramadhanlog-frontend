"use client";

import { useState, useEffect } from "react";
import { Box, Heading } from "@chakra-ui/react";
import LaporanTholibTable from "./LaporanTholibTable";
import LaporanTholibFilter from "./LaporanTholibFilter";
import { fetchLaporanTholib } from "./laporanTholibService";
import { LaporanTholib } from "./types"; // Import tipe

export default function LaporanTholibPage() {
  const [laporan, setLaporan] = useState<LaporanTholib[]>([]);
  const [filteredLaporan, setFilteredLaporan] = useState<LaporanTholib[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await fetchLaporanTholib();
      setLaporan(data);
      setFilteredLaporan(data);
    }
    loadData();
  }, []);

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>Laporan Tholib</Heading>
      <LaporanTholibFilter laporan={laporan} setFilteredLaporan={setFilteredLaporan} />
      <LaporanTholibTable laporan={filteredLaporan} />
    </Box>
  );
}
