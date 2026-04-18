import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useAppTheme } from '@/hooks/use-app-theme';
import { styles } from '@/styles/main/service-tab.styles';

type ServiceStatus = 'Pending' | 'In Progress' | 'Completed';
type ServiceItem = { id: string; issue: string; assignee: string; priority: string; repairDate: string; status: ServiceStatus };

const MOCK: ServiceItem[] = [
  { id: 'SR-001', issue: 'Crack in North Wing Slab', assignee: 'Rajan Kumar', priority: 'High', repairDate: '25 Mar 2026', status: 'In Progress' },
  { id: 'SR-002', issue: 'HVAC Duct misalignment', assignee: 'Suresh Menon', priority: 'Medium', repairDate: '28 Mar 2026', status: 'Pending' },
  { id: 'SR-003', issue: 'Waterproofing membrane damage', assignee: 'Priya Singh', priority: 'High', repairDate: '30 Mar 2026', status: 'Pending' },
];
const NEXT: Record<ServiceStatus, ServiceStatus> = { Pending: 'In Progress', 'In Progress': 'Completed', Completed: 'Completed' };

export default function ServiceTabScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const t = useAppTheme();
  const [services, setServices] = useState<ServiceItem[]>(MOCK);
  const advance = (id: string) => setServices((p) => p.map((s) => (s.id === id ? { ...s, status: NEXT[s.status] } : s)));
  const active = services.filter((s) => s.status !== 'Completed').length;
  const done = services.filter((s) => s.status === 'Completed').length;

  const statusCfg: Record<ServiceStatus, { bg: string; text: string; icon: string }> = {
    Pending: { bg: t.amberSoft, text: t.amber, icon: 'hourglass-empty' },
    'In Progress': { bg: t.blueSoft, text: t.blue, icon: 'autorenew' },
    Completed: { bg: t.greenSoft, text: t.green, icon: 'check-circle' },
  };
  const prioCfg: Record<string, { bg: string; text: string }> = {
    Low: { bg: t.greenSoft, text: t.green }, Medium: { bg: t.amberSoft, text: t.amber }, High: { bg: t.redSoft, text: t.red },
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerArea}>
          <Text style={[styles.pageTitle, { color: t.textPrimary }]}>Service</Text>
          <Text style={[styles.pageSubtitle, { color: t.textSecondary }]}>Track and manage all service issues</Text>
        </View>

        <View style={styles.statsRow}>
          {[
            { value: active, label: 'Active', color: t.amber },
            { value: done, label: 'Resolved', color: t.green },
            { value: services.length, label: 'Total', color: t.blue },
          ].map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: t.textSecondary }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 20, marginBottom: 20 }}>
          <TouchableOpacity style={[styles.newBtn, { backgroundColor: t.blue, flex: 1, marginHorizontal: 0 }]} onPress={() => navigation.navigate('ServiceRequest')} activeOpacity={0.8}>
            <MaterialIcons name="add" size={20} color="#fff" />
            <Text style={styles.newBtnText}>New Service Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.newBtn, { backgroundColor: t.green, flex: 1, marginHorizontal: 0 }]} onPress={() => navigation.navigate('DailyReport')} activeOpacity={0.8}>
            <MaterialIcons name="event-note" size={20} color="#fff" />
            <Text style={styles.newBtnText}>Daily Report</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionLabel, { color: t.textMuted }]}>ACTIVE REQUESTS</Text>

        {services.map((item) => {
          const sc = statusCfg[item.status]; const pc = prioCfg[item.priority] ?? prioCfg.Medium;
          const isDone = item.status === 'Completed';
          return (
            <View key={item.id} style={[styles.card, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={[styles.issueTitle, { color: t.textPrimary }]}>{item.issue}</Text>
                  <Text style={[styles.issueId, { color: t.textSecondary }]}>{item.id}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                  <MaterialIcons name={sc.icon as any} size={10} color={sc.text} />
                  <Text style={[styles.badgeText, { color: sc.text }]}>{item.status}</Text>
                </View>
              </View>
              <View style={styles.metaRow}>
                <View style={styles.metaChip}>
                  <MaterialIcons name="person-outline" size={13} color={t.textSecondary} />
                  <Text style={[styles.metaText, { color: t.textSecondary }]}>{item.assignee}</Text>
                </View>
                <View style={styles.metaChip}>
                  <MaterialIcons name="event" size={13} color={t.textSecondary} />
                  <Text style={[styles.metaText, { color: t.textSecondary }]}>{item.repairDate}</Text>
                </View>
                <View style={[styles.prioBadge, { backgroundColor: pc.bg }]}>
                  <Text style={[styles.prioText, { color: pc.text }]}>{item.priority}</Text>
                </View>
              </View>
              {!isDone && (
                <TouchableOpacity style={[styles.advBtn, { backgroundColor: t.blueSoft }]} onPress={() => advance(item.id)}>
                  <MaterialIcons name={item.status === 'Pending' ? 'play-arrow' : 'check-circle'} size={14} color={t.blue} />
                  <Text style={[styles.advBtnText, { color: t.blue }]}>{item.status === 'Pending' ? 'Start Progress' : 'Mark Resolved'}</Text>
                </TouchableOpacity>
              )}
              {isDone && (
                <View style={[styles.doneTag, { backgroundColor: t.greenSoft }]}>
                  <MaterialIcons name="verified" size={13} color={t.green} />
                  <Text style={[styles.doneText, { color: t.green }]}>Resolved</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
