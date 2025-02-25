"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email dan password harus diisi!");
      return;
    }

    try {
      const res = await fetch(api.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login gagal, periksa kembali kredensial Anda.");
      }

      // Simpan token ke cookie agar bisa diakses middleware
      setCookie(null, "token", data.token, {
        maxAge: 60 * 60 * 24, // Berlaku 1 hari
        path: "/",
      });

      setCookie(null, "role", data.role, {
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      // Redirect ke dashboard setelah login
      if (data.role === "murabbi") {
        router.push("/murabbi");
      } else {
        router.push("/tholib");
      }
    } catch (err) {
      // Perbaikan tipe error unknown → konversi ke Error
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan, coba lagi.");
      }
    }
  };

  return (
    <Box minH="100vh" display="flex" justifyContent="center" alignItems="center" bg="gray.100">
      <Box w={{ base: "90%", md: "400px" }} p="6" boxShadow="lg" borderRadius="md" bg="white">
        <Heading size="lg" mb="4" textAlign="center">Login</Heading>
        <VStack spacing="4">
          {error && <Text color="red.500">{error}</Text>}
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
            />
          </FormControl>
          <FormControl isRequired>
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
            Belum punya akun? <Link href="/auth/register" passHref><Text as="span" color="blue.500" cursor="pointer">Daftar</Text></Link>
          </Text>
          <Text fontSize="sm">
            <Link href="/auth/reset-password" passHref><Text as="span" color="blue.500" cursor="pointer">Lupa password?</Text></Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}
