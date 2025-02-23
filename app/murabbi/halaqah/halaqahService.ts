import { Halaqah } from "./types";

const API_URL = "/api/halaqah"; // Sesuaikan dengan API backend

export async function getHalaqahList(): Promise<Halaqah[]> {
  const response = await fetch(API_URL);
  return response.json();
}

export async function addHalaqah(data: { name: string; code: string }): Promise<Halaqah> {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}

export async function updateHalaqah(id: string, data: { name: string; code: string }): Promise<Halaqah> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}

export async function deleteHalaqah(id: string): Promise<void> {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}
