"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Box, Text } from "@chakra-ui/react";

type AmalanChartProps = {
  data: { name: string; value: number }[];
};

const AmalanChart: React.FC<AmalanChartProps> = ({ data }) => {
  return (
    <Box p={4} bg="white" borderRadius="lg" boxShadow="md">
      <Text fontSize="xl" fontWeight="bold" mb={4}>Grafik Amalan Mingguan</Text>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3182CE" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AmalanChart;
