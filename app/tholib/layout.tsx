"use client";

import { Box } from "@chakra-ui/react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { usePathname } from "next/navigation";

export default function TholibLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = pathname.includes("catat-amalan")
    ? "Catat Amalan"
    : pathname.includes("laporan-amalan")
    ? "Laporan Ibadah"
    : pathname.includes("profile")
    ? "Profile"
    : "Dashboard Tholib";

  return (
    <Box minH="100vh" pt="60px" pb="60px">
      {/* <Header title={title} /> */}
      {children}
      <BottomNav />
    </Box>
  );
}
