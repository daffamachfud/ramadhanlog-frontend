"use client";

import { useState, useEffect } from "react";
import AmalanWrapped from "./AmalanWrapped";
import { Spinner, Box, Text } from "@chakra-ui/react";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";

// 🟢 Definisikan tipe data sesuai dengan yang digunakan di AmalanWrapped.tsx
interface AmalanData {
  totalAmalan: number;
  hariAktif: string;
  mostActiveDay: {hijri_date:string, count: number};
  topAmalan?: { name: string }[];
  reportedDays: number;
  missedDays: number;
}

export default function Page() {
  const [data, setData] = useState<AmalanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
         const cookies = parseCookies();
                const token = cookies.token;
                if (!token) {
                  setIsLoading(false);
                  return;
                }

        const response = await fetch(api.getWrapped, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="100vh">
        <Spinner size="xl" color="blue.500" />
        <Text ml={3} fontSize="xl">Memuat data...</Text>
      </Box>
    );
  }

  // 🔹 Pastikan data tidak null sebelum dikirim ke AmalanWrapped
  if (!data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="100vh">
        <Text fontSize="xl">Gagal mengambil data 😢</Text>
      </Box>
    );
  }

  return <AmalanWrapped data={data} />;
}
