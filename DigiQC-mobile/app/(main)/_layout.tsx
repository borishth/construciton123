import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/use-app-theme';
import { styles } from '@/styles/main/layout.styles';

export default function MainTabLayout() {
  const router = useRouter();
  const t = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: t.tabActive,
          tabBarInactiveTintColor: t.tabInactive,
          tabBarLabelStyle: styles.tabLabel,
          tabBarStyle: [styles.tabBar, {
            backgroundColor: t.tabBg,
            borderColor: t.tabBorder,
          }],
          tabBarItemStyle: styles.tabItem,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconWrap, focused && { backgroundColor: t.tabIconActiveBg }]}>
                <MaterialIcons name="home-filled" size={22} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="inspections-tab"
          options={{
            title: 'Projects',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconWrap, focused && { backgroundColor: t.tabIconActiveBg }]}>
                <MaterialIcons name="fact-check" size={22} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="service-tab"
          options={{
            title: 'Service',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconWrap, focused && { backgroundColor: t.tabIconActiveBg }]}>
                <MaterialIcons name="build-circle" size={22} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="yolo-scanner"
          options={{
            title: 'YOLO',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconWrap, focused && { backgroundColor: t.tabIconActiveBg }]}>
                <MaterialIcons name="center-focus-strong" size={22} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="performance"
          options={{
            title: 'Metrics',
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabIconWrap, focused && { backgroundColor: t.tabIconActiveBg }]}>
                <MaterialIcons name="insights" size={22} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen name="explore" options={{ href: null }} />
      </Tabs>

      {/* Floating AI Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: t.fabBg, borderColor: t.fabBorder }]}
        onPress={() => router.push('/ai-assistant' as any)}
        activeOpacity={0.8}
      >
        <MaterialIcons name="auto-awesome" size={22} color="#fff" />
      </TouchableOpacity>
      <Text style={[styles.fabLabel, { color: t.fabLabel }]}>AI</Text>
    </View>
  );
}
