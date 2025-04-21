"use client";

import {
  Box,
  VStack,
  Text,
  Spinner,
  Heading,
  Divider,
  Button,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";
import InfiniteScroll from "react-infinite-scroll-component";

export default function PostPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const isMaintenance = true; // ✅ Ganti ke false untuk aktifkan halaman lagi

  const fetchPosts = async () => {
    const cookies = parseCookies();
    const token = cookies.token;

    try {
      const res = await fetch(`${api.getPosts}?page=${page}&limit=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.posts.length < pageSize) {
        setHasMore(false);
      }

      setPosts((prev) => [...prev, ...data.posts]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
    }
  };

  useEffect(() => {
    if (!isMaintenance) {
      fetchPosts();
    }
  }, []);

  if (isMaintenance) {
    return (
      <Center h="60vh" textAlign="center">
        <Box>
          <Heading size="lg" color="blue.500">Halaman Sedang Dalam Perbaikan</Heading>
          <Text mt={4} color="gray.600">
            Mohon maaf atas ketidaknyamanannya. Silakan kembali lagi nanti.
          </Text>
        </Box>
      </Center>
    );
  }

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Tulisan Terbaru</Heading>

      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={<Spinner />}
        endMessage={<Text textAlign="center">Sudah tidak ada lagi post.</Text>}
      >
        <VStack spacing={6} align="stretch">
          {posts.map((post) => (
            <Box
              key={post.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="sm"
            >
              <Text fontSize="xs" color="gray.500">
                {post.author_name} • {new Date(post.created_at).toLocaleDateString()}
              </Text>
              <Heading size="sm" mt={2}>{post.title}</Heading>
              <Text mt={2} noOfLines={4}>{post.content}</Text>
              <Divider mt={3} />
              <Button size="sm" mt={2} colorScheme="blue" variant="ghost">
                Lihat Detail
              </Button>
            </Box>
          ))}
        </VStack>
      </InfiniteScroll>
    </Box>
  );
}
