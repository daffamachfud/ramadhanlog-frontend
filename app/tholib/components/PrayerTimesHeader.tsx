"use client";

import { useState, useEffect } from "react";
import { Box, Text, Flex, Skeleton, Icon } from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa"; // Ikon lokasi
import moment from "moment-hijri";

// API Waktu Sholat
const PRAYER_API_URL = "https://api.aladhan.com/v1/timingsByCity";
const CITY = "Bandung";
const COUNTRY = "Indonesia";

const PrayerTimesHeader = () => {
  const [prayerTimes, setPrayerTimes] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrayerTimes() {
      try {
        const response = await fetch(`${PRAYER_API_URL}?city=${CITY}&country=ID&method=2`);
        const data = await response.json();

        if (data.code === 200) {
          setPrayerTimes(data.data.timings);
        }
      } catch (error) {
        console.error("Gagal mengambil data waktu sholat:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrayerTimes();
  }, []);

  // Format tanggal Hijriah
  const hijriDate = moment().format("iD iMMMM iYYYY") + " H";

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

  return (
    <Box p={3} bg="blue.600" color="white" borderRadius="lg" boxShadow="md" mb={4}>
      {/* Baris 1: Lokasi dan Tanggal Hijriah & Masehi di Ujung Kanan */}
      <Flex justify="space-between" align="center" mb={2}>
        {/* Lokasi */}
        <Flex align="center">
          <Icon as={FaMapMarkerAlt} boxSize={4} mr={2} />
          <Text fontSize="sm" fontWeight="bold">{CITY}, {COUNTRY}</Text>
        </Flex>

        {/* Tanggal Hijriah & Masehi */}
        <Box textAlign="right">
          <Text fontSize="sm" fontWeight="bold">{hijriDate}</Text>
          <Text fontSize="xs">{getFormattedDate()}</Text>
        </Box>
      </Flex>

      {/* Baris 2: Waktu Sholat (Satu Baris) */}
      <Flex justify="space-between" align="center">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height="20px" width="60px" />
            ))
          : Object.entries({
              Subuh: prayerTimes.Fajr,
              Dzuhur: prayerTimes.Dhuhr,
              Ashar: prayerTimes.Asr,
              Maghrib: prayerTimes.Maghrib,
              Isya: prayerTimes.Isha,
            }).map(([name, time]) => (
              <Box key={name} textAlign="center" minWidth="60px">
                <Text fontSize="xs" fontWeight="bold">{name}</Text>
                <Text fontSize="sm">{time}</Text>
              </Box>
            ))}
      </Flex>
    </Box>
  );
};

export default PrayerTimesHeader;
