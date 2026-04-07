import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TextInput,
  TouchableOpacity, Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useAppTheme } from '@/hooks/use-app-theme';
import { styles } from '@/styles/main/home.styles';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const t = useAppTheme();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const stats = [
    { value: '124', label: 'Inspections', icon: 'assignment-turned-in', color: t.blue, bg: t.blueSoft },
    { value: '08', label: 'Pending', icon: 'pending-actions', color: t.amber, bg: t.amberSoft },
    { value: '92', label: 'Completed', icon: 'verified', color: t.green, bg: t.greenSoft },
    { value: '14', label: 'Issues', icon: 'error-outline', color: t.red, bg: t.redSoft },
  ];

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://192.168.1.7:8001/test-read');
      const json = await res.json();
      setReports(json.data || []);
    } catch (err) {
      console.log('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <View style={[styles.avatarRing, { borderColor: `${t.blue}50` }]}>
              <View style={styles.avatar}>
                <Image
                  source={require('../../assets/images/logo.png')}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              </View>
            </View>
            <View>
              <Text style={[styles.roleText, { color: t.textSecondary }]}>Field Director</Text>
              <Text style={[styles.brandText, { color: t.textPrimary }]}>
                Digi<Text style={{ color: t.red }}>QC</Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.notifBtn, { backgroundColor: t.cardSubtle, borderColor: t.cardBorder }]}
            onPress={() => navigation.navigate('Notifications')}
          >
            <MaterialIcons name="notifications-none" size={22} color={t.textSecondary} />
            <View style={[styles.notifDot, { borderColor: t.notifDotBorder }]} />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={[styles.heroCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={[styles.heroGlow, { backgroundColor: t.glow }]} />
          <Text style={[styles.heroGreeting, { color: t.textPrimary }]}>Hello, Inspector</Text>
          <Text style={[styles.heroSubtext, { color: t.textSecondary }]}>
            Ready for today's structural audits at Site-B?
          </Text>
          <View style={[styles.searchBox, { backgroundColor: t.searchBg, borderColor: t.cardBorder }]}>
            <MaterialIcons name="search" size={18} color={t.searchPlaceholder} />
            <TextInput
              placeholder="Search inspections, sites, or reports..."
              placeholderTextColor={t.searchPlaceholder}
              style={[styles.searchInput, { color: t.searchText }]}
            />
            <View style={[styles.searchDivider, { backgroundColor: t.searchDivider }]} />
            <MaterialIcons name="tune" size={18} color={t.searchPlaceholder} />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
              <View style={[styles.statIconBox, { backgroundColor: s.bg }]}>
                <MaterialIcons name={s.icon} size={20} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: t.textPrimary }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: t.textSecondary }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Today's overview */}
        <View style={[styles.overviewCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={styles.overviewHeader}>
            <View style={[styles.overviewIconBox, { backgroundColor: t.blueSoft }]}>
              <MaterialIcons name="today" size={18} color={t.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.overviewTitle, { color: t.textPrimary }]}>Today's Overview</Text>
              <Text style={[styles.overviewSub, { color: t.textSecondary }]}>24 Mar 2026 • 3 sites scheduled</Text>
            </View>
          </View>
          <View style={[styles.overviewDivider, { backgroundColor: t.cardBorder }]} />
          <View style={styles.overviewRow}>
            {[
              { value: '3', label: 'Scheduled', color: t.textPrimary },
              { value: '1', label: 'Completed', color: t.green },
              { value: '2', label: 'Remaining', color: t.amber },
            ].map((o, i) => (
              <React.Fragment key={o.label}>
                {i > 0 && <View style={[styles.overviewStatDivider, { backgroundColor: t.cardBorder }]} />}
                <View style={styles.overviewStat}>
                  <Text style={[styles.overviewStatValue, { color: o.color }]}>{o.value}</Text>
                  <Text style={[styles.overviewStatLabel, { color: t.textSecondary }]}>{o.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Backend Test Data */}
        <View style={[styles.aboutCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <Text style={[styles.overviewTitle, { color: t.textPrimary, marginBottom: 10 }]}>
            Backend Test Data
          </Text>

          {loading ? (
            <Text style={{ color: t.textSecondary }}>Loading...</Text>
          ) : reports.length === 0 ? (
            <Text style={{ color: t.textSecondary }}>No reports found</Text>
          ) : (
            reports.map((item) => (
              <View key={item.id} style={{ marginBottom: 12 }}>
                <Text style={{ color: t.textPrimary }}>Site: {item.site_name}</Text>
                <Text style={{ color: t.textSecondary }}>Status: {item.status}</Text>
              </View>
            ))
          )}
        </View>

        {/* About */}
        <View style={[styles.aboutCard, { backgroundColor: t.cardSubtle, borderColor: t.cardBorder }]}>
          <MaterialIcons name="info-outline" size={18} color={t.textMuted} />
          <Text style={[styles.aboutText, { color: t.textSecondary }]}>
            DigiQC is a smart quality control platform designed to streamline inspection processes,
            manage reports, and maintain high standards of safety and quality through AI-powered tools.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}
