"use client";

import { Box, Link, IconButton } from "@chakra-ui/react";
import BottomNav from "@/components/BottomNav";
import { FiPlus } from "react-icons/fi";

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box minH="100vh" pt="0px" pb="80px"> {/* Tambahkan padding bottom lebih besar */}
    {/* <WarningModal/> */}
    {/* <Header title={title} /> */}
    {children}
    <BottomNav />

     {/* Floating Action Button */}
     {(
        <Box position="fixed" bottom="90px" right="24px" zIndex={1000}>
          <Link href="/murabbi/amalan/create">
            <IconButton
              icon={<FiPlus />}
              aria-label="Tambah Post"
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
