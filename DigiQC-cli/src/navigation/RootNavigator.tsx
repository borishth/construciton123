import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppTheme } from '../hooks/use-app-theme';

import { RootStackParamList } from './types';

// Navigators
import MainTabNavigator from './MainTabNavigator';

// Screens
import LoginScreen from '@/screens/auth/LoginScreen';
import StartInspectionScreen from '@/screens/StartInspectionScreen';
import Assignchecklist from '@/screens/Assignchecklist';
import ChecklistScreen from '@/screens/ChecklistScreen';
import ReportSummaryScreen from '@/screens/ReportSummaryScreen';
import ReportsScreen from '@/screens/ReportsScreen';
import InspectionsScreen from '@/screens/InspectionsScreen';
import NCRCreateScreen from '@/screens/NCRCreateScreen';
import ServiceRequestScreen from '@/screens/ServiceRequestScreen';
import ServiceScreen from '@/screens/ServiceScreen';
import DailyReportScreen from '@/screens/DailyReportScreen';
import NotificationsScreen from '@/screens/NotificationsScreen';
import PhotoUploaderScreen from '@/screens/PhotoUploaderScreen';
import EditTemplateScreen from '@/screens/EditTemplateScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const t = useAppTheme();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: t.bg },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />

      <Stack.Screen name="StartInspection" component={StartInspectionScreen} />
      <Stack.Screen name="EditTemplate" component={EditTemplateScreen} />
      <Stack.Screen name="Checklists" component={Assignchecklist} />
      <Stack.Screen name="ChecklistExecution" component={ChecklistScreen} />
      <Stack.Screen name="ReportSummary" component={ReportSummaryScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="Inspections" component={InspectionsScreen} />
      <Stack.Screen name="NCRCreate" component={NCRCreateScreen} />
      <Stack.Screen name="ServiceRequest" component={ServiceRequestScreen} />
      <Stack.Screen name="Service" component={ServiceScreen} />
      <Stack.Screen name="DailyReport" component={DailyReportScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="PhotoUploader" component={PhotoUploaderScreen} />
    </Stack.Navigator>
  );
}
