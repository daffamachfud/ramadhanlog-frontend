"use client";

import { Box, VStack, Text, Badge } from "@chakra-ui/react";

// Definisi tipe data
type WeeklyReport = {
  day: string;
  completed: number;
  total: number;
};

type DailyReport = {
  name: string;
  done: boolean;
};

type IbadahListProps = {
  filter: "weekly" | "daily";
};

// Data Dummy yang sudah sesuai dengan tipe
const dummyData: {
  weekly: WeeklyReport[];
  daily: DailyReport[];
} = {
  weekly: [
    { day: "Senin", completed: 8, total: 10 },
    { day: "Selasa", completed: 7, total: 10 },
    { day: "Rabu", completed: 9, total: 10 },
    { day: "Kamis", completed: 6, total: 10 },
    { day: "Jumat", completed: 10, total: 10 },
  ],
  daily: [
    { name: "Tilawah", done: true },
    { name: "Sholat Tahajud", done: false },
    { name: "Sholat Dhuha", done: true },
    { name: "Sedekah", done: true },
  ],
};

export default function IbadahList({ filter }: IbadahListProps) {
  const data = dummyData[filter];

  return (
    <Box bg="gray.50" p={4} borderRadius="md">
      <Text fontSize="sm" fontWeight="bold" mb={2}>Detail Laporan</Text>
      <VStack align="stretch" spacing={2}>
        {data.map((item, index) => (
          <Box key={index} p={3} bg="white" boxShadow="sm" borderRadius="md">
            {filter === "weekly" ? (
              <>
                <Text fontSize="md" fontWeight="semibold">{(item as WeeklyReport).day}</Text>
                <Text>
                  Selesai:{" "}
                  <Badge colorScheme="blue">
                    {(item as WeeklyReport).completed}/{(item as WeeklyReport).total}
                  </Badge>
                </Text>
              </>
            ) : (
              <>
                <Text fontSize="md" fontWeight="semibold">{(item as DailyReport).name}</Text>
                <Badge colorScheme={(item as DailyReport).done ? "green" : "red"}>
                  {(item as DailyReport).done ? "Selesai" : "Belum"}
                </Badge>
              </>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
