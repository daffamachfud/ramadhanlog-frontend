"use client";

import { useEffect, useState } from "react";
import { Box, Spinner, Heading, Button, VStack } from "@chakra-ui/react";
import { getMurabbiProfile } from "./profileService";
import { MurabbiProfile } from "./types";
import ProfileCard from "./ProfileCard";
import ProfileForm from "./ProfileForm";

export default function ProfilePage() {
  const [profile, setProfile] = useState<MurabbiProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getMurabbiProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={4}>Edit Profil Murabbi</Heading>
      <VStack spacing={4} align="start">
        {isEditing ? (
          <ProfileForm profile={profile!} onClose={() => setIsEditing(false)} setProfile={setProfile} />
        ) : (
          <>
            <ProfileCard profile={profile!} />
            <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
              Edit Profil
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
}
