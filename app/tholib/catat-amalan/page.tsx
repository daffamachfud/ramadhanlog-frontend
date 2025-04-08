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
  Stack,
  Flex,
  useBreakpointValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@chakra-ui/react";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";
import moment from "moment-hijri";
import { FaCalendarAlt, FaQuestionCircle } from "react-icons/fa";

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
  const [selectedAmalan, setSelectedAmalan] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: string }>({});
  const [selectedHijriDate, setSelectedHijriDate] = useState<string>("");
  const [hijriDates, setHijriDates] = useState<{ hijri: string }[]>([]);
  const toast = useToast();
  const cancelRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  moment.locale("en");

  const hijriMonths = [
    "Muharram", "Shafar", "Rabiul Awwal", "Rabiul Akhir",
    "Jumadil Awwal", "Jumadil Akhir", "Rajab", "Sya'ban",
    "Ramadhan", "Syawal", "Zulqaidah", "Zulhijjah"
  ];

  const generateHijriRange = (startDay: number, startMonth: string, startYear: number, total: number) => {
    const dates: string[] = [];
    let day = startDay;
    let month = hijriMonths.indexOf(startMonth);
    let year = startYear;
  
    for (let i = 0; i < total; i++) {
      dates.push(`${day} ${hijriMonths[month]} ${year}`);
      day++;
  
      if (day > 30) {
        day = 1;
        month++;
        if (month > 11) {
          month = 0;
          year++;
        }
      }
    }
  
    return dates.map(d => ({ hijri: d }));
  };

  useEffect(() => {
    const fetchInitialHijriRange = async () => {
      try {
        const response = await fetch("https://api.myquran.com/v2/cal/hijr/?adj=-10");
        const result = await response.json();
        if (!result.status) throw new Error("Gagal ambil tanggal dari API");
  
        const [, hijriText] = result.data.date; // "26 Ramadhan 1446 H"
        const [dayStr, monthStr, yearStr] = hijriText.replace(" H", "").split(" ");
        const day = parseInt(dayStr);
        const month = monthStr;
        const year = parseInt(yearStr);
  
        const hijriRange = generateHijriRange(day, month, year, 11); // 26 Ramadhan s/d 5 Syawal
        setHijriDates(hijriRange);
      } catch (err) {
        console.error("Gagal fetch hijri range:", err);
        setError("Gagal mengambil rentang tanggal Hijriah.");
      }
    };
  
    fetchInitialHijriRange();
  }, []);

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

        const response = await fetch(
          `${api.getAmalanHarian}${selectedHijriDate ? `?hijriDate=${selectedHijriDate}` : ""}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );


        const data = await response.json();
        console.log("data nya nih bos :",data)
        if (!data.success) throw new Error(data.message);

        const parentIds = new Set(data.data.map((item: any) => item.parentId).filter(Boolean));

        setSelectedHijriDate(data.hijriDate)
        setAmalan(
          data.data.map((item: any) => ({
            id: item.id,
            nama: item.nama,
            description: item.description || "",
            type: item.type,
            options: item.options ? JSON.parse(item.options) : null,
            parent_id: item.parentId,
            done: item.done,
            nilai: item.nilai,
            isParent: parentIds.has(item.id),
          }))
        );

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
    setSelectedAmalan([]);
    setSelectedValues({});
  }, [selectedHijriDate]);

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
    updatedAmalan[index].nilai = value;
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

    const selectedAmalanData = amalan.map((item) => ({
      id: item.id,
      nama: item.nama,
      done: item.done,
      nilai: item.type === "dropdown" ? item.nilai || "" : "",
    }));

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
        body: JSON.stringify({
          amalan: selectedAmalanData,
          hijriDate: selectedHijriDate,
        }),
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
      <Box w={boxWidth} mx="auto" p={6} bg="white" boxShadow="md" borderRadius="md">
        <Flex justify="space-between" align="center" mb={4}>
          <Flex align="center">
            <FaCalendarAlt size={20} style={{ marginRight: "8px" }} />
            <Heading size="md">Catat Amalan Harian</Heading>
          </Flex>
          <FaQuestionCircle size={20} cursor="pointer" onClick={onOpen} color="blue" />
        </Flex>

        <Select
          value={selectedHijriDate}
          onChange={(e) => {
            setSelectedHijriDate(e.target.value);
            setLoading(true);
          }}
          mt={2}
        >
          {hijriDates.map((date, index) => (
            <option key={index} value={date.hijri}>
              {date.hijri}
            </option>
          ))}
        </Select>

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
                  item.isParent
                    ? "gray.200"
                    : item.done
                    ? "green.100"
                    : selectedAmalan.includes(item.id)
                    ? "green.100"
                    : "white"
                }
                cursor={item.isParent ? "default" : "pointer"}
                _hover={item.isParent ? {} : { bg: "green.50" }}
                onClick={item.isParent ? undefined : () => toggleChecklist(index)}
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
                  {item.type === "checklist" && !item.isParent && (
                    <Checkbox isChecked={item.done} onChange={() => toggleChecklist(index)} pointerEvents="none" />
                  )}
                </Flex>
                {item.type === "dropdown" && (
                  <Select
                    placeholder="Pilih opsi"
                    value={selectedValues[item.id] || ""}
                    onChange={(e) => handleDropdownChange(index, e.target.value)}
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

      <AlertDialog isOpen={isConfirmOpen} leastDestructiveRef={cancelRef} onClose={() => setIsConfirmOpen(false)}>
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Informasi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Input catatan amalan dengan batas waktu matahari terbit. Tetapi bisa memilih tanggal jika sebelumnya lupa
              atau belum melakukan catatan amalan
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Mengerti
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
