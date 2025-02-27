import { Box, Text } from "@chakra-ui/react";
import { TholibProfile } from "./types";

export default function ProfileCard({ profile }: { profile: TholibProfile }) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} w="100%">
      <Text fontSize="lg" fontWeight="bold">{profile.name}</Text>
      <Text>Email: {profile.email}</Text>
      <Text>Role: {profile.role}</Text>
    </Box>
  );
}
