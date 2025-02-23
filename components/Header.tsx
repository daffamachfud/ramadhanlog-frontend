"use client";

import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell } from "lucide-react";

export default function Header({ title }: { title: string }) {
  const router = useRouter();

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
        <IconButton aria-label="Notifications" icon={<Bell size={20} />} variant="ghost" color="white" />
      </Flex>
    </Box>
  );
}
