import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { styles } from '@/styles/service.styles';
import { serviceRequestService } from '@/services/service-request.service';

type ServiceStatus = 'Pending' | 'In Progress' | 'Completed';
type ServiceItem = { id: string; issue: string; assignee: string; priority: string; repairDate: string; status: ServiceStatus };

const STATUS_COLORS: Record<ServiceStatus, { bg: string; text: string }> = {
  Pending: { bg: '#d6e3fb', text: '#3b485a' },
  'In Progress': { bg: '#fff3cd', text: '#856404' },
  Completed: { bg: '#d7f8df', text: '#006d3a' },
};
const PRIORITY_COLORS: Record<string, string> = { Low: '#006d3a', Medium: '#b45309', High: '#ba1a1a' };

export default function ServiceScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await serviceRequestService.getServiceRequests();
      setServices(data || []);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const advanceStatus = async (id: string) => {
    try {
      await serviceRequestService.advanceStatus(id);
      loadServices(); // Reload from backend
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#191c1d" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#191c1d' }]}>Service Requests</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.sectionLabel, { color: '#525f73' }]}>ACTIVE REQUESTS</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#005bbf" style={{ marginTop: 40 }} />
        ) : (
          services.map((item) => {
            const statusCfg = STATUS_COLORS[item.status] || STATUS_COLORS['Pending'];
            const priorityColor = PRIORITY_COLORS[item.priority] ?? '#727785';
            const isResolved = item.status === 'Completed';
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={[styles.issueTitle, { color: '#191c1d' }]}>{item.issue}</Text>
                    <Text style={[styles.issueId, { color: '#525f73' }]}>{item.id}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                    <Text style={[styles.statusText, { color: statusCfg.text }]}>{item.status}</Text>
                  </View>
                </View>
                <View style={styles.metaRow}>
                  <View style={styles.metaChip}>
                    <MaterialIcons name="person" size={13} color="#727785" />
                    <Text style={[styles.metaText, { color: '#727785' }]}>{item.assignee}</Text>
                  </View>
                  <View style={styles.metaChip}>
                    <MaterialIcons name="calendar-today" size={13} color="#727785" />
                    <Text style={[styles.metaText, { color: '#727785' }]}>{item.repairDate}</Text>
                  </View>
                  <View style={[styles.priorityChip, { backgroundColor: `${priorityColor}18` }]}>
                    <Text style={[styles.priorityText, { color: priorityColor }]}>{item.priority}</Text>
                  </View>
                </View>
                {!isResolved && (
                  <TouchableOpacity style={[styles.advanceBtn, { backgroundColor: '#e8f0fe' }]} onPress={() => advanceStatus(item.id)}>
                    <MaterialIcons name={item.status === 'Pending' ? 'play-arrow' : 'check-circle'} size={16} color="#005bbf" />
                    <Text style={[styles.advanceBtnText, { color: '#005bbf' }]}>
                      {item.status === 'Pending' ? 'Mark In Progress' : 'Mark as Resolved'}
                    </Text>
                  </TouchableOpacity>
                )}
                {isResolved && (
                  <View style={[styles.resolvedTag, { backgroundColor: '#d7f8df' }]}>
                    <MaterialIcons name="verified" size={14} color="#006d3a" />
                    <Text style={[styles.resolvedText, { color: '#006d3a' }]}>Issue Resolved</Text>
                  </View>
                )}
              </View>
            );
          })
        )}
        <TouchableOpacity style={[styles.dashboardBtn, { backgroundColor: '#e8f0fe' }]} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}>
          <MaterialIcons name="home" size={20} color="#005bbf" />
          <Text style={[styles.dashboardBtnText, { color: '#005bbf' }]}>Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
