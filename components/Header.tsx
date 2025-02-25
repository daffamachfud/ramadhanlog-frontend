"use client";

import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";
import { destroyCookie } from "nookies";

export default function Header({ title }: { title: string }) {
  const router = useRouter();

  const handleLogout = () => {
    // Hapus token dari cookie
    destroyCookie(null, "token");

    // Redirect ke halaman login
    router.push("/auth/login");
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      bg="black"
      color="white"
      boxShadow="md"
      zIndex="1000"
      py={3}
    >
      <Flex justify="space-between" align="center" px={4}>
        <Text fontSize="lg" fontWeight="bold">
          {title}
        </Text>
        <IconButton
          aria-label="Logout"
          icon={<LogOut size={20} />}
          variant="ghost"
          color="white"
          onClick={handleLogout}
        />
      </Flex>
    </Box>
  );
}
