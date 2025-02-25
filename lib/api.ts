const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"; 

export const api = {
  register: `${API_URL}/auth/register`,
  login: `${API_URL}/auth/login`,
  getProfile: `${API_URL}/auth/profile`,
  getAmalan: `${API_URL}/amalan/get`,
  postAmalanHarian: `${API_URL}/amalan/amalan-harian`,
  getAmalanHarian: `${API_URL}/amalan/harian`,
  dashboardMurrabi: `${API_URL}/dashboard/murabbi`,
  halaqahMurabbi: `${API_URL}/halaqah/murabbi`,
};
