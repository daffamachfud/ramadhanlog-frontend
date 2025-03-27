"use client";

import {
  Box,
  Text,
  Progress,
  IconButton,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { CloseIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AmalanData {
  totalAmalan: number;
  hariAktif: string;
  mostActiveDay: { hijri_date: string; count: number };
  topAmalan?: { name: string }[]; // Tambahkan topAmalan dengan optional chaining
  reportedDays: number;
  missedDays: number;
}

export default function AmalanWrapped({ data }: { data: AmalanData }) {
  const router = useRouter();
  const bg = useColorModeValue("gray.100", "gray.900");
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  // Debugging: Cek data yang masuk
  console.log("Data di Wrapped:", data);

  const slides = [
    {
      title: "📖 Ramadhan Wrapped",
      subtitle: "Perjalanan ibadahmu selama Ramadhan!",
      gradient: "linear-gradient(135deg, #6a11cb, #2575fc)",
    },
    {
      title: "✨ Total Amalan",
      subtitle: `${data?.totalAmalan ?? 0} amalan`, // Gunakan default 0 jika undefined
      gradient: "linear-gradient(135deg, #ff416c, #ff4b2b)",
    },
    {
      title: "🔥 Salah satu hari paling produktif beribadah ketika",
      subtitle: data?.mostActiveDay.hijri_date ?? "Tidak tersedia",
      gradient: "linear-gradient(135deg, #00c6ff, #0072ff)",
    },
    {
      title: "📅 Aktivitas Laporan",
      subtitle: `Selama Ramadhan, kamu mencatat ibadah selama ${data?.reportedDays} hari dan melewatkan ${data?.missedDays} hari.`,
      gradient: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    },
    {
      title: "🏆 Top Amalanmu",
      subtitle: "Amalan yang paling sering kamu lakukan",
      gradient: "linear-gradient(135deg, #16a085, #f4d03f)",
      content: (
        <Box w="80%" mt={4}>
          {(data?.topAmalan ?? []).length > 0 ? (
            (data?.topAmalan ?? []).map((amalan, idx) => (
              <Box key={idx} mb={2}>
                <Text fontSize="lg" fontWeight="bold" color="white">
                  #{idx + 1} {amalan.name}
                </Text>
              </Box>
            ))
          ) : (
            <Text fontSize="lg" color="white">
              Belum ada data amalan
            </Text>
          )}
        </Box>
      ),
    },
    {
      title: "🎉 Terima Kasih!",
      subtitle: "Semoga Ramadhanmu penuh berkah!",
      gradient: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    },
  ];

  const handleNextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  useEffect(() => {
    setProgress(((activeIndex + 1) / slides.length) * 100);
  }, [activeIndex]);

  return (
    <Box
      w="100vw"
      h="100vh"
      bg={bg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      {/* 🔹 Background Gradient */}
      <Box
        p={2}
        position="absolute"
        top={0}
        left={0}
        w="100vw"
        h="100vh"
        zIndex={-1}
        bgGradient={slides[activeIndex].gradient}
        transition="background 0.8s ease-in-out"
      />

      {/* 🔹 Progress Bar */}
      <Progress
        value={progress}
        position="fixed"
        top={4}
        left="50%"
        transform="translateX(-50%)"
        width="80%"
        size="sm"
        colorScheme="whiteAlpha"
        borderRadius="md"
        bg="whiteAlpha.400"
        zIndex={20}
        transition="width 0.5s ease-in-out"
      />

      {/* 🔹 Swiper */}
      <Swiper
        modules={[Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        style={{ width: "100%", height: "100%" }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                paddingLeft: "24px",  // 🔹 Tambahkan padding kiri
                paddingRight: "24px", // 🔹 Tambahkan padding kanan
                textAlign: "center",  // 🔹 Pastikan teks tetap rapi
                background: slide.gradient,
              }}
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <Text fontSize="3xl" fontWeight="bold" color="white">
                  {slide.title}
                </Text>
              </motion.div>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <Text fontSize="4xl" fontWeight="bold" color="yellow.300">
                  {slide.subtitle}
                </Text>
              </motion.div>
              {slide.content && slide.content}
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 🔹 Close Button */}
      <IconButton
        aria-label="Close"
        icon={<CloseIcon />}
        position="fixed"
        top={8}
        right={6}
        size="sm"
        color="whiteAlpha.700"
        bg="whiteAlpha.300"
        _hover={{ bg: "whiteAlpha.500", color: "white" }}
        _active={{ bg: "whiteAlpha.600" }}
        borderRadius="full"
        onClick={() => router.back()}
        zIndex={30}
      />

      {/* 🔹 Next Button */}
      {activeIndex < slides.length - 1 && (
        <IconButton
          aria-label="Next"
          icon={<ChevronRightIcon boxSize={6} />}
          position="fixed"
          bottom={12}
          right={12}
          size="lg"
          color="whiteAlpha.800"
          bg="whiteAlpha.400"
          _hover={{ bg: "whiteAlpha.600", color: "white" }}
          _active={{ bg: "whiteAlpha.700" }}
          borderRadius="full"
          onClick={handleNextSlide}
          zIndex={30}
        />
      )}

      {/* 🔹 Lihat Ringkasan Button */}
      {activeIndex === slides.length - 1 && (
        <Button
          position="fixed"
          bottom={12}
          right="50%"
          transform="translateX(50%)"
          size="lg"
          bg="whiteAlpha.400"
          color="whiteAlpha.900"
          _hover={{ bg: "whiteAlpha.600", color: "white" }}
          _active={{ bg: "whiteAlpha.700" }}
          borderRadius="full"
          px={6}
          onClick={() => router.back()}
          zIndex={30}
        >
          Selesai
        </Button>
      )}
    </Box>
  );
}
