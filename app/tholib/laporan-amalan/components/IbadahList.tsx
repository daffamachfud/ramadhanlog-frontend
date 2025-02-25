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
  weeklyData: WeeklyReport[];
  dailyData: DailyReport[];
};

export default function IbadahList({ filter, weeklyData, dailyData }: IbadahListProps) {
  const data = filter === "weekly" ? weeklyData : dailyData;

  return (
    <Box bg="gray.50" p={4} borderRadius="md">
      <Text fontSize="sm" fontWeight="bold" mb={2}>Detail Laporan</Text>
      <VStack align="stretch" spacing={2}>
        {data.length === 0 ? (
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Tidak ada data tersedia
          </Text>
        ) : (
          data.map((item, index) => (
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
          ))
        )}
      </VStack>
    </Box>
  );
}
