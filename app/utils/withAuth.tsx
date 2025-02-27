"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  id: string;
  role: "murabbi" |"pengawas"| "tholib"; // Sesuaikan dengan role yang ada
}

export default function withAuth(WrappedComponent: React.FC, allowedRoles: string[]) {
  return function ProtectedComponent(props: any) {
    const router = useRouter();
    const { token } = parseCookies(); 
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
      if (!token) {
        router.push("/auth/login"); 
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(token);
        setRole(decoded.role);

        if (!allowedRoles.includes(decoded.role)) {
          if (decoded.role === "murabbi") {
            router.push("/murabbi");
          } else if (decoded.role === "pengawas") {
            router.push("/pengawas");
          } else {
            router.push("/tholib");
          }
        }
        
      } catch (error) {
        console.error("Invalid token:", error);
        router.push("/auth/login");
      }
    }, [token, router]);

    if (!token || role === null) {
      return null; // Hindari render jika belum ada token atau role belum terbaca
    }

    return <WrappedComponent {...props} />;
  };
}
