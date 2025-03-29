"use client";

import { useState, useEffect } from "react";
import React from 'react';
import { Box, Text, Flex, Skeleton, Icon } from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa"; // Ikon lokasi
import moment from "moment-hijri";
import { WiDaySunny } from "react-icons/wi"; // Ikon cuaca
import { FaSun, FaMoon, FaCloudSun, FaCloudMoon, FaCloud, FaStar } from "react-icons/fa";
import { WiSunset, WiSunrise} from "react-icons/wi";



interface PrayerTimesProps {
  prayerTimes: {
    Subuh: string;
    Terbit: string;
    Dzuhur: string;
    Ashar: string;
    Maghrib: string;
    Isya: string;
    HijriDate: string;
  };
}

const prayerIcons: Record<string, JSX.Element> = {
  Subuh: <FaMoon size={16}  />,  // 🌙 Sebelum matahari terbit
  Terbit: <WiSunrise size={16} />,
  Dzuhur: <FaSun size={16}  />,  // ☀️ Tengah hari
  Ashar: <FaCloudSun size={16} />, // 🌤️ Sore
  Maghrib: <WiSunset size={16}  />, // 🌇 Matahari terbenam
  Isya: <FaCloudMoon size={16} />, // 🌟 Malam
};


// API Waktu Sholat
const CITY = "Kota Bandung";

const PrayerTimesHeader: React.FC<PrayerTimesProps> = ({ prayerTimes }) => {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm"));
  const [nextPrayer, setNextPrayer] = useState({ name: "", time: "" });

  // ✅ Perbaikan: Gunakan useEffect untuk mendeteksi perubahan `prayerTimes`
  useEffect(() => {
    if (prayerTimes && Object.values(prayerTimes).every((time) => time)) {
      setLoading(false); // ✅ Set `loading` menjadi false setelah data tersedia
    }

    // Update waktu setiap detik
    const timer = setInterval(() => {
      setCurrentTime(moment().format("HH:mm"));
      updateNextPrayer();
    }, 1000);

    return () => clearInterval(timer);

  }, [prayerTimes]);

    // Menentukan waktu sholat berikutnya
    const updateNextPrayer = () => {
      const now = moment();
      let upcoming: { name: string; time: string } | null = null; // ✅ Tentukan tipe eksplisit
  
      Object.entries(prayerTimes).forEach(([name, time]) => {
        if (name !== "HijriDate") {
          const prayerMoment = moment(time, "HH:mm");
          if (prayerMoment.isAfter(now) && !upcoming) {
            upcoming = { name, time };
          }
        }
      });
  
      setNextPrayer(upcoming || { name: "Subuh", time: prayerTimes.Subuh });
    };

  // Format tanggal Masehi
  const getFormattedDate = (): string => {
    const today = new Date();
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(today);
  };

  console.log("Waktu data:", prayerTimes);

  return (
    <Box
    p={4}
    bgGradient="linear(to-b, blue.800, blue.600)"
    color="white"
    boxShadow="lg"
    mb={4}
  >
    {/* Baris 1: Lokasi & Tanggal */}
    <Flex justify="space-between" align="center" mb={3}>
      {/* Lokasi */}
      <Flex align="center">
        <Icon as={FaMapMarkerAlt} boxSize={4} mr={2} />
        <Text fontSize="sm" fontWeight="bold">{CITY}</Text>
      </Flex>

      {/* Tanggal Hijriah & Masehi */}
      <Box textAlign="right">
        <Text fontSize="sm" fontWeight="bold">{prayerTimes.HijriDate}</Text>
        <Text fontSize="xs">{getFormattedDate()}</Text>
      </Box>
    </Flex>

    {/* Baris 2: Waktu saat ini & Countdown */}
    <Flex justify="center" direction="column" align="center" mb={3}>
      <Text fontSize="4xl" fontWeight="bold">{currentTime}</Text>
    </Flex>

    {/* Baris 3: Waktu Sholat */}
    <Flex justify="space-between" align="center">
  {loading
    ? Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} height="20px" width="50px" />
      ))
    : Object.entries(prayerTimes).map(([name, time], index, array) => {
        if (name === "HijriDate") return null; // Skip HijriDate

        return (
          <React.Fragment key={name}>
            <Box textAlign="center" minWidth="50px">
              <Flex justify="center" align="center" mb={1}>
                {prayerIcons[name]} {/* 🔹 Posisikan ikon di tengah */}
              </Flex>
              <Text fontSize="xs" fontWeight="bold">{name}</Text>
              <Text fontSize="xs">{time}</Text>
            </Box>
            {/* {index < array.length - 2 && <Box width="1px" bg="gray.200" height="20px" />}  */}
          </React.Fragment>
        );
      })}
</Flex>

  </Box>

  );
};

export default PrayerTimesHeader;
