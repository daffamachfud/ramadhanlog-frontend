"use client";

import { useState, useEffect } from "react";
import { 
  useToast, 
  Box, 
  Button, 
  Checkbox, 
  VStack, 
  Heading, 
  Text, 
  useBreakpointValue, 
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from "@chakra-ui/react";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";
import { useRef } from "react";

export default function CatatAmalanPage() {
  const [amalan, setAmalan] = useState<{ id: string; nama: string; done: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const toast = useToast();
  const cancelRef = useRef(null); // Tambahkan useRef

  useEffect(() => {
  const fetchAmalan = async () => {
    try {
      const cookies = parseCookies();
      const token = cookies.token;
      if (!token) {
        setError("Anda harus login terlebih dahulu.");
        setLoading(false);
        return;
      }

      const response = await fetch(api.getAmalanHarian, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      // Pastikan API mengembalikan status `done` dari database
      setAmalan(
        data.data.map((item: any) => ({
          id: item.id,
          nama: item.nama,
          done: item.done || false, // Pastikan done dari API dipakai
        }))
      );
    } catch (err) {
      setError("Gagal mengambil daftar amalan");
    } finally {
      setLoading(false);
    }
  };

  fetchAmalan();
}, []);

  const handleChecklistChange = (index: number) => {
    const updatedAmalan = [...amalan];
    updatedAmalan[index].done = !updatedAmalan[index].done;
    setAmalan(updatedAmalan);
  };

  const handleSubmit = async () => {
    const cookies = parseCookies();
    const token = cookies.token;
    if (!token) {
      toast({ title: "Anda harus login.", status: "error", duration: 3000 });
      return;
    }

    const selectedAmalan = amalan.filter((item) => item.done).map((item) => item.nama);
    if (selectedAmalan.length === 0) {
      toast({ title: "Pilih minimal satu amalan!", status: "warning", duration: 3000 });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(api.postAmalanHarian, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amalan: selectedAmalan }),
      });

      const result = await response.json();
      if (response.ok) {
        toast({ title: "Amalan harian berhasil disimpan!", status: "success", duration: 3000 });
      } else {
        toast({ title: result.message || "Gagal menyimpan amalan.", status: "error", duration: 3000 });
      }
    } catch (error) {
      toast({ title: "Terjadi kesalahan, coba lagi nanti.", status: "error", duration: 3000 });
    } finally {
      setIsSubmitting(false);
      setIsConfirmOpen(false);
    }
  };

  const boxWidth = useBreakpointValue({ base: "100%", md: "400px" });
  const [dateInfo, setDateInfo] = useState("");

  useEffect(() => {
    const now = new Date();
    setDateInfo(
      now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, []);

  return (
    <Box minH="100vh" p={4} bg="gray.100">
      <Box w={boxWidth} mx="auto" p={6} bg="white" boxShadow="md" borderRadius="md">
        <Heading size="md" mb={4} textAlign="center">Catat Amalan Harian</Heading>
        <Text fontSize="sm" color="gray.600" textAlign="center">{dateInfo}</Text>

        {loading ? (
          <Text textAlign="center" mt={4}>Memuat...</Text>
        ) : error ? (
          <Text color="red.500" textAlign="center" mt={4}>{error}</Text>
        ) : (
          <VStack spacing={3} align="stretch" mt={4}>
            {amalan.map((item, index) => (
              <Checkbox
                key={item.id}
                isChecked={item.done}
                onChange={() => handleChecklistChange(index)}
                p={3}
                borderWidth={1}
                borderRadius="md"
                bg={item.done ? "blue.50" : "white"}
              >
                <Text fontWeight="medium">{item.nama}</Text>
              </Checkbox>
            ))}
            <Button colorScheme="blue" w="full" onClick={() => setIsConfirmOpen(true)} mt={4} isLoading={isSubmitting}>
              Simpan Amalan
            </Button>
          </VStack>
        )}
      </Box>

      <AlertDialog isOpen={isConfirmOpen}  leastDestructiveRef={cancelRef}  onClose={() => setIsConfirmOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Konfirmasi</AlertDialogHeader>
            <AlertDialogBody>Apakah Anda yakin ingin menyimpan amalan hari ini?</AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setIsConfirmOpen(false)}>Batal</Button>
              <Button colorScheme="blue" ml={3} onClick={handleSubmit} isLoading={isSubmitting}>
                Simpan
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
