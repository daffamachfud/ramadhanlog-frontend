import { Box, Text, VStack, HStack, CircularProgress, CircularProgressLabel } from "@chakra-ui/react";

interface DailySummaryProps {
  totalAmalan: number;
  completedAmalan: number;
}

const DailySummary: React.FC<DailySummaryProps> = ({ totalAmalan, completedAmalan }) => {
  const remainingAmalan = totalAmalan - completedAmalan;
  const progressPercentage = (completedAmalan / totalAmalan) * 100;

  return (
    <Box 
      p={5} 
      borderRadius="lg" 
      boxShadow="md" 
      bg="white"
    >
      <Text fontSize="lg" fontWeight="bold">
        Target <Text as="span" color="blue.500">Amalan</Text>
      </Text>

      <HStack justify="space-between" mt={4}>
        {/* Informasi Target dan Remaining */}
        <VStack align="start" spacing={2}>
          <Box>
            <Text fontSize="md" fontWeight="bold">{totalAmalan}</Text>
            <Text fontSize="sm" color="gray.500">Jumlah Amalan</Text>
          </Box>
          <Box>
            <Text fontSize="md" fontWeight="bold">{remainingAmalan}</Text>
            <Text fontSize="sm" color="gray.500">Amalan yang belum dilakukan</Text>
          </Box>
        </VStack>

        {/* Progress Lingkaran */}
        <CircularProgress value={progressPercentage} size="90px" thickness="8px" color="blue.500">
          <CircularProgressLabel>
            <Text fontSize="lg" fontWeight="bold">{completedAmalan}</Text>
            <Text fontSize="xs" color="gray.500">Amalan</Text>
          </CircularProgressLabel>
        </CircularProgress>
      </HStack>
    </Box>
  );
};

export default DailySummary;
