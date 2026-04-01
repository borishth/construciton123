import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type MainTabParamList = {
  Home: undefined;
  Projects: undefined;
  ServiceTab: undefined;
  AIAssistant: undefined;
  YoloScanner: undefined;
  Metrics: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  StartInspection: undefined;

  Checklists: {
    projectName?: string;
    siteName?: string;
    structureType?: string;
    checklistType?: string;
    date?: string;
    inspectorName?: string;
  };

  ReportSummary: {
    reportId?: string;
    projectName?: string;
    siteName?: string;
    inspectorName?: string;
    date?: string;
    summary?: string;
    responses?: string;
  };

  Reports: undefined;
  Inspections: undefined;

  NCRCreate: {
    inspectionId?: string | null;
    checklistItemId?: string | null;
    checklistItemLabel?: string;
  };

  ServiceRequest: {
    failedItems?: string;
    siteName?: string;
    inspectionType?: string;
    date?: string;
    reportId?: string;
  };

  Service: {
    description?: string;
    priority?: string;
    assignee?: string;
    repairDate?: string;
  };

  DailyReport: undefined;
  Notifications: undefined;
  PhotoUploader: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Global typing for navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}