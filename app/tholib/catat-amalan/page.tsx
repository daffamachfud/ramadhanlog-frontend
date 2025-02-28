"use client";

import { useState, useEffect, useRef } from "react";
import {
  useToast,
  Box,
  Button,
  Checkbox,
  Select,
  VStack,
  Heading,
  Text,
  Divider,
  Stack,
  Flex,
  useBreakpointValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";
import moment from "moment-hijri";

interface Amalan {
  id: string;
  nama: string;
  description?: string;
  type: "checklist" | "dropdown";
  options?: string[];
  parent_id?: string | null;
  done: boolean;
  nilai: string | null;
  isParent: boolean;
}

export default function CatatAmalanPage() {
  const [amalan, setAmalan] = useState<Amalan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedAmalan, setSelectedAmalan] = useState<string[]>([]); // State untuk mengubah warna box
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: string;
  }>({}); // Untuk nilai dropdown
  const toast = useToast();
  const cancelRef = useRef(null);

  moment.locale("en");

  // Format tanggal Hijriah dengan nama bulan dalam huruf Latin
  const hijriDate = moment().format("iD iMMMM iYYYY") + " H";

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
        console.log("hasil fecth : ", data.data);
        if (!data.success) throw new Error(data.message);

        const parentIds = new Set(
          data.data.map((item: any) => item.parentId).filter(Boolean)
        );

        setAmalan(
          data.data.map((item: any) => ({
            id: item.id,
            nama: item.nama,
            description: item.description || "",
            type: item.type,
            options: item.options ? JSON.parse(item.options) : null,
            parent_id: item.parent_id,
            done: item.done || false,
            item: item.nilai,
            isParent: parentIds.has(item.id), // ✅ Amalan parent ditandai di sini
          }))
        );
        // ✅ Simpan nilai dropdown yang sudah dipilih sebelumnya
        const initialSelectedValues: { [key: string]: string } = {};
        data.data.forEach((item: any) => {
          if (item.type === "dropdown" && item.nilai) {
            initialSelectedValues[item.id] = item.nilai;
          }
        });
        setSelectedValues(initialSelectedValues);
      } catch (err) {
        setError("Gagal mengambil daftar amalan");
      } finally {
        setLoading(false);
      }
    };

    fetchAmalan();
  }, []);

  const toggleChecklist = (index: number) => {
    const updatedAmalan = [...amalan];
    updatedAmalan[index].done = !updatedAmalan[index].done;
    setAmalan(updatedAmalan);

    setSelectedAmalan((prev) =>
      updatedAmalan[index].done
        ? [...prev, updatedAmalan[index].id]
        : prev.filter((id) => id !== updatedAmalan[index].id)
    );
  };

  const handleDropdownChange = (index: number, value: string) => {
    const updatedAmalan = [...amalan];
    updatedAmalan[index].done = value !== "Tidak Melakukan";
    updatedAmalan[index].nilai = value; // ✅ Simpan nilai ke state utama
    setAmalan(updatedAmalan);

    setSelectedValues((prev) => ({
      ...prev,
      [updatedAmalan[index].id]: value,
    }));
  };

  const handleSubmit = async () => {
    const cookies = parseCookies();
    const token = cookies.token;
    if (!token) {
      toast({ title: "Anda harus login.", status: "error", duration: 3000 });
      return;
    }

    const selectedAmalanData = amalan
      .filter((item) => item.done)
      .map((item) => ({
        id: item.id,
        nama: item.nama,
        nilai: item.type === "dropdown" ? item.nilai || "" : "", // ✅ Kirim nilai yang tersimpan
      }));

    console.log("hasil submit", selectedAmalanData);

    if (selectedAmalanData.length === 0) {
      toast({
        title: "Pilih minimal satu amalan!",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(api.postAmalanHarian, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amalan: selectedAmalanData }),
      });

      const result = await response.json();
      if (response.ok) {
        toast({
          title: "Amalan harian berhasil disimpan!",
          status: "success",
          duration: 3000,
        });
      } else {
        toast({
          title: result.message || "Gagal menyimpan amalan.",
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan, coba lagi nanti.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
      setIsConfirmOpen(false);
    }
  };

  const boxWidth = useBreakpointValue({ base: "100%", md: "400px" });

  return (
    <Box minH="100vh" p={4} bg="gray.100">
      <Box
        w={boxWidth}
        mx="auto"
        p={6}
        bg="white"
        boxShadow="md"
        borderRadius="md"
      >
        <Heading size="md" mb={4} textAlign="center">
          Catat Amalan Harian
        </Heading>
        <Text fontSize="md" fontWeight="bold" mb={2} textAlign="center">
          📅 {hijriDate}
        </Text>

        {loading ? (
          <Text textAlign="center" mt={4}>
            Memuat...
          </Text>
        ) : error ? (
          <Text color="red.500" textAlign="center" mt={4}>
            {error}
          </Text>
        ) : (
          <VStack spacing={4} align="stretch" mt={4}>
            {amalan.map((item, index) => (
              <Box 
              key={item.id} 
              p={3} 
              borderWidth={1} 
              borderRadius="md" 
              bg={
                item.isParent ? "gray.200" : // ✅ Jika parent, abu-abu
                item.done ? "green.100" : // ✅ Jika amalan sudah "done", hijau
                selectedAmalan.includes(item.id) ? "green.100" : "white" // ✅ Jika dipilih, hijau juga
              }
              cursor={item.isParent ? "default" : "pointer"} // ✅ Parent tidak bisa diklik
              _hover={item.isParent ? {} : { bg: "green.50" }} // ✅ Hover hanya untuk anak
              onClick={item.isParent ? undefined : () => toggleChecklist(index)} // ✅ Hanya bisa klik jika bukan parent
            >
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="bold">{item.nama}</Text>
                    {item.description && (
                      <Text fontSize="sm" color="gray.600">
                        {item.description}
                      </Text>
                    )}
                  </Box>
                  {item.type === "checklist" &&
                    !item.isParent && ( // ✅ Hanya tampil jika bukan parent
                      <Checkbox
                        isChecked={item.done}
                        onChange={() => toggleChecklist(index)}
                        pointerEvents="none"
                      />
                    )}
                </Flex>
                {item.type === "dropdown" && (
                  <Select
                    placeholder="Pilih opsi"
                    value={selectedValues[item.id] || ""} // ✅ Menampilkan nilai yang sudah tersimpan
                    onChange={(e) =>
                      handleDropdownChange(index, e.target.value)
                    }
                    mt={2}
                  >
                    {item.options?.map((option, optIndex) => (
                      <option key={optIndex} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                )}
              </Box>
            ))}
            <Button
              colorScheme="blue"
              w="full"
              onClick={() => setIsConfirmOpen(true)}
              mt={4}
              isLoading={isSubmitting}
            >
              Simpan Amalan
            </Button>
          </VStack>
        )}
      </Box>

      <AlertDialog
        isOpen={isConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Konfirmasi</AlertDialogHeader>
            <AlertDialogBody>
              Apakah Anda yakin ingin menyimpan amalan hari ini?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setIsConfirmOpen(false)}>Batal</Button>
              <Button
                colorScheme="blue"
                ml={3}
                onClick={handleSubmit}
                isLoading={isSubmitting}
              >
                Simpan
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
