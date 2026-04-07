const BASE_URL = "http://10.150.9.107:8000/api/v1";
//const BASE_URL = "http://192.168.1.7:8001/api/v1";

export const ncrService = {
  getAllNCRs: async () => {
    const res = await fetch(`${BASE_URL}/ncrs`);
    const json = await res.json();
    return json || [];
  },

  getNCRsByInspection: async (inspectionId: string) => {
    const res = await fetch(`${BASE_URL}/ncrs/inspection/${inspectionId}`);
    const json = await res.json();
    return json || [];
  },

  createNCR: async (ncr: any) => {
    const res = await fetch(`${BASE_URL}/ncrs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ncr),
    });
    if (!res.ok) throw new Error('Failed to create NCR');
    return res.json();
  },

  updateNCRStatus: async (ncrId: string, status: string) => {
    const res = await fetch(`${BASE_URL}/ncrs/${ncrId}/status?status=${status}`, {
      method: 'PUT',
    });
    return res.json();
  },
};
