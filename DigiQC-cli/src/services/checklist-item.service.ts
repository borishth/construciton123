import axios from 'axios';
import { API_BASE_URL } from '../config/api.config';

export interface ChecklistItem {
  id: string;
  template_id: string;
  question_text: string;
  order_index?: number;
  answer_type?: string;
}

export const checklistItemService = {
  /**
   * Page 2: Creates a single checklist item
   */
  async createItem(templateId: string, text: string, orderIndex?: number): Promise<ChecklistItem> {
    const response = await axios.post(`${API_BASE_URL}/checklist-items/`, {
      template_id: templateId,
      question_text: text,
      order_index: orderIndex,
      answer_type: 'yes_no_na'
    });
    return response.data;
  },

  /**
   * Fetches all items for a template
   */
  async getItemsByTemplate(templateId: string): Promise<ChecklistItem[]> {
    const response = await axios.get(`${API_BASE_URL}/checklist-items/templates/${templateId}/items`);
    return response.data.data;
  }
};
