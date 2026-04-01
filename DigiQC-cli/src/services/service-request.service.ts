
const BASE_URL = "http://10.150.10.187:8000/api/v1";

export const serviceRequestService = {
  getServiceRequests: async () => {
    const res = await fetch(`${BASE_URL}/service-requests`);
    return res.json();
  },

  createServiceRequest: async (request: any) => {
    const res = await fetch(`${BASE_URL}/service-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...request,
        id: `SR-${Math.floor(Math.random() * 900) + 100}`,
        status: 'Pending'
      }),
    });
    return res.json();
  },

  advanceStatus: async (id: string) => {
    const res = await fetch(`${BASE_URL}/service-requests/${id}/status`, {
      method: 'PUT',
    });
    return res.json();
  }
};
