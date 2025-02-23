"use client";

import { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Select } from "@chakra-ui/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tholib"); // Default role adalah Tholib
  const [halaqahCode, setHalaqahCode] = useState(""); // Khusus Tholib
  const [error, setError] = useState("");

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

    console.log("Registering with:", { name, email, password, role, halaqahCode });
    // Di sini nantinya kita akan memanggil API register
  };

  return (
    <Box minH="100vh" display="flex" justifyContent="center" alignItems="center" bg="gray.100">
      <Box w={{ base: "90%", md: "400px" }} p="6" boxShadow="lg" borderRadius="md" bg="white">
        <Heading size="lg" mb="4" textAlign="center">Daftar</Heading>
        <VStack spacing="4">
          {error && <Text color="red.500">{error}</Text>}
          <FormControl>
            <FormLabel>Nama Lengkap</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
            />
          </FormControl>
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
          <FormControl>
            <FormLabel>Role</FormLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="tholib">Tholib</option>
              <option value="murabbi">Murabbi</option>
            </Select>
          </FormControl>
          {role === "tholib" && (
            <FormControl>
              <FormLabel>Kode Halaqah</FormLabel>
              <Input
                type="text"
                value={halaqahCode}
                onChange={(e) => setHalaqahCode(e.target.value)}
                placeholder="Masukkan kode halaqah"
              />
            </FormControl>
          )}
          <Button colorScheme="blue" w="full" onClick={handleRegister}>
            Daftar
          </Button>
          <Text fontSize="sm">
            Sudah punya akun? <a href="/auth/login" style={{ color: "blue" }}>Login</a>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}
