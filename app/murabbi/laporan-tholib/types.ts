export interface LaporanTholib {
  id: number;
  name: string;
  halaqah: string;
  line_chart: {
    name: string; // contoh: "1 Ramadhan 1446"
    value: number;
  }[];
}

export interface DetailLaporanTholib {
  id: number;
  tanggal: string;
  nama_amalan: string;
  description: string;
  status: string;
  nilai: string;
  type: string;
}
