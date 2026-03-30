import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ReportSummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse responses if they were passed, or just use the summary stats
  const summary = params.summary ? JSON.parse(params.summary as string) : null;
  const responses = params.responses ? JSON.parse(params.responses as string) : [];

  const stats = [
    { label: 'Total Items', value: summary?.totalItems || 0, color: '#191c1d' },
    { label: 'Passed (Yes)', value: summary?.passedCount || 0, color: '#006d3a' },
    { label: 'Failed (No)', value: summary?.failedCount || 0, color: '#ba1a1a' },
    { label: 'N/A', value: summary?.naCount || 0, color: '#525f73' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(main)' as any)} style={styles.backBtn}>
          <MaterialIcons name="close" size={24} color="#191c1d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inspection Summary</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroCard}>
          <View style={[styles.statusIcon, { backgroundColor: summary?.failedCount > 0 ? '#ffdad6' : '#d7f8df' }]}>
            <MaterialIcons 
              name={summary?.failedCount > 0 ? 'report-problem' : 'verified'} 
              size={48} 
              color={summary?.failedCount > 0 ? '#ba1a1a' : '#006d3a'} 
            />
          </View>
          <Text style={styles.heroTitle}>{summary?.failedCount > 0 ? 'Inspection Failed' : 'Inspection Passed'}</Text>
          <Text style={styles.heroId}>{params.reportId}</Text>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statBox}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>PROJECT DETAILS</Text>
        <View style={styles.infoCard}>
          <InfoRow label="Project" value={params.projectName as string} />
          <InfoRow label="Site" value={params.siteName as string} />
          <InfoRow label="Inspector" value={params.inspectorName as string} />
          <InfoRow label="Date" value={params.date as string} />
        </View>

        {summary?.failedCount > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: '#ba1a1a' }]}>DEFECTS & CORRECTIVE ACTIONS</Text>
            {responses.filter((r: any) => r.status === 'No').map((r: any, i: number) => (
              <View key={i} style={styles.defectCard}>
                <View style={styles.defectHeader}>
                  <MaterialIcons name="error-outline" size={18} color="#ba1a1a" />
                  <Text style={styles.defectLabel}>{r.label}</Text>
                </View>
                <View style={styles.defectBody}>
                  <Text style={styles.defectType}><Text style={{ fontWeight: '700' }}>Defect:</Text> {r.defectType}</Text>
                  <Text style={styles.defectComment}><Text style={{ fontWeight: '700' }}>Comment:</Text> {r.comment}</Text>
                  <View style={styles.correctiveAction}>
                    <MaterialIcons name="build" size={14} color="#005bbf" />
                    <Text style={styles.actionText}>Corrective action required to resolve {r.defectType.toLowerCase()}.</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        <TouchableOpacity 
          style={styles.doneBtn} 
          onPress={() => router.replace('/reports' as any)}
        >
          <Text style={styles.doneBtnText}>View All Reports</Text>
          <MaterialIcons name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingHorizontal: 16, paddingBottom: 16,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f3f4',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  scroll: { padding: 20 },
  heroCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 32,
    alignItems: 'center', marginBottom: 20,
    borderWidth: 1, borderColor: '#f1f3f4',
  },
  statusIcon: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  heroTitle: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  heroId: { fontSize: 14, color: '#727785', fontWeight: '600' },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24,
  },
  statBox: {
    flex: 1, minWidth: '45%', backgroundColor: '#fff',
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#f1f3f4',
  },
  statValue: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#727785', fontWeight: '700' },
  sectionTitle: {
    fontSize: 12, fontWeight: '800', letterSpacing: 1.2,
    marginBottom: 12, marginLeft: 4, color: '#525f73',
  },
  infoCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#f1f3f4', marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f8f9fa',
  },
  infoLabel: { fontSize: 13, color: '#727785', fontWeight: '600' },
  infoValue: { fontSize: 13, color: '#191c1d', fontWeight: '700' },
  defectCard: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#ffdad6', overflow: 'hidden',
  },
  defectHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 12, backgroundColor: '#fff8f7',
    borderBottomWidth: 1, borderBottomColor: '#ffdad6',
  },
  defectLabel: { fontSize: 14, fontWeight: '700', color: '#ba1a1a' },
  defectBody: { padding: 12 },
  defectType: { fontSize: 13, color: '#191c1d', marginBottom: 4 },
  defectComment: { fontSize: 13, color: '#525f73', marginBottom: 12 },
  correctiveAction: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#e8f0fe', padding: 10, borderRadius: 8,
  },
  actionText: { fontSize: 12, color: '#005bbf', fontWeight: '600', flex: 1 },
  doneBtn: {
    backgroundColor: '#005bbf', flexDirection: 'row', height: 56,
    borderRadius: 16, justifyContent: 'center', alignItems: 'center',
    gap: 10, marginTop: 20, marginBottom: 40,
  },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
