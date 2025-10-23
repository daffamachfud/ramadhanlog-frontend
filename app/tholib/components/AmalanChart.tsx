"use client";

import React from "react";
import { Box, Text, Tooltip, VStack, Skeleton, SkeletonText } from "@chakra-ui/react";

// 🔹 Tipe data untuk props
type AmalanChartProps = {
  data: { name: string; value: number }[];
  hijriDate?: string; // e.g., "21 Rabiul Akhir 1447 H"
  loading?: boolean; // optional external loading flag
};

// 🔹 Fungsi untuk menentukan warna berdasarkan jumlah amalan
const getColor = (value: number) => {
  if (value === 0) return "#ebedf0"; // Abu-abu (tidak ada laporan)
  if (value >= 1 && value <= 9) return "#196127"; // Hijau muda
  return "#0a4f20"; // Lebih dari 20 amalan
};

const extractMonthYear = (hijriDate?: string): string | null => {
  if (!hijriDate) return null;
  // Remove trailing 'H' and trim
  const cleaned = hijriDate.replace(/\s*H$/i, '').trim();
  const parts = cleaned.split(/\s+/);
  // Expect: [day, ...monthParts, year]
  if (parts.length < 3) return cleaned; // fallback raw if unexpected
  const year = parts[parts.length - 1];
  const month = parts.slice(1, -1).join(' ');
  return `${month} ${year} H`;
};

const AmalanChart: React.FC<AmalanChartProps> = ({ data, hijriDate, loading }) => {
  const monthYear = extractMonthYear(hijriDate || '');
  const isLoading = loading ?? (!data || data.length === 0);
  console.log("Hasil amalan chart : ", data);
  
  if (isLoading) {
    return (
      <Box p={3} bg="white" borderRadius="lg" boxShadow="md" fontWeight="bold">
        <SkeletonText noOfLines={1} skeletonHeight={3} w="50%" mb={2} />
        <Box display="flex" flexWrap="wrap" gap="4px" alignItems="center">
          {Array.from({ length: 30 }).map((_, i) => (
            <Skeleton key={i} height="14px" width="14px" borderRadius="2px" />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box p={3} bg="white" borderRadius="lg" boxShadow="md" fontWeight="bold">
      <Text fontSize="sm" mb={2}>
        Amalan Bulan : {monthYear || '-'}
      </Text>

      {/* 🔹 Grid dengan Label Tanggal */}
      <Box display="flex" flexWrap="wrap" gap="4px" alignItems="center">
        {data.map((item, index) => (
          <VStack key={index} spacing={1} align="center">
            {/* 🔹 Tooltip Sekarang Muncul */}
            <Tooltip label={`${item.name}: ${item.value} amalan`} hasArrow>
              <Box
                width="14px"
                height="14px"
                bg={getColor(item.value)}
                borderRadius="2px"
                transition="0.2s"
                tabIndex={0} // Agar Tooltip bisa muncul saat hover
                _hover={{ transform: "scale(1.1)", cursor: "pointer" }}
              />
            </Tooltip>
            <Text fontSize="xs" color="gray.600">
              {item.name.split(" ")[0]} {/* Hanya tampilkan angka hari */}
            </Text>
          </VStack>
        ))}
      </Box>

      {/* 🔹 Keterangan Warna */}
      {/* Keterangan Warna (opsional, dapat dibuat dinamis jika dibutuhkan) */}
    </Box>
  );
};

export default AmalanChart;
