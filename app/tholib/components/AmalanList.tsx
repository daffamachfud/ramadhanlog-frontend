import { Box, List, ListItem, Text, Icon } from "@chakra-ui/react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

type AmalanListProps = {
  items: { name: string; completed: boolean }[];
};

const AmalanList: React.FC<AmalanListProps> = ({ items }) => {
  return (
    <Box p={4} bg="white" borderRadius="lg" boxShadow="md">
      <Text fontSize="xl" fontWeight="bold" mb={4}>Daftar Amalan Harian</Text>
      <List spacing={3}>
        {items.map((item, index) => (
          <ListItem key={index} display="flex" alignItems="center">
            <Icon as={item.completed ? FiCheckCircle : FiXCircle} color={item.completed ? "green.500" : "red.500"} mr={2} />
            {item.name}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AmalanList;
