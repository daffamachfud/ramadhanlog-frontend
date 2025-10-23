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
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";
import InfiniteScroll from "react-infinite-scroll-component";
import NextLink from "next/link";

export default function PostPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const hasInitialFetch = useRef(false);
  const pageSize = 5;

  const isMaintenance = false; // ✅ Ganti ke false untuk aktifkan halaman lagi

  const fetchPosts = async () => {
    if (isFetching) return;
    setIsFetching(true);
    const cookies = parseCookies();
    const token = cookies.token;

    try {
      if (!token) {
        setError("Anda belum login. Silakan login untuk melihat postingan.");
        setHasMore(false);
        return;
      }

      const primaryUrl = `${api.getPosts}?page=${page}&limit=${pageSize}`;
      const altBase = api.getPosts.includes('/post/posts')
        ? api.getPosts.replace('/post/posts', '/posts')
        : api.getPosts.replace('/posts', '/post/posts');
      const altUrl = `${altBase}?page=${page}&limit=${pageSize}`;

      let res = await fetch(primaryUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        // Coba endpoint alternatif jika tersedia
        try {
          const tryAlt = await fetch(altUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (tryAlt.ok) {
            res = tryAlt;
          }
        } catch (_) {
          // ignore
        }
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const msg = errJson?.message || `Gagal memuat postingan (status ${res.status}).`;
        setError(msg);
        setHasMore(false);
        return;
      }

      const data = await res.json();

      const incoming = Array.isArray(data)
        ? data
        : Array.isArray(data?.posts)
        ? data.posts
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.data?.posts)
        ? data.data.posts
        : Array.isArray(data?.data?.items)
        ? data.data.items
        : Array.isArray(data?.rows)
        ? data.rows
        : Array.isArray(data?.result)
        ? data.result
        : [];

      if (incoming.length < pageSize) {
        setHasMore(false);
      }

      // Dedup by id saat merge
      setPosts((prev) => {
        const map = new Map<string, any>();
        [...prev, ...incoming].forEach((p: any) => {
          map.set(p.id, p);
        });
        return Array.from(map.values());
      });
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
      setError("Terjadi kesalahan saat memuat postingan.");
      setHasMore(false);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!isMaintenance && !hasInitialFetch.current) {
      hasInitialFetch.current = true;
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

      {error && posts.length === 0 ? (
        <Center py={10}>
          <Text color="red.500" fontSize="sm">{error}</Text>
        </Center>
      ) : null}

      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={<Spinner />}
        endMessage={<Text textAlign="center">--||--</Text>}
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
              <Text mt={2} noOfLines={4}>
                {(post.content || "").replace(/<[^>]*>/g, "").trim()}
              </Text>
              <Divider mt={3} />
              <Button
                as={NextLink}
                href={`/post/${post.id}`}
                size="sm"
                mt={2}
                colorScheme="blue"
                variant="ghost"
              >
                Lihat Detail
              </Button>
            </Box>
          ))}
        </VStack>
      </InfiniteScroll>
    </Box>
  );
}
