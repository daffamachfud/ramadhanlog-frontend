"use client";

import { Box } from "@chakra-ui/react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function TholibLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box minH="100vh" pt="0px" pb="80px"> {/* Tambahkan padding bottom lebih besar */}
    {/* <Header title={title} /> */}
    {children}
    <BottomNav />
  </Box>
  );
}
