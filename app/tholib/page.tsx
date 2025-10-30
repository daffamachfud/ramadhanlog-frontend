"use client";

import { useState, useEffect } from "react";
import { Box, VStack } from "@chakra-ui/react";
import withAuth from "@/app/utils/withAuth";
import HeroNextPrayer from "@/components/Home/HeroNextPrayer";
import PrayerChips from "@/components/Home/PrayerChips";
import SmartCTA from "@/components/Home/SmartCTA";
import DailyProgressCard from "@/components/Home/DailyProgressCard";
import QuickLinks from "@/components/Home/QuickLinks";
import { PrayerKey, PrayerTime, findUpcoming, useEtaLabel } from "@/utils/time";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";

const TholibDashboard = () => {
  const [prayerTimes, setPrayerTimes] = useState({
    Subuh: '-', Terbit: '-', Dzuhur: '-', Ashar: '-', Maghrib: '-', Isya: '-', HijriDate: '-'
  });
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const { token } = parseCookies();
        if (!token) return;
        const res = await fetch(api.dashboardTholib, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include'
        });
        const data = await res.json();
        const pt = data?.prayerTimes || data?.data?.prayerTimes;
        if (pt) setPrayerTimes(pt);
        const rh = data?.ringkasanHarian || data?.data?.ringkasanHarian;
        const sa = data?.statusAmalan || data?.data?.statusAmalan;
        if (rh && typeof rh.completed === 'number' && typeof rh.total === 'number') {
          setProgress({ done: rh.completed, total: rh.total });
        } else if (sa) {
          const c = Array.isArray(sa.completed) ? sa.completed.length : 0;
          const n = Array.isArray(sa.notCompleted) ? sa.notCompleted.length : 0;
          setProgress({ done: c, total: c + n });
        }
      } catch (e) {
        console.error('Gagal memuat prayerTimes tholib:', e);
      }
    };
    load();
  }, []);

  const toHHMM = (t: string): `${number}${number}:${number}${number}` => {
    const s = t && t.includes(':') ? t : '00:00';
    return s as `${number}${number}:${number}${number}`;
  };
  const prayers: PrayerTime[] = [
    { key: 'subuh', label: 'Subuh', time: toHHMM(prayerTimes.Subuh) },
    { key: 'terbit', label: 'Terbit', time: toHHMM(prayerTimes.Terbit) },
    { key: 'dzuhur', label: 'Dzuhur', time: toHHMM(prayerTimes.Dzuhur) },
    { key: 'ashar', label: 'Ashar', time: toHHMM(prayerTimes.Ashar) },
    { key: 'maghrib', label: 'Maghrib', time: toHHMM(prayerTimes.Maghrib) },
    { key: 'isya', label: 'Isya', time: toHHMM(prayerTimes.Isya) },
  ];
  const upcomingKey: PrayerKey = (findUpcoming(prayers) as PrayerKey) || 'dzuhur';
  const nextItem = prayers.find(p => p.key === upcomingKey) || prayers[2];
  const etaLabel = useEtaLabel(nextItem.time, 30_000);

  return (
    <Box bg="gray.50" minH="100vh">
      <HeroNextPrayer
        city="Bandung"
        gregDate={new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()) + ' -'}
        hijriDate={prayerTimes.HijriDate}
        prayerLabel={nextItem.label}
        time={nextItem.time}
        etaLabel={etaLabel || 'Sudah Masuk Waktu'}
      >
        <PrayerChips items={prayers} upcomingKey={upcomingKey} fullWidth showTime onHero />
      </HeroNextPrayer>

      <VStack spacing={3} align="stretch" mt={2}>
        <SmartCTA progress={progress} />
        <QuickLinks />
        <DailyProgressCard progress={progress} />
      </VStack>
    </Box>
  );
};

export default withAuth(TholibDashboard, ["tholib"]);
