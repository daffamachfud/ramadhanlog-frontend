"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  useToast,
  Box,
  Button,
  Checkbox,
  Select,
  VStack,
  Heading,
  Text,
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
  useDisclosure,
  Tooltip,
  Skeleton,
  SkeletonText,
  Badge
} from "@chakra-ui/react";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";
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

const PEMANASAN_RAMADHAN = [
  "3 RAKAAT sebelum tidur",
  "Bangun sebelum adzan Shubuh",
  "5 waktu di Masjid",
  "Dzikir pagi",
  "Tilawah 5 lembar (minimal)",
  "Sedekah Shubuh",
  "Dhuha 4 Rakaat",
  "Rawatib 12 Rakaat",
  "Menulis faidah bermanfaat",
  "Jasadiyah 30 menit (3x sepekan)",
] as const;

const normalizeAmalanName = (name?: string | null) =>
  (name || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const PEMANASAN_ORDER = PEMANASAN_RAMADHAN.reduce<Record<string, number>>(
  (acc, label, index) => {
    acc[normalizeAmalanName(label)] = index;
    return acc;
  },
  {}
);

const normalizeOptionValue = (value?: string | null) =>
  normalizeAmalanName(value).replace(/\s+/g, " ");

const NEGATIVE_DROPDOWN_VALUES = new Set([
  "tidak melakukan",
  "tidak dhuha",
]);

const normalizeDateKey = (value?: string | null) =>
  value ? value.trim().split(/\s+/).slice(0, 2).join(" ") : "";

type HijriParts = {
  day?: number;
  month?: string;
  year?: number;
};

const parseHijriDateParts = (value?: string | null): HijriParts => {
  if (!value) return {};

  const parts = value.trim().split(/\s+/);
  const day = Number(parts.shift());
  if (!day || Number.isNaN(day)) return {};

  const possibleYear = parts[parts.length - 1];
  const numericYear = possibleYear ? Number(possibleYear) : NaN;
  const year = Number.isNaN(numericYear) ? undefined : numericYear;
  if (!Number.isNaN(numericYear)) {
    parts.pop();
  }

  return {
    day,
    month: parts.join(" ").trim(),
    year,
  };
};

const normalizeHijriMonthName = (value?: string | null) => {
  const normalized = (value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  const alias: Record<string, string> = {
    "rabiul awal": "Rabiul Awwal",
    "rabiul awwal": "Rabiul Awwal",
    "rabiul akhir": "Rabiul Akhir",
    "jumadil awal": "Jumadil Awwal",
    "jumadil awwal": "Jumadil Awwal",
    "jumadil akhir": "Jumadil Akhir",
  };

  const exact = hijriMonths.find(
    (month) => month.toLowerCase() === normalized
  );
  if (exact) return exact;

  if (alias[normalized]) return alias[normalized];

  return (value || "").trim();
};

const hijriMonths = [
  "Muharram",
  "Shafar",
  "Rabiul Awwal",
  "Rabiul Akhir",
  "Jumadil Awwal",
  "Jumadil Akhir",
  "Rajab",
  "Sya'ban",
  "Ramadhan",
  "Syawal",
  "Zulqaidah",
  "Zulhijjah",
];

export default function CatatAmalanPage() {
  const [amalan, setAmalan] = useState<Amalan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: string }>({});
  const [hijriDates, setHijriDates] = useState<string[]>([]);
  const [selectedHijriDate, setSelectedHijriDate] = useState<string>("");
  const [currentHijriDate, setCurrentHijriDate] = useState<string>("");
  const toast = useToast();
  const cancelRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();


  const pemanasanKeySet = useMemo(
    () => new Set(Object.keys(PEMANASAN_ORDER)),
    []
  );

  useEffect(() => {
    const fetchHijriToday = async () => {
      try {
        const response = await fetch("https://api.myquran.com/v2/cal/hijr/?adj=-1");
        const result = await response.json();
        if (!result.status) throw new Error("Gagal ambil tanggal Hijriah");

        const { num } = result.data;
        const day = Number(num?.[4]);
        const monthIndex = Number(num?.[5]) - 1;
        const year = Number(num?.[6]);

        if (!day || monthIndex < 0 || monthIndex > 11 || !year) {
          throw new Error("Format Hijriah tidak valid");
        }

        const today = `${day} ${hijriMonths[monthIndex]} ${year}`;
        setCurrentHijriDate(today);
      } catch (err) {
        console.error("Gagal mengambil tanggal Hijriah hari ini:", err);
      }
    };

    fetchHijriToday();
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
  
        // ✅ Ambil data dari backend berdasarkan tanggal Hijriah yang dipilih
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
        if (!data.success) throw new Error(data.message);
  
        console.log("📅 Data hijriDate yang diterima:", data.hijriDate);

        const parsedHijri = parseHijriDateParts(data.hijriDate);
        const todayHijri = parseHijriDateParts(currentHijriDate);
        const maxDay = Math.min(30, Math.max(1, parsedHijri.day || todayHijri.day || 1));
        const monthName = normalizeHijriMonthName(parsedHijri.month || todayHijri.month || "");
        const year = parsedHijri.year ?? todayHijri.year;

        const hijriList = Array.from({ length: maxDay }, (_, idx) =>
          [idx + 1, monthName, year].filter(Boolean).join(" ")
        );
        setHijriDates(hijriList);

        // ✅ Update daftar amalan
        const parentIds = new Set(data.data.map((item: any) => item.parentId).filter(Boolean));
  
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

    setSelectedValues({});
  }, [selectedHijriDate, currentHijriDate]);

  useEffect(() => {
    if (!currentHijriDate || !hijriDates.length) return;

    const hasExactSelected =
      selectedHijriDate && hijriDates.includes(selectedHijriDate);
    if (hasExactSelected) return;

    const normalizedToday = normalizeDateKey(currentHijriDate);
    const normalizedSelected = normalizeDateKey(selectedHijriDate);
    const matchSelected = normalizedSelected
      ? hijriDates.find(
          (item) => normalizeDateKey(item) === normalizedSelected
        )
      : null;
    const matchedToday = hijriDates.find(
      (item) => normalizeDateKey(item) === normalizedToday
    );

    setSelectedHijriDate(
      matchSelected || matchedToday || hijriDates[hijriDates.length - 1]
    );
  }, [selectedHijriDate, currentHijriDate, hijriDates]);

  const toggleChecklist = (id: string) => {
    setAmalan((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const handleDropdownChange = (id: string, value: string) => {
    const normalized = normalizeOptionValue(value);
    const isNegative = NEGATIVE_DROPDOWN_VALUES.has(normalized);

    setAmalan((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, done: !isNegative, nilai: value }
          : item
      )
    );

    setSelectedValues((prev) => ({
      ...prev,
      [id]: value,
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
      .map((item) => ({
        id: item.id,
        nama: item.nama,
        done: item.done, // ✅ Kirim status done agar backend tahu jika ada yang di-uncheck
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
  const pemanasanAmalan = useMemo(
    () =>
      amalan
        .filter((item) =>
          pemanasanKeySet.has(normalizeAmalanName(item.nama))
        )
        .sort(
          (a, b) =>
            (PEMANASAN_ORDER[normalizeAmalanName(a.nama)] ?? 999) -
            (PEMANASAN_ORDER[normalizeAmalanName(b.nama)] ?? 999)
        ),
    [amalan, pemanasanKeySet]
  );

  const regularAmalan = useMemo(
    () =>
      amalan
        .filter((item) => !pemanasanKeySet.has(normalizeAmalanName(item.nama)))
        .sort((a, b) => Number(b.isParent) - Number(a.isParent)),
    [amalan, pemanasanKeySet]
  );

  const renderAmalanCard = (
    item: Amalan,
    options?: { order?: number; highlight?: boolean }
  ) => {
    const isChecklist = item.type === "checklist";
    const isHighlighted = Boolean(options?.highlight);
    const isCompleted = item.done && !item.isParent;
    const borderColor = isHighlighted
      ? item.done
        ? "orange.400"
        : "orange.200"
      : item.isParent
      ? "gray.200"
      : item.done
      ? "green.300"
      : "gray.100";
    const bgColor = item.isParent
      ? "gray.50"
      : isCompleted
      ? "green.50"
      : isHighlighted
      ? "orange.50"
      : "white";

    const handleCardToggle = () => {
      if (isChecklist && !item.isParent) {
        toggleChecklist(item.id);
      }
    };

    return (
      <Box
        key={item.id}
        p={3}
        borderWidth="1px"
        borderRadius="md"
        borderColor={borderColor}
        bg={bgColor}
        _hover={
          item.isParent
            ? {}
            : {
                borderColor: isHighlighted ? "orange.300" : "blue.300",
                boxShadow: "sm",
              }
        }
        cursor={isChecklist && !item.isParent ? "pointer" : "default"}
        onClick={handleCardToggle}
      >
        <Flex justify="space-between" align="flex-start" gap={3}>
          <Box flex="1">
            <Flex align="center" gap={2} wrap="wrap">
              {typeof options?.order === "number" && (
                <Badge colorScheme="orange" borderRadius="full" px={2}>
                  {String(options.order + 1).padStart(2, "0")}
                </Badge>
              )}
              <Text fontWeight={item.isParent ? "semibold" : "medium"}>
                {item.nama}
              </Text>
            </Flex>
            {item.description && (
              <Text fontSize="sm" color="gray.600" mt={1}>
                {item.description}
              </Text>
            )}
          </Box>
          {!item.isParent && isChecklist && (
            <Checkbox
              isChecked={item.done}
              onChange={(e) => {
                e.stopPropagation();
                toggleChecklist(item.id);
              }}
              colorScheme={isHighlighted ? "orange" : "green"}
              pointerEvents="auto"
            />
          )}
          {!item.isParent && !isChecklist && (
            <Badge
              colorScheme={item.done ? "green" : "gray"}
              variant="subtle"
              borderRadius="full"
              px={2}
            >
              {item.done ? "Selesai" : "Belum"}
            </Badge>
          )}
        </Flex>
        {item.type === "dropdown" && (
          <Select
            size="sm"
            placeholder="Pilih opsi"
            value={selectedValues[item.id] || ""}
            onChange={(e) => handleDropdownChange(item.id, e.target.value)}
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
    );
  };

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
        <Flex justify="space-between" align="center" mb={4}>
          <Flex align="center" gap={2}>
            <FaCalendarAlt size={20} />
            <Heading size="md">Catat Amalan Harian</Heading>
          </Flex>
          <Tooltip label="Panduan" placement="left">
            <FaQuestionCircle
              size={20}
              cursor="pointer"
              onClick={onOpen}
              color="blue"
            />
          </Tooltip>
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
            <option key={index} value={date}>
              {date}
            </option>
          ))}
        </Select>

        {loading ? (
          <VStack spacing={3} mt={4} align="stretch">
            {Array.from({ length: 5 }).map((_, i) => (
              <Box
                key={i}
                p={3}
                borderWidth="1px"
                borderRadius="md"
                borderColor="gray.100"
                boxShadow="xs"
                bg="white"
              >
                <SkeletonText noOfLines={2} spacing={2} skeletonHeight={3} />
              </Box>
            ))}
          </VStack>
        ) : error ? (
          <Text color="red.500" textAlign="center" mt={4}>
            {error}
          </Text>
        ) : (
          <VStack spacing={4} align="stretch" mt={4}>
            {pemanasanAmalan.length > 0 && (
              <Box
                borderWidth="1px"
                borderRadius="lg"
                borderColor="orange.200"
                bg="orange.50"
                p={4}
              >
                <Heading size="sm" color="orange.600">
                  Pemanasan Ramadhan
                </Heading>
                <Text fontSize="sm" color="orange.700" mt={1}>
                  Catat 10 amalan inti ini setiap hari sebagai pemanasan menuju
                  Ramadhan.
                </Text>
                <VStack spacing={3} align="stretch" mt={3}>
                  {pemanasanAmalan.map((item, index) =>
                    renderAmalanCard(item, { order: index, highlight: true })
                  )}
                </VStack>
              </Box>
            )}

            {regularAmalan.map((item) => renderAmalanCard(item))}

            <Box position="sticky" bottom={0} bg="white" pt={2} pb={1} zIndex={1}>
              <Button
                colorScheme="blue"
                w="full"
                onClick={() => setIsConfirmOpen(true)}
                isLoading={isSubmitting}
                borderRadius="full"
              >
                Simpan Amalan
              </Button>
            </Box>
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

      {/* Modal Help */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Informasi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Input catatan amalan dengan batas waktu matahari terbit. Tetapi
              bisa memilih tanggal jika sebelumnya lupa atau belum melakukan
              catatan amalan
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
