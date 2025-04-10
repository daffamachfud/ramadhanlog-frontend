"use client";

import { Box, IconButton } from "@chakra-ui/react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";


export default function MurabbiLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = pathname.includes("halaqah")
    ? "Halaqah Saya"
    : pathname.includes("laporan-tholib")
    ? "Laporan Tholib"
    : pathname.includes("profile")
    ? "Profile"
    : "Dashboard Murabbi";

    const showFab =
  pathname.startsWith("/murabbi/amalan") &&
  !pathname.endsWith("/create") &&
  !/^\/murabbi\/amalan\/[0-9a-fA-F-]{36}$/.test(pathname);

  return (
    <Box minH="100vh" pt="0px" pb="120px">
    {/* <WarningModal/> */}
      {/* <Header title={title} /> */}
      {children}
      <BottomNav />

      {/* Floating Action Button */}
      {showFab && (
        <Box position="fixed" bottom="90px" right="24px" zIndex={1000}>
          <Link href="/murabbi/amalan/create">
            <IconButton
              icon={<FiPlus />}
              aria-label="Tambah Amalan"
              colorScheme="teal"
              size="lg"
              isRound
              boxShadow="lg"
            />
          </Link>
        </Box>
      )}
    </Box>
  );
}
