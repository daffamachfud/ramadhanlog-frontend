"use client";

import { Box, Flex, VStack, Text, Icon, Button } from "@chakra-ui/react";
import { FiHome, FiUsers, FiBarChart2, FiSettings, FiLogOut, FiCheckSquare } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import { BsPersonBadge } from "react-icons/bs";

const sidebarItemsMurabbi = [
  { name: "Dashboard", icon: FiHome, path: "/murabbi" },
  { name: "Halaqah Saya", icon: FiUsers, path: "/murabbi/halaqah" },
  { name: "Laporan Tholib", icon: FiBarChart2, path: "/murabbi/laporan-tholib" },
  { name: "Profil", icon: FiSettings, path: "/murabbi/profile" },
];

const sidebarItemsTholib = [
  { name: "Dashboard", icon: FiHome, path: "/tholib" },
  { name: "Catat Amalan", icon: FiCheckSquare, path: "/tholib/catat-amalan" },
  { name: "Laporan Amalan", icon: FiBarChart2, path: "/tholib/laporan-amalan" },
  { name: "Profil", icon: BsPersonBadge, path: "/tholib/profile" },
];

export default function Sidebar({ role = "Murabbi" }) {
  const router = useRouter();
  const pathname = usePathname();
  const sidebarItems = role === "Murabbi" ? sidebarItemsMurabbi : sidebarItemsTholib;

  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Box w={{ base: "70px", md: "250px" }} bg="blue.700" color="white" p={4}>
        <VStack align="stretch" spacing={4}>
          <Text fontSize="xl" fontWeight="bold" textAlign="center" display={{ base: "none", md: "block" }}>
            {role} Dashboard
          </Text>
          {sidebarItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              leftIcon={<Icon as={item.icon} />}
              justifyContent="flex-start"
              colorScheme={pathname === item.path ? "blue" : "whiteAlpha"}
              onClick={() => router.push(item.path)}
            >
              <Text display={{ base: "none", md: "block" }}>{item.name}</Text>
            </Button>
          ))}
          <Button leftIcon={<FiLogOut />} colorScheme="red" variant="ghost" justifyContent="flex-start">
            <Text display={{ base: "none", md: "block" }}>Logout</Text>
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}
