"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Select } from "@chakra-ui/react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tholib"); // Default role adalah Tholib
  const [halaqahCode, setHalaqahCode] = useState(""); // Khusus Tholib
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    setError("");
    if (!name || !email || !password) {
      setError("Semua field harus diisi!");
      return;
    }

    if (role === "tholib" && !halaqahCode) {
      setError("Kode halaqah harus diisi untuk Tholib!");
      return;
    }

    try {
      const res = await fetch(api.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, halaqahCode }), // Perbaiki request body
      });
      console.log("response register : ",res)
      if (!res.ok) throw new Error("Registrasi gagal");

      router.push("/auth/login");
    } catch (err) {
      console.log("error register : ",err)
      setError("Registrasi gagal, coba lagi.");
    }
  };

  return (
    <Box minH="100vh" display="flex" justifyContent="center" alignItems="center" bg="gray.100">
      <Box w={{ base: "90%", md: "400px" }} p="6" boxShadow="lg" borderRadius="md" bg="white">
        <Heading size="lg" mb="4" textAlign="center">Daftar</Heading>
        <VStack spacing="4">
          {error && <Text color="red.500">{error}</Text>}
          <FormControl isRequired>
            <FormLabel>Nama Lengkap</FormLabel>
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan nama lengkap" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukkan email" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Role</FormLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="tholib">Tholib</option>
              <option value="murabbi">Murabbi</option>
            </Select>
          </FormControl>
          {role === "tholib" && (
            <FormControl isRequired>
              <FormLabel>Kode Halaqah</FormLabel>
              <Input type="text" value={halaqahCode} onChange={(e) => setHalaqahCode(e.target.value)} placeholder="Masukkan kode halaqah" />
            </FormControl>
          )}
          <Button colorScheme="blue" w="full" onClick={handleRegister}>
            Daftar
          </Button>
          <Text fontSize="sm">
            Sudah punya akun? <Link href="/auth/login" passHref><Text as="span" color="blue.500" cursor="pointer">Login</Text></Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}
