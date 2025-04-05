"use client";

import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { Home, User, BookOpen, List, BarChart } from "lucide-react";

const bottomNavItems = {
  tholib: [
    { label: "Home", icon: <Home size={20} />, path: "/tholib" },
    { label: "Amalan", icon: <BookOpen size={20} />, path: "/tholib/amalan" },
    { label: "Laporan", icon: <BarChart size={20} />, path: "/tholib/laporan-amalan" },
    { label: "Profile", icon: <User size={20} />, path: "/tholib/profile" },
  ],
  murabbi: [
    { label: "Dashboard", icon: <Home size={20} />, path: "/murabbi" },
    { label: "Laporan", icon: <BarChart size={20} />, path: "/murabbi/laporan-tholib" },
    { label: "Halaqah", icon: <List size={20} />, path: "/murabbi/halaqah" },
    { label: "Profile", icon: <User size={20} />, path: "/murabbi/profile" },
  ],
  pengawas: [
    { label: "Dashboard", icon: <Home size={20} />, path: "/pengawas" }, // Sama dengan Murabbi
    { label: "Amalan", icon: <BookOpen size={20} />, path: "/pengawas/amalan" }, // Sama dengan Tholib
    { label: "Laporan", icon: <BarChart size={20} />, path: "/pengawas/laporan-tholib" }, // Sama dengan Murabbi
    { label: "Profile", icon: <User size={20} />, path: "/pengawas/profile" }, // Sama dengan Murabbi
  ],
};

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const role = pathname.startsWith("/tholib")
  ? "tholib"
  : pathname.startsWith("/murabbi")
  ? "murabbi"
  : "pengawas";

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      width="100%"
      bg="black"
      color="white"
      boxShadow="lg"
      zIndex="1000"
    >
      <Flex justify="space-around" py={2}>
        {bottomNavItems[role].map((item) => (
          <Flex
            key={item.path}
            direction="column"
            align="center"
            cursor="pointer"
            onClick={() => router.push(item.path)}
          >
            <IconButton
              aria-label={item.label}
              icon={item.icon}
              variant="ghost"
              color={pathname === item.path ? "blue.400" : "white"}
            />
            <Text fontSize="xs" color={pathname === item.path ? "blue.400" : "white"}>
              {item.label}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
