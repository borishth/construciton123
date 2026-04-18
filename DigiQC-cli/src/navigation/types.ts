export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;

  // Page 1
  StartInspection: {
    template_id?: number;
    checklistTitle?: string;
    workType?: string;
  };

  // Page 2
  EditTemplate: {
    template_id: number;
    items?: string[];
  };

  // Page 3
  Checklists: {
    template_id?: number;
    workType?: string;
    checklistTitle?: string;
  };

  // Page 4
  ChecklistExecution: {
    inspection_id: number;
    projectName?: string;
    inspectorName?: string;
    date?: string;
    template_id?: number;
  };

  ReportSummary: {
    reportId: string;
    projectName: string;
    inspectorName: string;
    date: string;
    summary: string;
    responses: string;
    siteName?: string;
  };

  Reports: undefined;
  Inspections: undefined;
  NCRCreate: undefined;
  ServiceRequest: undefined;
  Service: undefined;
  DailyReport: undefined;
  Notifications: undefined;
  PhotoUploader: undefined;
};