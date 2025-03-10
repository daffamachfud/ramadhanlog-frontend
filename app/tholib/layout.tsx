"use client";

import { Box } from "@chakra-ui/react";
import BottomNav from "@/components/BottomNav";
import WarningModal from "@/components/WarningModal"; 

export default function TholibLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box minH="100vh" pt="0px" pb="80px"> {/* Tambahkan padding bottom lebih besar */}
    {/* <WarningModal/> */}
    {/* <Header title={title} /> */}
    {children}
    <BottomNav />
  </Box>
  );
}
