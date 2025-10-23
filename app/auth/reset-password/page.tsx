"use client";

import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast({ title: "Email wajib diisi", status: "warning", position: "top" });
      return;
    }
    setIsLoading(true);
    try {
      // TODO: Integrasikan endpoint reset password backend di sini
      toast({
        title: "Permintaan terkirim",
        description: "Silakan periksa email Anda untuk instruksi reset.",
        status: "success",
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="480px" mx="auto" p={6}>
      <VStack align="stretch" spacing={6}>
        <Box>
          <Heading size="lg">Reset Password</Heading>
          <Text mt={2} color="gray.600">
            Masukkan email Anda. Kami akan mengirim tautan untuk mengatur ulang password.
          </Text>
        </Box>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="nama@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>
          Kirim Instruksi Reset
        </Button>
      </VStack>
    </Box>
  );
}
