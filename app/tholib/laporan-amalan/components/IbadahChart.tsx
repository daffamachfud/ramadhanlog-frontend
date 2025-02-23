"use client";

import { Box, Text } from "@chakra-ui/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const dummyData = {
  weekly: [
    { day: "Sen", total: 10, completed: 8 },
    { day: "Sel", total: 10, completed: 7 },
    { day: "Rab", total: 10, completed: 9 },
    { day: "Kam", total: 10, completed: 6 },
    { day: "Jum", total: 10, completed: 10 },
    { day: "Sab", total: 10, completed: 7 },
    { day: "Min", total: 10, completed: 8 },
  ],
  daily: [
    { name: "Tilawah", total: 1, completed: 1 },
    { name: "Sholat Tahajud", total: 1, completed: 0 },
    { name: "Sholat Dhuha", total: 1, completed: 1 },
    { name: "Sedekah", total: 1, completed: 1 },
  ],
};

export default function IbadahChart({ filter }: { filter: "weekly" | "daily" }) {
  const data = dummyData[filter];

  return (
    <Box p={4} bg="gray.50" borderRadius="md" mb={4}>
      <Text fontSize="sm" fontWeight="bold" mb={2}>Grafik Capaian Ibadah</Text>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey={filter === "weekly" ? "day" : "name"} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="completed" fill="#3182CE" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
