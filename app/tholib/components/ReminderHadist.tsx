"use client";

import { useState, useEffect } from "react";
import { Box, Text, Icon, VStack } from "@chakra-ui/react";
import { FaQuoteLeft } from "react-icons/fa";

type AmalanItem = {
  name: string;
  completed: boolean;
};

type ReminderHadisProps = {
  amalanList: AmalanItem[];
};

// Data statis keutamaan amalan
const hadisList = [
  { name: "ISTIGHFAR di Waktu Sahur & Berdoa", hadis: "Barang siapa memperbanyak istighfar, Allah akan memberikan jalan keluar dari setiap kesulitan. (HR. Ahmad)" },
  { name: "SAHUR dalam keadaan suci (ada wudhu)", hadis: "Barang siapa tidur dalam keadaan suci (berwudhu), maka malaikat akan mendoakannya sepanjang malam. (HR. Tirmidzi)" },
  { name: "Menu Sahur", hadis: "Sahur adalah makanan penuh berkah, janganlah kalian tinggalkan walaupun hanya dengan seteguk air. (HR. Ahmad)" },
  { name: "Stay di masjid sebelum adzan Shubuh", hadis: "Barang siapa duduk di masjid setelah shalat subuh hingga matahari terbit, lalu shalat dua rakaat, maka ia akan mendapatkan pahala haji dan umrah. (HR. Tirmidzi)" },
  { name: "SEDEKAH SHUBUH", hadis: "Setiap pagi, dua malaikat turun dan berdoa: 'Ya Allah, berikan ganti bagi yang bersedekah, dan binasakanlah harta orang yang menahan hartanya.' (HR. Bukhari & Muslim)" },
  { name: "Sholat Dhuha", hadis: "Barang siapa menjaga shalat Dhuha, akan diampuni dosanya meskipun sebanyak buih di lautan. (HR. Tirmidzi)" },
  { name: "Shalat Rawatib", hadis: "Barang siapa shalat sunnah rawatib 12 rakaat setiap hari, Allah akan bangunkan baginya sebuah rumah di surga. (HR. Muslim)" },
  { name: "Qobliyah Subuh (2 rakaat)", hadis: "Dua rakaat sebelum subuh lebih baik daripada dunia dan seisinya. (HR. Muslim)" },
  { name: "Qobliyah Dzuhur (4 rakaat)", hadis: "Barang siapa shalat sunnah sebelum dan setelah dzuhur, maka Allah akan mengharamkan baginya api neraka. (HR. Abu Dawud)" },
  { name: "Ba'da Dzuhur (2 rakaat)", hadis: "Shalat sunnah setelah dzuhur termasuk amalan yang dicintai Allah. (HR. Muslim)" },
  { name: "Ba'da Maghrib (2 rakaat)", hadis: "Barang siapa shalat dua rakaat setelah maghrib, maka Allah akan mencatatnya sebagai ahli ibadah. (HR. Tirmidzi)" },
  { name: "Ba'da Isya (2 rakaat)", hadis: "Shalat sunnah setelah isya termasuk ibadah yang sangat dianjurkan. (HR. Muslim)" },
  { name: "IFTHOR ALA NABI", hadis: "Rasulullah berbuka dengan kurma basah sebelum shalat, jika tidak ada, maka dengan kurma kering, jika tidak ada, maka dengan seteguk air. (HR. Abu Dawud)" },
  { name: "Sholat Tarawih", hadis: "Barang siapa shalat malam di bulan Ramadhan karena iman dan mengharap pahala, maka diampuni dosa-dosanya yang telah lalu. (HR. Bukhari & Muslim)" },
  { name: "Tilawah minimal", hadis: "Bacalah Al-Quran, karena ia akan menjadi syafa’at bagi pembacanya di hari kiamat. (HR. Muslim)" },
  { name: "Dialog Iman", hadis: "Iman itu bertambah dengan ketaatan dan berkurang dengan kemaksiatan. (HR. Bukhari)" },
  { name: "Tafaqur Harian", hadis: "Berpikir sesaat lebih baik daripada ibadah setahun. (HR. Abu Nu’aim)" },
  { name: "Menulis ILMU & INFORMASI bermanfaat", hadis: "Barang siapa menunjukkan kepada kebaikan, ia akan mendapatkan pahala seperti orang yang melakukannya. (HR. Muslim)" }
];

const ReminderHadis: React.FC<ReminderHadisProps> = ({ amalanList }) => {
  // Ambil hanya amalan yang belum terlaksana
  const notCompletedAmalan = amalanList.filter((amalan) => !amalan.completed);

  const [currentHadisIndex, setCurrentHadisIndex] = useState(0);

  // Ambil hadis untuk amalan yang belum dilakukan; jika semua selesai, tampilkan seluruh hadis tetap berputar
  const filteredHadisList = hadisList.filter((hadis) =>
    notCompletedAmalan.some((amalan) => amalan.name === hadis.name)
  );
  const displayHadisList = filteredHadisList.length > 0 ? filteredHadisList : hadisList;

  useEffect(() => {
    if (displayHadisList.length === 0) return; // Pastikan ada hadis sebelum menjalankan efek

    const interval = setInterval(() => {
      setCurrentHadisIndex((prevIndex) => (prevIndex + 1) % displayHadisList.length);
    }, 10000); // Ganti hadis setiap 10 detik

    return () => clearInterval(interval); // Membersihkan interval saat komponen unmount
  }, [displayHadisList.length]);

  const currentHadis = displayHadisList[currentHadisIndex];

  return (
    <Box p={4} bg="white" borderRadius="lg" boxShadow="md" textAlign="left">
      <VStack spacing={2}>
        <Icon as={FaQuoteLeft} color="blue.500" boxSize={6} />
        <Text fontSize="md" fontWeight="bold">
          {currentHadis?.hadis}
        </Text>
        <Text fontSize="sm" color="gray.500">- Keutamaan {currentHadis?.name} -</Text>
      </VStack>
    </Box>
  );
};

export default ReminderHadis;
