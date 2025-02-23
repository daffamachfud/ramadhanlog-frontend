"use client";

import { useState,useEffect } from "react";
import { Box, Button, Checkbox, VStack, Heading, Text, useBreakpointValue } from "@chakra-ui/react";

const AMALAN_LIST = [
  "Bangun + Wudhu",
  "Sholat Sunnah (Minimal 2 Rakaat)",
  "Istighfar & Doa di waktu Sahur",
  "Sahur dalam Keadaan Suci",
  "Menu Sahur (Air hangat + Kurma 3 Butir)",
  "Dzikir & Tilawah Waktu Syuruq",
  "Sedekah Subuh (Minimal Rp 2000)",
  "Sholat Dhuha (Minimal 4 Rakaat)",
  "Qobliyyah & Ba'diyah Dzuhur",
  "Ifthor ala Nabi (Air + 3 Butir Kurma + Buah)",
  "Ba'diyah Maghrib & Isya",
  "Sholat Tarawih (11 Rakaat)",
  "Tilawah Minimal 1 Juz",
  "Dialog Iman",
  "Tafakur Harian (Minimal 3 Menit)",
  "Menulis Ilmu & Informasi Bermanfaat"
];

export default function CatatAmalanPage() {
  const [amalan, setAmalan] = useState(
    AMALAN_LIST.map((amalan) => ({ nama: amalan, done: false }))
  );

  const handleChecklistChange = (index: number) => {
    const updatedAmalan = [...amalan];
    updatedAmalan[index].done = !updatedAmalan[index].done;
    setAmalan(updatedAmalan);
  };

  const handleSubmit = () => {
    console.log("Data Amalan Harian:", amalan);
    alert("Amalan harian berhasil disimpan!");
  };

  const boxWidth = useBreakpointValue({ base: "100%", md: "400px" });

  // **Tanggal Masehi**
  const [dateInfo, setDateInfo] = useState("");

  useEffect(() => {
    const now = new Date();
    setDateInfo(
      now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, []);

  return (
    <Box minH="100vh" p={4} bg="gray.100">
      <Box w={boxWidth} mx="auto" p={6} bg="white" boxShadow="md" borderRadius="md">
        <Heading size="md" mb={4} textAlign="center">
          Catat Amalan Harian
        </Heading>
        <Text fontSize="sm" color="gray.600" textAlign="center">
          {dateInfo}
        </Text>
        <VStack spacing={3} align="stretch" mt={4}>
          {amalan.map((item, index) => (
            <Checkbox
              key={index}
              isChecked={item.done}
              onChange={() => handleChecklistChange(index)}
              p={3}
              borderWidth={1}
              borderRadius="md"
              bg={item.done ? "blue.50" : "white"}
            >
              <Text fontWeight="medium">{item.nama}</Text>
            </Checkbox>
          ))}
          <Button colorScheme="blue" w="full" onClick={handleSubmit} mt={4}>
            Simpan Amalan
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
