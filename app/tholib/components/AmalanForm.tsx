"use client";

import { useState } from "react";
import { Box, Button, FormControl, FormLabel, Checkbox, VStack, Heading, Text, useBreakpointValue } from "@chakra-ui/react";

// Daftar amalan tetap
const AMALAN_LIST = [
  "Bangun + Wudhu",
  "Sholat Sunnah (Minimal 2 Rakaat)",
  "Istighfar di waktu sahur & berdoa",
  "Sahur dalam keadaan suci",
  "Menu Sahur (Air hangat + Kurma 3 butir)",
  "Stay di Masjid sebelum Shubuh",
  "Jaga Waktu Syuruq (Dzikir + Tilawah)",
  "Sedekah Shubuh minimal Rp 2000",
  "Sholat Dhuha minimal 4 Rakaat",
  "Qobliyyah Dzuhur 4 + Ba'diyah 2 rakaat",
  "Ifthor ala Nabi (Air + 3 butir kurma + buah)",
  "Ba'diyah Maghrib & Isya (masing-masing 2 rakaat)",
  "Sholat Tarawih (11 Rakaat)",
  "Tilawah minimal 1 juz / Hari",
  "Dialog Iman",
  "Tafakur Harian (minimal 3 menit)",
  "Menulis Ilmu & Informasi bermanfaat"
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

  return (
    <Box minH="100vh" p={4} bg="gray.100">
      <Box w={boxWidth} mx="auto" p={6} bg="white" boxShadow="md" borderRadius="md">
        <Heading size="lg" mb={4} textAlign="center">
          Catat Amalan Harian
        </Heading>
        <VStack spacing={4} align="stretch">
          {amalan.map((item, index) => (
            <FormControl key={index} p={2} borderWidth={1} borderRadius="md">
              <Checkbox isChecked={item.done} onChange={() => handleChecklistChange(index)}>
                <Text fontWeight="bold">{item.nama}</Text>
              </Checkbox>
            </FormControl>
          ))}
          <Button colorScheme="blue" w="full" onClick={handleSubmit}>
            Simpan Amalan
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
