export type LaporanTholib = {
    id: string;
    nama: string;
    halaqah: string;
    sholatWajib: number; // 0-5 sholat wajib
    tilawah: string; // Contoh: "1.5 Juz"
    sedekah: boolean;
    puasa: boolean;
    dzikir: string; // Contoh: "500x"
    amalanTambahan: string;
    tanggal: string; // Format: YYYY-MM-DD
  };
  