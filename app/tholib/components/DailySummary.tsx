import { Box, Text } from "@chakra-ui/react";

type DailySummaryProps = {
  totalAmalan: number;
  completedAmalan: number;
};

const DailySummary: React.FC<DailySummaryProps> = ({ totalAmalan, completedAmalan }) => {
  return (
    <Box bg="green.600" color="white" p={4} borderRadius="lg" textAlign="center">
      <Text fontSize="xl" fontWeight="bold">Ringkasan Harian</Text>
      <Text fontSize="lg">Total Amalan: {totalAmalan}</Text>
      <Text fontSize="lg">Selesai: {completedAmalan}</Text>
    </Box>
  );
};

export default DailySummary;
