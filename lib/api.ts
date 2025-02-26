const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api"; 

export const api = {
  register: `${API_URL}/auth/register`,
  login: `${API_URL}/auth/login`,
  getProfile: `${API_URL}/auth/profile`,
  getAmalan: `${API_URL}/amalan/get`,
  postAmalanHarian: `${API_URL}/amalan/amalan-harian`,
  getAmalanHarian: `${API_URL}/amalan/harian`,
  dashboardMurrabi: `${API_URL}/dashboard/murabbi`,
  dashboardTholib: `${API_URL}/dashboard/tholib`,
  halaqahMurabbi: `${API_URL}/halaqah/murabbi`,
  addHalaqah: `${API_URL}/halaqah/add`,
  getLaporanTholib: `${API_URL}/laporan-tholib/`,
  getLaporanTholibDetail: `${API_URL}/laporan-tholib/detail`,
};
