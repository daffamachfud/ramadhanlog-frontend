const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api"; 

export const api = {
  register: `${API_URL}/auth/register`,
  login: `${API_URL}/auth/login`,
  getProfile: `${API_URL}/profile`,
  getAmalan: `${API_URL}/amalan/get`,
  postAmalanHarian: `${API_URL}/amalan/amalan-harian`,
  getAmalanHarian: `${API_URL}/amalan/harian`,
  dashboardMurrabi: `${API_URL}/dashboard/murabbi`,
  dashboardTholib: `${API_URL}/dashboard/tholib`,
  halaqahMurabbi: `${API_URL}/halaqah/murabbi`,
  addHalaqah: `${API_URL}/halaqah/add`,

  getLaporanTholib: `${API_URL}/laporan-tholib/`,
  getLaporanTholibByPengawas: `${API_URL}/laporan-tholib/pengawas`,
  getLaporanTholibDetail: `${API_URL}/laporan-tholib/detail`,
  getAmalanLaporanTholib: `${API_URL}/laporan-tholib/tholib`,
  getLaporanTholibDetailMingguan: `${API_URL}/laporan-tholib/detail/week`,

  getMurabbiReported: `${API_URL}/dashboard/murabbi/reported`,
  getMurabbiUnreported: `${API_URL}/dashboard/murabbi/unreported`,

  dashboardPengawas: `${API_URL}/dashboard/pengawas`,
  getPengawasReported: `${API_URL}/dashboard/pengawas/reported`,
  getPengawasUnreported: `${API_URL}/dashboard/pengawas/unreported`,

  getWrapped: `${API_URL}/wrapped/get`,

};
