import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronRight,
  FileText,
  GitBranch,
  LayoutDashboard,
  Menu,
  Search,
  Server,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react-native';

import { useAuth } from '@/context/AuthContext';
import { fetchJson } from '@/api/api-client';
import { API_ORIGIN } from '@/api/config';
import { fetchMetadataStatistics, type StageStats } from '@/api/metadata';
import { fetchStages, type Stage } from '@/api/stages';
import { fetchUsers } from '@/api/users';

type DashboardData = {
  stages: StageStats;
  usersCount: number | null;
  formTypesCount: number | null;
  recentStages: Stage[];
};

type Status = 'checking' | 'online' | 'offline';

const emptyDashboard: DashboardData = {
  stages: {},
  usersCount: null,
  formTypesCount: null,
  recentStages: [],
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData>(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [serverStatus, setServerStatus] = useState<Status>('checking');

  const loadDashboard = useCallback(async () => {
    setServerStatus('checking');

    const [metadata, usersData, formTypesData, stagesData] = await Promise.all([
      fetchMetadataStatistics(),
      fetchUsers(),
      fetchJson<unknown[]>('/form-types?limit=10'),
      fetchStages(),
    ]);

    setDashboard({
      stages: metadata?.stages ?? {},
      usersCount: Array.isArray(usersData) ? usersData.length : null,
      formTypesCount: Array.isArray(formTypesData) ? formTypesData.length : null,
      recentStages: Array.isArray(stagesData) ? stagesData.slice(0, 3) : [],
    });

    setServerStatus(metadata ? 'online' : 'offline');
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const displayName = user?.username || 'Workspace user';

  const stats = useMemo(
    () => [
      {
        label: 'Total Projects',
        value: dashboard.stages.total_stages ?? 0,
        helper: 'All Projects',
        icon: GitBranch,
        color: '#38bdf8',
      },
      {
        label: 'Root Projects',
        value: dashboard.stages.root_stages ?? 0,
        helper: 'Top level stages',
        icon: LayoutDashboard,
        color: '#22c55e',
      },
      {
        label: 'Leaf Projects',
        value: dashboard.stages.leaf_stages ?? 0,
        helper: 'End nodes',
        icon: FileText,
        color: '#f59e0b',
      },
      {
        label: dashboard.usersCount === null ? 'Form types' : 'Users',
        value: dashboard.usersCount ?? dashboard.formTypesCount ?? 0,
        helper: dashboard.usersCount === null ? 'Available templates' : 'Registered accounts',
        icon: Users,
        color: '#a78bfa',
      },
    ],
    [dashboard],
  );

  const quickActions = [
    {
      title: 'Open Stage Tree',
      subtitle: 'Browse and organize your hierarchy',
      icon: GitBranch,
      color: '#38bdf8',
      route: '/(tabs)/tree',
    },
    {
      title: 'Manage Users',
      subtitle: 'Review people and access status',
      icon: Users,
      color: '#22c55e',
      route: '/(tabs)/users',
    },
    {
      title: 'Roles & Permissions',
      subtitle: 'Control access rules from admin tools',
      icon: ShieldCheck,
      color: '#f59e0b',
      route: '/(tabs)/menu',
    },
    {
      title: 'System Settings',
      subtitle: 'Open menu, settings, and tools',
      icon: Settings,
      color: '#a78bfa',
      route: '/(tabs)/menu',
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38bdf8" />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.workspaceLabel}>ERP WORKSPACE</Text>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back, {displayName}</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.75}>
            <Search size={18} color="#cbd5e1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.75}>
            <Bell size={18} color="#cbd5e1" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <View
            style={[
              styles.statusDot,
              serverStatus === 'online' && styles.statusOnline,
              serverStatus === 'offline' && styles.statusOffline,
            ]}
          />
          <Text style={styles.statusText}>
            Backend {serverStatus === 'checking' ? 'checking' : serverStatus}
          </Text>
        </View>
        <Server size={17} color="#94a3b8" />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Overview</Text>
        {loading ? <ActivityIndicator color="#38bdf8" /> : null}
      </View>

      <View style={styles.statsGrid}>
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <View key={item.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${item.color}20` }]}>
                <Icon size={20} color={item.color} />
              </View>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={styles.statHelper}>{item.helper}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>

      <View style={styles.actionsList}>
        {quickActions.map((item) => {
          const Icon = item.icon;

          return (
            <TouchableOpacity
              key={item.title}
              style={styles.actionCard}
              activeOpacity={0.75}
              onPress={() => router.push(item.route as never)}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${item.color}20` }]}>
                <Icon size={21} color={item.color} />
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>{item.title}</Text>
                <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
              </View>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryPanel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Recently Updated</Text>
            <GitBranch size={17} color="#64748b" />
          </View>

          {dashboard.recentStages.length > 0 ? (
            dashboard.recentStages.map((stage, index) => (
              <View key={`${stage.stage_id ?? stage.stage_name}-${index}`} style={styles.recentRow}>
                <View style={styles.recentMarker} />
                <View style={styles.recentText}>
                  <Text style={styles.recentTitle} numberOfLines={1}>
                    {stage.stage_name || 'Unnamed stage'}
                  </Text>
                  <Text style={styles.recentPath} numberOfLines={1}>
                    {stage.stage_path || 'No path available'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent stages available yet.</Text>
          )}
        </View>

        <View style={styles.summaryPanel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>System Summary</Text>
            <Menu size={17} color="#64748b" />
          </View>

          <View style={styles.systemRow}>
            <Text style={styles.systemLabel}>API base</Text>
            <Text style={styles.systemValue} numberOfLines={1}>
              {API_ORIGIN.replace('http://', '')}
            </Text>
          </View>
          <View style={styles.systemRow}>
            <Text style={styles.systemLabel}>Session</Text>
            <Text style={styles.systemValue}>{user ? 'Signed in' : 'Guest'}</Text>
          </View>
          <View style={styles.systemRow}>
            <Text style={styles.systemLabel}>Dashboard</Text>
            <Text style={styles.systemValue}>{loading ? 'Loading' : 'Ready'}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 58,
    paddingBottom: 108,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  workspaceLabel: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  title: {
    color: '#f8fafc',
    fontSize: 31,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#171b24',
    borderWidth: 1,
    borderColor: '#242b38',
  },
  statusBar: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242b38',
    backgroundColor: '#151a23',
    paddingHorizontal: 14,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#f59e0b',
  },
  statusOnline: {
    backgroundColor: '#22c55e',
  },
  statusOffline: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  sectionHeader: {
    minHeight: 32,
    marginTop: 26,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    minHeight: 148,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242b38',
    backgroundColor: '#171b24',
    padding: 15,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  statHelper: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 3,
  },
  actionsList: {
    gap: 12,
  },
  actionCard: {
    minHeight: 76,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242b38',
    backgroundColor: '#171b24',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  actionText: {
    flex: 1,
    minWidth: 0,
  },
  actionTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800',
  },
  actionSubtitle: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 3,
  },
  summaryGrid: {
    gap: 12,
    marginTop: 26,
  },
  summaryPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242b38',
    backgroundColor: '#171b24',
    padding: 15,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  panelTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800',
  },
  recentRow: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentMarker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38bdf8',
    marginRight: 12,
  },
  recentText: {
    flex: 1,
    minWidth: 0,
  },
  recentTitle: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '700',
  },
  recentPath: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 3,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 19,
  },
  systemRow: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  systemLabel: {
    color: '#94a3b8',
    fontSize: 13,
  },
  systemValue: {
    color: '#e2e8f0',
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
});
