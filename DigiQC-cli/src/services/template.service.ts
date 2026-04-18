import axios from 'axios';
import { API_BASE_URL } from '../config/api.config';

export interface Template {
  id: number;
  title: string;
  work_type?: string;
}

export const templateService = {
  async createTemplate(
    workType: string,
    checklistTitle: string
  ): Promise<{ success: boolean; id: number }> {
    const response = await axios.post(`${API_BASE_URL}/templates/`, {
      work_type: workType,
      checklist_title: checklistTitle,
    });

    console.log('createTemplate response:', response.data);
    return response.data;
  },

  async getTemplates(): Promise<Template[]> {
    const response = await axios.get(`${API_BASE_URL}/templates/`);
    return response.data.data;
  },
};