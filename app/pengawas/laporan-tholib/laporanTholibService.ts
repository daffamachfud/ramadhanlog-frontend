import { LaporanTholib } from "./types"; // Import tipe
import { api } from "@/lib/api";
import { parseCookies } from "nookies";

export async function fetchLaporanTholib(nama?: string) {
  const cookies = parseCookies();
  const token = cookies.token;
  if (!token) throw new Error("Token tidak ditemukan");

  // Menyusun query parameter jika ada filter
  const queryParams = new URLSearchParams();
  if (nama) queryParams.append("nama", nama);

  const url = `${api.getLaporanTholibByPengawas}?${queryParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  console.log("hasil laporan : ",response)

  if (!response.ok) {
    throw new Error("Gagal mengambil data laporan tholib");
  }
  return response.json();
}


export async function fetchDetailLaporanTholib(tholibId: string, selectedDate: string) {
  const cookies = parseCookies();
  const token = cookies.token;
  if (!token) throw new Error("Token tidak ditemukan");

  const response = await fetch(api.getLaporanTholibDetail, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tholibId: tholibId, // Kirim melalui body
      tanggal: selectedDate,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil detail laporan tholib");
  }

  const result = await response.json();
  console.log("hasil response :", result);
  return result;
}

