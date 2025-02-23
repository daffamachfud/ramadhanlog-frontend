import { useState } from "react";
import { Box, Input, Button, VStack } from "@chakra-ui/react";
import { MurabbiProfile } from "./types";

export default function ProfileForm({
  profile,
  onClose,
  setProfile,
}: {
  profile: MurabbiProfile;
  onClose: () => void;
  setProfile: (profile: MurabbiProfile) => void;
}) {
  const [formData, setFormData] = useState(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setProfile(formData);
    onClose();
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} w="100%">
      <VStack spacing={3}>
        <Input name="name" value={formData.name} onChange={handleChange} placeholder="Nama" />
        <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Telepon" />
        <Button colorScheme="blue" onClick={handleSubmit}>Simpan</Button>
        <Button variant="ghost" onClick={onClose}>Batal</Button>
      </VStack>
    </Box>
  );
}
