import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '@/styles/inspections.styles';
import { inspectionService } from '@/services/inspection.service';
import { STATUS_CONFIG } from '@/constants/status-config';

export default function InspectionsScreen() {
  const router = useRouter();
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInspections();
  }, []);

  const loadInspections = async () => {
    try {
      const data = await inspectionService.getAllInspections();
      setInspections(data);
    } catch (error) {
      console.error('Failed to load inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#191c1d" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#191c1d' }]}>All Inspections</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.sectionLabel, { color: '#525f73' }]}>INSPECTION HISTORY</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#005bbf" style={{ marginTop: 40 }} />
        ) : (
          inspections.map((item) => {
            const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG['PENDING'];
            return (
              <View key={item.id} style={[styles.card, { borderLeftColor: cfg.border }]}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={[styles.siteTitle, { color: '#191c1d' }]}>{item.projectName || item.siteName}</Text>
                    <Text style={[styles.inspId, { color: '#525f73' }]}>{item.id} • {item.siteName}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
                    <MaterialIcons name={cfg.icon as any} size={12} color={cfg.text} />
                    <Text style={[styles.badgeText, { color: cfg.text }]}>{item.status}</Text>
                  </View>
                </View>
                <View style={styles.metaRow}>
                  <View style={styles.chip}>
                    <MaterialIcons name="category" size={12} color="#727785" />
                    <Text style={[styles.chipText, { color: '#727785' }]}>{item.checklistType}</Text>
                  </View>
                  <View style={styles.chip}>
                    <MaterialIcons name="person" size={12} color="#727785" />
                    <Text style={[styles.chipText, { color: '#727785' }]}>{item.inspectorName || 'N/A'}</Text>
                  </View>
                  <View style={styles.chip}>
                    <MaterialIcons name="calendar-today" size={12} color="#727785" />
                    <Text style={[styles.chipText, { color: '#727785' }]}>{item.date}</Text>
                  </View>
                </View>
                {item.status === 'FAIL' && (
                  <TouchableOpacity
                    style={styles.serviceBtn}
                    onPress={() => router.push({
                      pathname: '/service-request' as any,
                      params: { siteName: item.site, inspectionType: item.type, date: item.date, reportId: item.id },
                    })}
                  >
                    <MaterialIcons name="build" size={13} color="#fff" />
                    <Text style={styles.serviceBtnText}>Create Service Request</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
