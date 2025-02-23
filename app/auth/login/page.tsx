"use client";

import { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text } from "@chakra-ui/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    // Simulasi proses login
    if (!email || !password) {
      setError("Email dan password harus diisi!");
      return;
    }

    console.log("Logging in with:", { email, password });
    // Di sini nantinya kita akan memanggil API login
  };

  return (
    <Box minH="100vh" display="flex" justifyContent="center" alignItems="center" bg="gray.100">
      <Box w={{ base: "90%", md: "400px" }} p="6" boxShadow="lg" borderRadius="md" bg="white">
        <Heading size="lg" mb="4" textAlign="center">Login</Heading>
        <VStack spacing="4">
          {error && <Text color="red.500">{error}</Text>}
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
            />
          </FormControl>
          <Button colorScheme="blue" w="full" onClick={handleLogin}>
            Login
          </Button>
          <Text fontSize="sm">
            Belum punya akun? <a href="/auth/register" style={{ color: "blue" }}>Daftar</a>
          </Text>
          <Text fontSize="sm">
            <a href="/auth/reset-password" style={{ color: "blue" }}>Lupa password?</a>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}
