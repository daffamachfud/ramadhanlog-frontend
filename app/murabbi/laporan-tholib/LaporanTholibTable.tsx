import {
  Box,
  Table,
  Tbody,
  Tr,
  Td,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { LaporanTholib } from "./types";
import AmalanChartMurabbi from "@/components/AmalanChartMurabbi";

export default function LaporanTholibTable({
  laporan,
}: {
  laporan: LaporanTholib[];
}) {
  const router = useRouter();

  return (
    <Box overflowX="auto" w="full">
      <Table variant="simple" size="sm">
        <Tbody>
          {laporan.map((tholib) => (
            <Tr key={tholib.id}>
              <Td>
                <VStack align="start" spacing={3} w="full">
                  {/* Nama dan Halaqah */}
                  <Box>
                    <Text fontWeight="bold" fontSize="md">
                      {tholib.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {tholib.halaqah}
                    </Text>
                  </Box>

                  {/* Chart Amalan */}
                  <Box w="full">
                    <AmalanChartMurabbi data={tholib.line_chart} />
                  </Box>

                  {/* Tombol Detail (opsional) */}
                  {/* 
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="gray"
                    onClick={() =>
                      router.push(
                        `/murabbi/laporan-tholib/${tholib.id}?name=${encodeURIComponent(
                          tholib.name
                        )}`
                      )
                    }
                  >
                    Lihat Detail Lengkap
                  </Button>
                  */}
                </VStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
