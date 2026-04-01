import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAppTheme } from '../hooks/use-app-theme';
import { styles } from '../styles/main/layout.styles';

// Screens
import HomeScreen from '@/screens/main/HomeScreen';
import InspectionsTabScreen from '@/screens/main/InspectionsTabScreen';
import ServiceTabScreen from '@/screens/main/ServiceTabScreen';
import AIAssistantScreen from '@/screens/main/AIAssistantScreen';
import YoloScannerScreen from '@/screens/main/YoloScannerScreen';
import PerformanceScreen from '@/screens/main/PerformanceScreen';

import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const t = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: t.tabActive,
          tabBarInactiveTintColor: t.tabInactive,
          tabBarLabelStyle: styles.tabLabel,
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: t.tabBg,
              borderTopColor: t.tabBorder, // RN CLI bottom tabs uses borderTopColor
            },
          ],
          tabBarItemStyle: styles.tabItem,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  styles.tabIconWrap,
                  focused && { backgroundColor: t.tabIconActiveBg },
                ]}
              >
                <MaterialIcons name="home-filled" size={22} color={color} />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Projects"
          component={InspectionsTabScreen}
          options={{
            title: 'Projects',
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  styles.tabIconWrap,
                  focused && { backgroundColor: t.tabIconActiveBg },
                ]}
              >
                <MaterialIcons name="fact-check" size={22} color={color} />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="ServiceTab"
          component={ServiceTabScreen}
          options={{
            title: 'Service',
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  styles.tabIconWrap,
                  focused && { backgroundColor: t.tabIconActiveBg },
                ]}
              >
                <MaterialIcons name="build-circle" size={22} color={color} />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="AIAssistant"
          component={AIAssistantScreen}
          options={{
            title: 'AI',
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  styles.tabIconWrap,
                  focused && { backgroundColor: t.tabIconActiveBg },
                ]}
              >
                <MaterialIcons name="auto-awesome" size={22} color={color} />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="YoloScanner"
          component={YoloScannerScreen}
          options={{
            title: 'YOLO',
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  styles.tabIconWrap,
                  focused && { backgroundColor: t.tabIconActiveBg },
                ]}
              >
                <MaterialIcons name="center-focus-strong" size={22} color={color} />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Metrics"
          component={PerformanceScreen}
          options={{
            title: 'Metrics',
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  styles.tabIconWrap,
                  focused && { backgroundColor: t.tabIconActiveBg },
                ]}
              >
                <MaterialIcons name="insights" size={22} color={color} />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
