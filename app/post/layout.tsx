"use client";

import { Box, Link, IconButton } from "@chakra-ui/react";
import BottomNav from "@/components/BottomNav";
import { FiPlus } from "react-icons/fi";
import { usePathname } from "next/navigation";

export default function PostLayout({ children }: { children: React.ReactNode }) {
const pathname = usePathname();
  const showFab = pathname.startsWith("/post") && pathname !== "/post/create";

  return (
    <Box minH="100vh" pt="0px" pb="80px"> {/* Tambahkan padding bottom lebih besar */}
    {/* <WarningModal/> */}
    {/* <Header title={title} /> */}
    {children}
    <BottomNav />

     {/* Floating Action Button */}
      {showFab && (
        <Box position="fixed" bottom="90px" right="24px" zIndex={1000}>
          <Link href="/post/create">
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
