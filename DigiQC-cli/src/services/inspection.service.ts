import axios from 'axios';
import { API_BASE_URL } from '../config/api.config';

export interface InspectionItem {
  id: number;
  question_text: string;
}

export const inspectionService = {
  /**
   * Page 3: Creates an inspection record (assignment)
   */
  async createInspection(templateId: number, projectName: string, assignedTo?: string, dueDate?: string): Promise<{ success: boolean; inspection_id: number }> {
    const response = await axios.post(`${API_BASE_URL}/inspections/`, {
      template_id: templateId,
      project_name: projectName,
      assigned_to: assignedTo,
      due_date: dueDate
    });
    return response.data;
  },

  /**
   * Page 4 (Step 1): Load execution questions
   */
  async getExecutionItems(inspectionId: number): Promise<InspectionItem[]> {
    const response = await axios.get(`${API_BASE_URL}/inspections/${inspectionId}/items`);
    return response.data.data;
  },

  /**
   * Page 4 (Step 2): Save single answer
   */
  async saveAnswer(inspectionId: number, itemId: number, answer: string): Promise<any> {
    const response = await axios.post(`${API_BASE_URL}/inspection-answers/`, {
      inspection_id: inspectionId,
      checklist_item_id: itemId,
      answer: answer.toLowerCase()
    });
    return response.data;
  }
};