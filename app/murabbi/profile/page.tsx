"use client";

import { useEffect, useState } from "react";
import { Box, Spinner, Heading, Button, VStack } from "@chakra-ui/react";
import { TholibProfile } from "./types";
import ProfileCard from "./ProfileCard";
import ProfileForm from "./ProfileForm";
import { api } from "@/lib/api";
import { parseCookies, destroyCookie } from "nookies";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState<TholibProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();
  
    const handleLogout = () => {
      // Hapus token dari cookie
      destroyCookie(null, "token");
  
      // Redirect ke halaman login
      router.push("/auth/login");
    };
  

  useEffect(() => {
    async function fetchProfile() {
      try {
        const cookies = parseCookies();
        const token = cookies.token;
        if (!token) return;

        const response = await fetch(api.getProfile, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
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
      <Heading mb={4}>Profil</Heading>
      <VStack spacing={4} align="start">
        {isEditing ? (
          <ProfileForm
            profile={profile!}
            onClose={() => setIsEditing(false)}
            setProfile={setProfile}
          />
        ) : (
          <>
            <ProfileCard profile={profile!} />
            <Button colorScheme="blue"  onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
}
