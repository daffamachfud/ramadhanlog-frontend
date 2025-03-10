"use client";

import { useState, useEffect } from "react";
import React from 'react';
import { Box, Text, Flex, Skeleton, Icon } from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa"; // Ikon lokasi
import moment from "moment-hijri";

interface PrayerTimesProps {
  prayerTimes: {
    Subuh: string;
    Dzuhur: string;
    Ashar: string;
    Maghrib: string;
    Isya: string;
    HijriDate: string;
  };
}

// API Waktu Sholat
const CITY = "Kota Bandung";

const PrayerTimesHeader: React.FC<PrayerTimesProps> = ({ prayerTimes }) => {
  const [loading, setLoading] = useState(true);

  // ✅ Perbaikan: Gunakan useEffect untuk mendeteksi perubahan `prayerTimes`
  useEffect(() => {
    if (prayerTimes && Object.values(prayerTimes).every((time) => time)) {
      setLoading(false); // ✅ Set `loading` menjadi false setelah data tersedia
    }
  }, [prayerTimes]);

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

  console.log("Waktu data:", prayerTimes);

  return (
    <Box p={3} bg="blue.600" color="white" borderRadius="lg" boxShadow="md" mb={4}>
      {/* Baris 1: Lokasi dan Tanggal Hijriah & Masehi di Ujung Kanan */}
      <Flex justify="space-between" align="center" mb={2}>
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

      {/* Baris 2: Waktu Sholat (Satu Baris) */}
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
              <Text fontSize="xs" fontWeight="bold">{name}</Text>
              <Text fontSize="xs">{time}</Text>
            </Box>
            {index < array.length - 2 && <Box width="1px" bg="gray.200" height="20px" />} 
          </React.Fragment>
        );
      })}
</Flex>
    </Box>
  );
};

export default PrayerTimesHeader;
