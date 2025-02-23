import { LaporanTholib } from "./types"; // Import tipe

export async function fetchLaporanTholib(): Promise<LaporanTholib[]> {
  return [
    {
      id: "1",
      nama: "Ahmad",
      halaqah: "Halaqah Haizum",
      sholatWajib: 5,
      tilawah: "1.5 Juz",
      sedekah: true,
      puasa: true,
      dzikir: "500x",
      amalanTambahan: "Tahajud, Dhuha",
      tanggal: "2025-03-15",
    },
    {
      id: "2",
      nama: "Bilal",
      halaqah: "Halaqah Minggu",
      sholatWajib: 4,
      tilawah: "1 Juz",
      sedekah: false,
      puasa: true,
      dzikir: "300x",
      amalanTambahan: "Tahajud",
      tanggal: "2025-03-15",
    },
  ];
}
