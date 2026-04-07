//const BASE_URL = "http://192.168.1.7:8001/api/v1";
const BASE_URL = "http://10.150.9.107:8000/api/v1";

export const dailyReportService = {
  getAllReports: async () => {
    const res = await fetch(`${BASE_URL}/daily-reports`);
    const json = await res.json();
    return json || [];
  },

  createReport: async (report: any) => {
    const res = await fetch(`${BASE_URL}/daily-reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
    if (!res.ok) throw new Error('Failed to create daily report');
    return res.json();
  },
};
