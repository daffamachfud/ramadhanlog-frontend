"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Email dan password harus diisi!");
      setIsLoading(false);
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

      setCookie(null, "role", data.user.role, {
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      // Redirect ke dashboard setelah login
      if (data.user.role === "murabbi") {
        router.push("/murabbi");
      } else if ( data.user.role === "pengawas"){
        router.push("/pengawas");
      }else {
        router.push("/tholib");
      }
    } catch (err) {
      // Perbaikan tipe error unknown → konversi ke Error
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan, coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-b, gray.50, white)"
      position="relative"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={6}
    >
      {/* Background accents */}
      <Box position="absolute" top="-24" right="-24" w="72" h="72" bgGradient="radial(blue.100, transparent 60%)" filter="blur(18px)" />
      <Box position="absolute" bottom="-24" left="-24" w="72" h="72" bgGradient="radial(teal.100, transparent 60%)" filter="blur(18px)" />

      <Box
        w={{ base: "100%", md: "420px" }}
        p={{ base: 6, md: 8 }}
        bg={useColorModeValue("white", "gray.800")}
        borderWidth="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        borderRadius="xl"
        boxShadow="md"
      >
        <VStack spacing={1} mb={6} textAlign="center">
          <Heading size="lg">Masuk ke Haizum</Heading>
          <Text color={useColorModeValue("gray.600", "gray.300")}>Lanjutkan catatan amalan harianmu</Text>
        </VStack>

        <VStack spacing={4} align="stretch">
          {error && (
            <Box bg="red.50" borderWidth="1px" borderColor="red.200" color="red.600" p={3} borderRadius="md">
              {error}
            </Box>
          )}

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@domain.com"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin();
                }}
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  variant="ghost"
                  size="sm"
                  icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  onClick={() => setShowPassword((s) => !s)}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button colorScheme="blue" w="full" onClick={handleLogin} isLoading={isLoading}>
            Masuk
          </Button>

          <VStack spacing={1} pt={2}>
            <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}> 
              Belum punya akun? {" "}
              <Link href="/auth/register" passHref>
                <Text as="span" color="blue.500" cursor="pointer">Daftar</Text>
              </Link>
            </Text>
            <Text fontSize="sm">
              <Link href="/auth/reset-password" passHref>
                <Text as="span" color="blue.500" cursor="pointer">Lupa password?</Text>
              </Link>
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}
