import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import { styles } from '@/styles/main/inspections-tab.styles';

const INSPECTIONS = [
  { id: '#QC-8821', site: 'Site B: North Wing Slab', sector: 'Sector 4', time: 'Today, 10:30 AM', status: 'PASSED' },
  { id: '#QC-8819', site: 'Main Terminal: HVAC Ducting', sector: 'Roof Level', time: 'Yesterday, 4:15 PM', status: 'REJECTED' },
  { id: '#QC-8815', site: 'Piling Work: Zone A', sector: 'Ground Floor', time: '12 Oct, 09:00 AM', status: 'PENDING' },
];

export default function InspectionsTab() {
  const router = useRouter();
  const t = useAppTheme();

  const statusCfg: Record<string, { bg: string; text: string; accent: string }> = {
    PASSED: { bg: t.greenSoft, text: t.green, accent: t.green },
    REJECTED: { bg: t.redSoft, text: t.red, accent: t.red },
    PENDING: { bg: t.amberSoft, text: t.amber, accent: t.amber },
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.headerArea}>
          <Text style={[styles.pageTitle, { color: t.textPrimary }]}>Inspections</Text>
          <Text style={[styles.pageSubtitle, { color: t.textSecondary }]}>Manage and track your site quality audits</Text>
        </View>

        <Text style={[styles.sectionLabel, { color: t.textMuted }]}>QUICK ACTIONS</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}
            onPress={() => router.push('/start-inspection' as any)} activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: t.blueSoft }]}>
              <MaterialIcons name="add-circle-outline" size={24} color={t.blue} />
            </View>
            <Text style={[styles.actionTitle, { color: t.textPrimary }]}>New Inspection</Text>
            <Text style={[styles.actionSub, { color: t.textSecondary }]}>Start a checklist</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}
            onPress={() => router.push('/reports' as any)} activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: t.greenSoft }]}>
              <MaterialIcons name="assessment" size={24} color={t.green} />
            </View>
            <Text style={[styles.actionTitle, { color: t.textPrimary }]}>View Reports</Text>
            <Text style={[styles.actionSub, { color: t.textSecondary }]}>Completed audits</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionLabel, { color: t.textMuted }]}>RECENT INSPECTIONS</Text>
          <TouchableOpacity onPress={() => router.push('/inspections' as any)}>
            <Text style={[styles.viewAllText, { color: t.blue }]}>View All</Text>
          </TouchableOpacity>
        </View>

        {INSPECTIONS.map((item) => {
          const cfg = statusCfg[item.status] ?? statusCfg.PENDING;
          return (
            <View key={item.id} style={[styles.inspCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
              <View style={[styles.inspAccent, { backgroundColor: cfg.accent }]} />
              <View style={styles.inspBody}>
                <View style={styles.inspTopRow}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={[styles.inspSite, { color: t.textPrimary }]}>{item.site}</Text>
                    <Text style={[styles.inspId, { color: t.textSecondary }]}>{item.id}</Text>
                  </View>
                  <View style={[styles.inspBadge, { backgroundColor: cfg.bg }]}>
                    <Text style={[styles.inspBadgeText, { color: cfg.text }]}>{item.status}</Text>
                  </View>
                </View>
                <View style={styles.inspMetaRow}>
                  <MaterialIcons name="schedule" size={12} color={t.textSecondary} />
                  <Text style={[styles.inspMeta, { color: t.textSecondary }]}>{item.time}</Text>
                  <View style={[styles.metaDot, { backgroundColor: t.textMuted }]} />
                  <MaterialIcons name="place" size={12} color={t.textSecondary} />
                  <Text style={[styles.inspMeta, { color: t.textSecondary }]}>{item.sector}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
