import { Box, Text } from "@chakra-ui/react";

type WeeklySummaryProps = {
  totalAmalan: number;
  completedAmalan: number;
};

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ totalAmalan, completedAmalan }) => {
  return (
    <Box bg="blue.600" color="white" p={4} borderRadius="lg" textAlign="center">
      <Text fontSize="xl" fontWeight="bold">Ringkasan Mingguan</Text>
      <Text fontSize="lg">Total Amalan: {totalAmalan}</Text>
      <Text fontSize="lg">Selesai: {completedAmalan}</Text>
    </Box>
  );
};

export default WeeklySummary;
