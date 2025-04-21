import {
  Box,
  Text,
  VStack,
  HStack,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";

interface DailySummaryProps {
  totalAmalan: number;
  completedAmalan: number;
  hijriDate: string; // e.g., "1 Syawal 1446"
}

const DailySummary: React.FC<DailySummaryProps> = ({
  totalAmalan,
  completedAmalan,
  hijriDate,
}) => {
  const remainingAmalan = totalAmalan - completedAmalan;
  const progressPercentage = (completedAmalan / totalAmalan) * 100;

  const hijriMonth = hijriDate.split(" ")[1]; // ambil "Syawal" dari "1 Syawal 1446"

  // Mapping teks berdasarkan bulan hijriah
  const textByMonth: Record<
    string,
    {
      title: string;
      remainingLabel: string;
      totalLabel: string;
      unit: string;
    }
  > = {
    Ramadhan: {
      title: "Target Amalan Ramadhan",
      remainingLabel: "Amalan yang belum dilakukan",
      totalLabel: "Jumlah Amalan",
      unit: "Amalan",
    },
    Syawal: {
      title: "Target Puasa Syawal",
      remainingLabel: "Hari puasa yang belum dilakukan",
      totalLabel: "Total Target: 6 Hari",
      unit: "Hari",
    },
    default: {
      title: "Target Amalan",
      remainingLabel: "Yang belum dilakukan",
      totalLabel: "Jumlah Target",
      unit: "Amalan",
    },
  };

  const { title, remainingLabel, totalLabel, unit } =
    textByMonth[hijriMonth] || textByMonth.default;

  return (
    <Box p={5} borderRadius="lg" boxShadow="md" bg="white">
      <Text fontSize="lg" fontWeight="bold">
        {title.split(hijriMonth)[0]}
        <Text as="span" color="blue.500">
          {hijriMonth}
        </Text>
        {title.split(hijriMonth)[1]}
      </Text>

      <HStack justify="space-between" mt={4}>
        <VStack align="start" spacing={2}>
          <Box>
            <Text fontSize="md" fontWeight="bold">
              {remainingAmalan}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {remainingLabel}
            </Text>
          </Box>
          <Box>
            <Text fontSize="md" fontWeight="bold">
              {totalAmalan}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {totalLabel}
            </Text>
          </Box>
        </VStack>

        <CircularProgress
          value={progressPercentage}
          size="90px"
          thickness="8px"
          color="blue.500"
        >
          <CircularProgressLabel>
            <Text fontSize="lg" fontWeight="bold">
              {completedAmalan}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {unit}
            </Text>
          </CircularProgressLabel>
        </CircularProgress>
      </HStack>
    </Box>
  );
};

export default DailySummary;
