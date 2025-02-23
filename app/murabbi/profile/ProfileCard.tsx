import { Box, Text } from "@chakra-ui/react";
import { MurabbiProfile } from "./types";

export default function ProfileCard({ profile }: { profile: MurabbiProfile }) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} w="100%">
      <Text fontSize="lg" fontWeight="bold">{profile.name}</Text>
      <Text>Email: {profile.email}</Text>
      <Text>Telepon: {profile.phone}</Text>
      <Text>Jumlah Halaqah: {profile.halaqahCount}</Text>
    </Box>
  );
}
