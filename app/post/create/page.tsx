// File: app/posts/create/page.jsx

"use client";

import {
  Box,
  Button,
  FormControl,
  Input,
  VStack,
  HStack,
  IconButton,
  useToast,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { parseCookies } from "nookies";
import dynamic from 'next/dynamic';
import { api } from "@/lib/api";

// Komentar Penting: Impor CSS react-quill.
// Untuk performa terbaik, impor file CSS ini sekali saja di file layout global
// aplikasi Anda (contoh: app/layout.jsx atau pages/_app.js).
import 'react-quill/dist/quill.snow.css';

// Komentar Penting: Menggunakan dynamic import untuk ReactQuill adalah praktik
// wajib di Next.js. Ini didefinisikan di luar komponen, tapi bukan hook.
const ReactQuill = dynamic(() => import('react-quill'), { 
    ssr: false, // Menonaktifkan render sisi server untuk komponen ini
    loading: () => (
      <VStack py={8}>
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="teal.500" size="xl" />
        <Text color="gray.500">Memuat editor...</Text>
      </VStack>
    )
});

type PostStatus = 'draft' | 'published';

export default function CreatePostPage() {
  const router = useRouter();
  const toast = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // Menyimpan konten dalam format HTML
  const [isLoading, setIsLoading] = useState(false);

  // Konfigurasi untuk toolbar pada editor Quill
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
  };
  
  const handleSubmit = async (status: PostStatus) => {
    // 1. Validasi input
    if (!title.trim()) {
      toast({ title: "Judul tidak boleh kosong.", status: "warning", position: 'top' });
      return;
    }
    const plainTextContent = content.replace(/<[^>]*>/g, '').trim();
    if (!plainTextContent) {
      toast({ title: "Konten tidak boleh kosong.", status: "warning", position: 'top' });
      return;
    }

    setIsLoading(true);

    // 2. Otentikasi
    const cookies = parseCookies();
    const token = cookies.token;
    if (!token) {
       toast({ title: "Otentikasi gagal.", description: "Silakan login kembali.", status: "error", position: 'top' });
       setIsLoading(false);
       return;
    }

    // 3. Persiapan payload. Pastikan backend Anda menerima field 'status'.
    const payload = { title, content, status };

    // 4. Pengiriman data ke API menggunakan Fetch
    try {
      const response = await fetch(api.createPost, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Jika response error, coba parse pesannya dari backend
        const result = await response.json();
        throw new Error(result.message || "Gagal membuat postingan.");
      }
     
      toast({
        title: "Berhasil!",
        description: `Postingan telah ${status === 'published' ? 'diterbitkan' : 'disimpan sebagai draf'}.`,
        status: "success",
        position: 'top',
        duration: 3000,
        isClosable: true,
      });

      router.push("/post"); // Redirect ke halaman yang sesuai

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Gagal membuat postingan.';
      toast({
        title: "Terjadi Kesalahan",
        description: message,
        status: "error",
        position: 'top',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="800px" mx="auto" px={{ base: 4, md: 6 }} py={{ base: 6, md: 8 }}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between" align="center">
          <IconButton
            aria-label="Kembali"
            icon={<FiArrowLeft size="1.5em" />}
            onClick={() => router.back()}
            variant="ghost"
          />
          <HStack spacing={4}>
            <Button
              variant="ghost"
              onClick={() => handleSubmit('draft')}
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              Simpan Draf
            </Button>
            <Button
              colorScheme="teal"
              onClick={() => handleSubmit('published')}
              isLoading={isLoading}
              loadingText="Menerbitkan"
              isDisabled={isLoading}
            >
              Terbitkan
            </Button>
          </HStack>
        </HStack>

        <VStack spacing={6} as="main" align="stretch">
          <FormControl>
            <Input
              placeholder="Judul Postingan..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="unstyled"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="bold"
              autoFocus
            />
          </FormControl>

          <FormControl>
            <Box 
              className="quill-editor-container" 
              sx={{
                // Kustomisasi style Quill agar mirip tema Chakra
                '.ql-editor': { minHeight: '300px', fontSize: 'lg' },
                '.ql-container': { borderBottomRadius: 'md' },
                '.ql-toolbar': { borderTopRadius: 'md' }
              }}
            >
               <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  placeholder="Mulai tulis ceritamu..."
               />
            </Box>
          </FormControl>
        </VStack>
      </VStack>
    </Box>
  );
}
