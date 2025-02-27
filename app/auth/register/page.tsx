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
      const formattedRole = role.toLowerCase(); 

      const res = await fetch(api.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: formattedRole, halaqahCode}),
      });
    
      console.log("Response Status:", res.status); // Debug status HTTP
    
      let data;
      try {
        data = await res.json(); // Coba parsing JSON
      } catch (jsonError) {
        console.error("JSON Parsing Error:", jsonError);
        throw new Error("Server memberikan respons yang tidak valid");
      }
    
      console.log("Response Data:", data); // Debug data response
    
      if (!res.ok) {
        throw new Error(data.message || `Registrasi gagal (Error ${res.status})`);
      }
    
      console.log("Registrasi berhasil:", data);
      router.push("/auth/login");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan yang tahu hanya Allah dan yang buat web";
      console.error("Error saat registrasi:", errorMessage);
      setError(errorMessage);
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
              <option value="murabbi">Murabbi</option>
              <option value="tholib">Tholib</option>
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
