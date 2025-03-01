"use client";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Box, Text } from "@chakra-ui/react";

type AmalanChartProps = {
  data: { name: string; value: number }[];
};

const AmalanChart: React.FC<AmalanChartProps> = ({ data }) => {
  return (
    <Box p={3} bg="white" borderRadius="lg" boxShadow="md">
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Grafik <Text as="span" color="blue.500">Amalan Mingguan</Text>
      </Text>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} barCategoryGap={40} barSize={30}>
          {/* Garis bantu transparan agar lebih soft */}
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />

          {/* X-Axis: Menampilkan semua label */}
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 6, fill: "#555" }} 
            axisLine={false} 
            tickLine={false} 
            interval={0} // ✅ Pastikan semua label muncul
            tickMargin={10} 
          />
          
          {/* Tooltip minimalis */}
          <Tooltip 
            contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "none" }} 
            itemStyle={{ fontSize: "12px" }} 
          />

          {/* Bar dengan gradient */}
          <Bar 
            dataKey="value" 
            fill="url(#colorGradient)" 
            radius={[8, 8, 0, 0]} 
          />

          {/* Gradient agar lebih soft dan modern */}
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3182CE" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#90CDF4" stopOpacity={0.4} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AmalanChart;
