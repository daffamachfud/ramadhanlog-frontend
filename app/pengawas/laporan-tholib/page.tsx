"use client";

import { useState, useEffect } from "react";
import { Box, Heading, Spinner } from "@chakra-ui/react";
import LaporanTholibTable from "./LaporanTholibTable";
import LaporanTholibFilter from "./LaporanTholibFilter";
import { fetchLaporanTholib } from "./laporanTholibService";
import { LaporanTholib } from "./types";

export default function LaporanTholibPage() {
  const [laporan, setLaporan] = useState<LaporanTholib[]>([]);
  const [filteredLaporan, setFilteredLaporan] = useState<LaporanTholib[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({ nama: ""});
  

  useEffect(() => {
    console.log("Fetching data with filter:", filters.nama); 
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchLaporanTholib(filters.nama);
        console.log("Data fetched:", data); 
        setLaporan(data);
        setFilteredLaporan(data);
      } catch (error) {
        console.error("Error fetching laporan tholib:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [filters]);

  return (
    <Box w="full" maxW="container.md" mx="auto" p={4} overflow="hidden">
      <Heading size="lg" mb={4} textAlign="center">
        Laporan Tholib
      </Heading>

      <LaporanTholibFilter setFilters={setFilters} />

      {loading ? (
        <Spinner size="lg" mt={4} />
      ) : (
        <LaporanTholibTable laporan={filteredLaporan} />
      )}
    </Box>
  );
}
