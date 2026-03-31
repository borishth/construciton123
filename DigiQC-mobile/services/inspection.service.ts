const BASE_URL = "http://192.168.1.7:8000/api/v1";

export const inspectionService = {
  getInspectionTypes: async () => {
    const res = await fetch(`${BASE_URL}/inspections/checklist-items`);
    const json = await res.json();
    return json.data || [];
  },
  getChecklistItems: async () => {
    const res = await fetch(`${BASE_URL}/inspections/checklist-items`);
    const json = await res.json();
    return json.data || [];
  },

  getAllInspections: async () => {
    const res = await fetch(`${BASE_URL}/inspections`);
    const json = await res.json();
    return json.data || [];
  },

  getReports: async () => {
    const res = await fetch(`${BASE_URL}/inspections/`);
    const text = await res.text();

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error('Backend did not return JSON: ' + text);
    }

    return json.data || json || [];
  },

  getDefectTypes: async () => {
    const res = await fetch(`${BASE_URL}/inspections/defect-types`);
    const json = await res.json();
    return json.data || [];
  },

  submitInspection: async (report: any) => {
    const res = await fetch(`${BASE_URL}/inspections/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });

    const json = await res.json();
    console.log('submitInspection response:', json);

    if (!res.ok) {
      throw new Error(JSON.stringify(json));
    }

    return json;
  }
};