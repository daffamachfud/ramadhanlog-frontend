import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("Authorization");

  // Jika tidak ada token, redirect ke halaman login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next(); // Lanjutkan request jika token ada
}

// Tentukan halaman mana saja yang akan diproteksi
export const config = {
  matcher: ["/murabbi/:path*", "/tholib/:path*"], // Proteksi halaman berdasarkan path
};
