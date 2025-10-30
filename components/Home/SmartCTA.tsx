"use client";

import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export type Progress = { done: number; total: number };

type Props = { progress?: Progress; href?: string; labelBase?: string };

export default function SmartCTA({ progress, href, labelBase = 'Catat Amalan' }: Props) {
  const router = useRouter();
  const done = Math.max(0, progress?.done || 0);
  const total = Math.max(0, progress?.total || 0);
  const label = total > 0 ? `${labelBase} (${done}/${total})` : labelBase;

  return (
    <Button
      mx={4}
      mt={1}
      colorScheme="blue"
      borderRadius="full"
      size="md"
      onClick={() => router.push(href || '/tholib/catat-amalan')}
    >
      {label}
    </Button>
  );
}
