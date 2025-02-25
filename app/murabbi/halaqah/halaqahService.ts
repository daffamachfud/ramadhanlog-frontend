import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { parseCookies } from "nookies";


export async function getHalaqahList() {
  try {
    const cookies = parseCookies();
    const token = cookies.token;
    if (!token) throw new Error("Token tidak ditemukan");

    const response = await fetch(api.halaqahMurabbi, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  
    if (!response.ok) {
      throw new Error("Gagal mengambil data halaqah");
    }

    const result = await response.json();

    return result.data.map((halaqah: any) => ({
      id: halaqah.id,
      nama: halaqah.nama_halaqah,
      kode: halaqah.code,
      jumlahAnggota: halaqah.jumlah_anggota,
    }));
  } catch (error) {
    console.error("Error fetching halaqah list:", error);
    return [];
  }
}

export async function addHalaqah(data: { name: string; code: string }) {
  try {
    const cookies = parseCookies();
    const token = cookies.token;
    if (!token) throw new Error("Token tidak ditemukan");

    const response = await fetch(api.addHalaqah, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal menambahkan halaqah");
    }

    const result = await response.json();
    return {
      id: result.data.id,
      nama: result.data.name,
      kode: result.data.code,
      jumlahAnggota: 0, // Default 0 karena baru dibuat
    };
  } catch (error) {
    console.error("Error adding halaqah:", error);
    throw error;
  }
}

// export async function addHalaqah(data: { name: string; code: string }): Promise<Halaqah> {
//   const response = await fetch("API_URL", {
//     method: "POST",
//     body: JSON.stringify(data),
//     headers: { "Content-Type": "application/json" },
//   });
//   return response.json();
// }

// export async function updateHalaqah(id: string, data: { name: string; code: string }): Promise<Halaqah> {
//   const response = await fetch(`${"API_URL"}/${id}`, {
//     method: "PUT",
//     body: JSON.stringify(data),
//     headers: { "Content-Type": "application/json" },
//   });
//   return response.json();
// }

// export async function deleteHalaqah(id: string): Promise<void> {
//   await fetch(`${"API_URL"}/${id}`, { method: "DELETE" });
// }
