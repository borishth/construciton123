import axios from 'axios';
import { API_BASE_URL } from '../config/api.config';

export interface InspectionItem {
  id: string;
  question_text: string;
}

export const inspectionService = {
  /**
   * Page 3: Creates an inspection record (assignment)
   */
  async createInspection(templateId: string, projectName: string, assignedTo?: string, dueDate?: string): Promise<{ success: boolean; inspection_id: string }> {
    const response = await axios.post(`${API_BASE_URL}/inspections/`, {
      template_id: templateId,
      project_name: projectName,
      assigned_to: assignedTo,
      due_date: dueDate
    });
    return response.data;
  },

  /**
   * Fetch all created inspections (assignments)
   */
  async getAllInspections(): Promise<any[]> {
    const response = await axios.get(`${API_BASE_URL}/inspections/`);
    // Map snake_case to camelCase for the frontend if needed
    return response.data.data.map((item: any) => ({
      ...item,
      projectName: item.project_name || item.project || item.site_name,
      siteName: item.site_name || item.project_name,
      inspectorName: item.assigned_to,
      date: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'
    }));
  },

  /**
   * Page 4 (Step 1): Load execution questions
   */
  async getExecutionItems(inspectionId: string): Promise<InspectionItem[]> {
    const response = await axios.get(`${API_BASE_URL}/inspections/${inspectionId}/items`);
    return response.data.data;
  },

  /**
   * Page 4 (Step 2): Save single answer (using bulk endpoint for UPSERT support)
   */
  async saveAnswer(inspectionId: string, itemId: string, answer: string): Promise<any> {
    const mappedAnswer = answer.toLowerCase() === 'n/a' ? 'na' : answer.toLowerCase();
    
    const response = await axios.post(`${API_BASE_URL}/inspections/${inspectionId}/answers`, {
      answers: [{
        checklist_item_id: itemId,
        answer: mappedAnswer
      }]
    });
    return response.data;
  }
};