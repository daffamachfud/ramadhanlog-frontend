"use client";

import React from "react";
import { Box, Text, Tooltip, VStack, HStack } from "@chakra-ui/react";

// 🔹 Tipe data untuk props
type AmalanChartProps = {
  data: { name: string; value: number }[];
};

// 🔹 Fungsi untuk menentukan warna berdasarkan jumlah amalan
const getColor = (value: number) => {
  if (value === 0) return "#ebedf0"; // Abu-abu (tidak ada laporan)
  if (value >= 1 && value <= 9) return "#c6e48b"; // Hijau muda
  if (value >= 10 && value <= 15) return "#7bc96f"; // Hijau sedang
  return "#0a4f20"; // Lebih dari 20 amalan
};

const AmalanChart: React.FC<AmalanChartProps> = ({ data }) => {
  return (
    <Box p={3} bg="white" borderRadius="lg" boxShadow="md" fontWeight="bold">
      <Text fontSize="sm" mb={2}>
        Amalan Bulan : Ramadhan 1446 H
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
      <Box
        display="flex"
        flexDirection="column"
        gap={1}
        mt={2}
        fontSize="10px"
        color="gray.600"
      >
        <Box display="flex" alignItems="center">
          <Box w="10px" h="10px" bg="#ebedf0" borderRadius="3px" mr={2} />
          <Text as="span" fontWeight="bold">
            0
          </Text>{" "}
          <Text as="span" ml={1}>
            Amalan
          </Text>
        </Box>
        <Box display="flex" alignItems="center">
          <Box w="10px" h="10px" bg="#c6e48b" borderRadius="3px" mr={2} />
          <Text as="span" fontWeight="bold">
            1 - 9
          </Text>{" "}
          <Text as="span" ml={1}>
            Amalan
          </Text>
        </Box>
        <Box display="flex" alignItems="center">
          <Box w="10px" h="10px" bg="#7bc96f" borderRadius="3px" mr={2} />
          <Text as="span" fontWeight="bold">
            10 - 15
          </Text>{" "}
          <Text as="span" ml={1}>
            Amalan
          </Text>
        </Box>
        <Box display="flex" alignItems="center">
          <Box w="10px" h="10px" bg="#196127" borderRadius="3px" mr={2} />
          <Text as="span" fontWeight="bold">
            &gt; 20
          </Text>{" "}
          <Text as="span" ml={1}>
            Amalan
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default AmalanChart;
