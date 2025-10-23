"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { api } from "@/lib/api";
import {
  Box,
  Heading,
  Text,
  HStack,
  Avatar,
  Spinner,
  IconButton,
  Divider,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";

type Post = {
  id: string;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "";

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setLoading(true);
      const { token } = parseCookies();
      if (!token) {
        setError("Anda belum login.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(api.getPostById(id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson?.message || `Gagal memuat postingan (status ${res.status}).`);
        }
        const data = await res.json();
        const entity: Post = Array.isArray(data)
          ? (data[0] as Post)
          : (data?.post || data?.data || data);
        setPost(entity);
      } catch (e: any) {
        setError(e?.message || "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const formattedDate = (d?: string) => (d ? new Date(d).toLocaleDateString() : "");

  if (loading) {
    return (
      <Box maxW="800px" mx="auto" p={4}>
        <IconButton
          aria-label="Kembali"
          icon={<FiArrowLeft />}
          variant="ghost"
          onClick={() => router.back()}
          mb={2}
        />
        <SkeletonText noOfLines={1} skeletonHeight={6} w="70%" mb={4} />
        <HStack spacing={3} mb={6}>
          <Skeleton height="40px" width="40px" borderRadius="full" />
          <Skeleton height="14px" width="120px" />
          <Skeleton height="14px" width="90px" />
        </HStack>
        <SkeletonText noOfLines={8} spacing={3} skeletonHeight={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxW="800px" mx="auto" p={4}>
        <IconButton
          aria-label="Kembali"
          icon={<FiArrowLeft />}
          variant="ghost"
          onClick={() => router.back()}
          mb={2}
        />
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (!post) return null;

  return (
    <Box maxW="800px" mx="auto" p={4}>
      <IconButton
        aria-label="Kembali"
        icon={<FiArrowLeft />}
        variant="ghost"
        onClick={() => router.back()}
        mb={2}
      />

      <Heading size="lg" mb={3}>
        {post.title}
      </Heading>

      <HStack spacing={3} mb={6}>
        <Avatar name={post.author_name} size="sm" />
        <Text fontSize="sm" color="gray.600">
          {post.author_name}
        </Text>
        <Text fontSize="sm" color="gray.400">•</Text>
        <Text fontSize="sm" color="gray.600">
          {formattedDate(post.created_at)}
        </Text>
      </HStack>

      <Divider mb={4} />

      {/* Konten HTML dari editor (Quill) */}
      <Box
        className="post-content"
        fontSize="md"
        lineHeight={1.9}
        color="gray.800"
        sx={{
          p: { mb: 3 },
          h1: { fontSize: "2xl", fontWeight: "bold", mb: 3 },
          h2: { fontSize: "xl", fontWeight: "bold", mb: 3 },
          ul: { pl: 5, mb: 3 },
          ol: { pl: 5, mb: 3 },
          img: { maxWidth: "100%", borderRadius: "md", my: 3 },
          blockquote: {
            borderLeft: "4px solid",
            borderColor: "gray.300",
            pl: 3,
            color: "gray.600",
            fontStyle: "italic",
            my: 3,
          },
          code: {
            bg: "gray.100",
            px: 1,
            borderRadius: "sm",
          },
          pre: {
            bg: "gray.900",
            color: "gray.100",
            p: 3,
            borderRadius: "md",
            overflowX: "auto",
            my: 3,
          },
        }}
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />
    </Box>
  );
}

