import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  const { pathname } = req.nextUrl;

  // Jika user sudah login dan berada di halaman utama, redirect sesuai role
  if (token && pathname === "/") {
    let redirectPath = "/tholib"; // Default jika role tidak ditemukan
    if (role === "murabbi") redirectPath = "/murabbi";
    if (role === "pengawas") redirectPath = "/pengawas";

    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  // Proteksi halaman tertentu jika tidak ada token
  if (!token && ["/murabbi", "/tholib", "/pengawas"].some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next(); // Lanjutkan request jika tidak butuh redirect
}

// Tentukan halaman mana saja yang akan diproses oleh middleware
export const config = {
  matcher: ["/", "/murabbi/:path*", "/tholib/:path*", "/pengawas/:path*"], // Proteksi & redirect halaman utama
};
