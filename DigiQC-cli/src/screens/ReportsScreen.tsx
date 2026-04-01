import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { styles } from '@/styles/reports.styles';
import { inspectionService } from '@/services/inspection.service';
import { STATUS_CONFIG } from '@/constants/status-config';

export default function ReportsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await inspectionService.getReports();
      setReports(data || []);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#191c1d" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#191c1d' }]}>Inspection Reports</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.sectionLabel, { color: '#525f73' }]}>ALL REPORTS</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#005bbf" style={{ marginTop: 40 }} />
        ) : (
          reports.map((report) => {
            const cfg = STATUS_CONFIG[report.status] ?? STATUS_CONFIG['PENDING'];
            return (
              <View key={report.id} style={[styles.card, { borderLeftColor: cfg.text }]}>
                <View style={styles.cardTop}>
                  <View style={styles.cardInfo}>
                    <Text style={[styles.reportSite, { color: '#191c1d' }]}>{report.projectName || report.siteName}</Text>
                    <Text style={[styles.reportId, { color: '#525f73' }]}>{report.id} • {report.siteName}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
                    <MaterialIcons name={cfg.icon as any} size={14} color={cfg.text} />
                    <Text style={[styles.badgeText, { color: cfg.text }]}>{report.status}</Text>
                  </View>
                </View>
                {report.summary && (
                  <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12, paddingHorizontal: 4 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#006d3a' }}>PASS: {report.summary.passedCount}</Text>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#ba1a1a' }}>FAIL: {report.summary.failedCount}</Text>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#525f73' }}>N/A: {report.summary.naCount}</Text>
                  </View>
                )}
                <View style={styles.cardMeta}>
                  <View style={styles.metaChip}>
                    <MaterialIcons name="category" size={12} color="#727785" />
                    <Text style={[styles.metaText, { color: '#727785' }]}>{report.checklistType}</Text>
                  </View>
                  <View style={styles.metaChip}>
                    <MaterialIcons name="calendar-today" size={12} color="#727785" />
                    <Text style={[styles.metaText, { color: '#727785' }]}>{report.date}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.serviceBtn, { backgroundColor: '#e8f0fe', marginTop: 12 }]}
                  onPress={() => navigation.navigate('ReportSummary', { 
                    reportId: report.id,
                    projectName: report.projectName,
                    siteName: report.siteName,
                    inspectorName: report.inspectorName,
                    date: report.date,
                    summary: JSON.stringify(report.summary || {}),
                    responses: JSON.stringify(report.responses || [])
                  })}
                >
                  <MaterialIcons name="assessment" size={14} color="#005bbf" />
                  <Text style={[styles.serviceBtnText, { color: '#005bbf' }]}>View Detailed Report</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
