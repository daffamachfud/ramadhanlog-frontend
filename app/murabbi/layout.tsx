"use client";

import { Box } from "@chakra-ui/react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { usePathname } from "next/navigation";
import WarningModal from "@/components/WarningModal"; 

export default function MurabbiLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = pathname.includes("halaqah")
    ? "Halaqah Saya"
    : pathname.includes("laporan-tholib")
    ? "Laporan Tholib"
    : pathname.includes("profile")
    ? "Profile"
    : "Dashboard Murabbi";

  return (
    <Box minH="100vh" pt="2px" pb="80px">
    {/* <WarningModal/> */}
      {/* <Header title={title} /> */}
      {children}
      <BottomNav />
    </Box>
  );
}
