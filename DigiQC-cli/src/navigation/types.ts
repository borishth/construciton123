export type MainTabParamList = {
  Home: { user?: { username: string; role: string; email: string } };
  Projects: undefined;
  ServiceTab: undefined;
  AIAssistant: undefined;
  YoloScanner: undefined;
  Metrics: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainTabs: { user?: { username: string; role: string; email: string } };

  // Page 1
  StartInspection: {
    template_id?: string;
    checklistTitle?: string;
    workType?: string;
  };

  // Page 2
  EditTemplate: {
    template_id: string;
    items?: string[];
  };

  // Page 3
  Checklists: {
    template_id?: string;
    workType?: string;
    checklistTitle?: string;
  };

  // Page 4
  ChecklistExecution: {
    inspection_id: string;
    projectName?: string;
    inspectorName?: string;
    date?: string;
    template_id?: string;
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
  ServiceRequest: {
    siteName?: string;
    inspectionType?: string;
    date?: string;
    reportId?: string;
  };
  Service: undefined;
  DailyReport: undefined;
  Notifications: undefined;
  PhotoUploader: undefined;
};