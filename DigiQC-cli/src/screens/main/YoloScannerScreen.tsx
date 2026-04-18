import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAppTheme } from '@/hooks/use-app-theme';
import { styles } from '@/styles/main/yolo-scanner.styles';

export default function YoloScannerScreen() {
  const t = useAppTheme();

  function alert(arg0: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.headerArea}>
          <Text style={[styles.pageTitle, { color: t.textPrimary }]}>YOLO Scanner</Text>
          <Text style={[styles.pageSubtitle, { color: t.textSecondary }]}>AI-powered defect detection using YOLOv8</Text>
        </View>

        {/* Hero */}
        <View style={[styles.heroCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={[styles.heroGlow, { backgroundColor: t.glow }]} />
          <View style={[styles.heroGlow2, { backgroundColor: t.glow2 }]} />
          <View style={[styles.iconRing, { backgroundColor: t.blueSoft, borderColor: `${t.blue}30` }]}>
            <View style={[styles.iconInner, { backgroundColor: t.cardSubtle }]}>
              <MaterialIcons name="center-focus-strong" size={44} color={t.blue} />
            </View>
          </View>
          <Text style={[styles.heroTitle, { color: t.textPrimary }]}>Smart Defect Detection</Text>
          <Text style={[styles.heroDesc, { color: t.textSecondary }]}>
            Point your camera at any structural element to instantly detect cracks,
            misalignments, and surface defects using real-time AI analysis.
          </Text>
          <TouchableOpacity style={[styles.scanBtn, { backgroundColor: t.blue }]} onPress={() => alert('Starting YOLOv8 Scanner...')} activeOpacity={0.8}>
            <MaterialIcons name="qr-code-scanner" size={20} color="#fff" />
            <Text style={styles.scanBtnText}>Start Scanning</Text>
          </TouchableOpacity>
        </View>

        {/* Capabilities */}
        <Text style={[styles.sectionLabel, { color: t.textMuted }]}>CAPABILITIES</Text>
        <View style={styles.capRow}>
          {[
            { icon: 'speed', title: 'Real-time', sub: '30 FPS detection', color: t.blue, bg: t.blueSoft },
            { icon: 'precision-manufacturing', title: '95% Accuracy', sub: '50K+ images trained', color: t.green, bg: t.greenSoft },
          ].map((c) => (
            <View key={c.title} style={[styles.capCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
              <View style={[styles.capIcon, { backgroundColor: c.bg }]}>
                <MaterialIcons name={c.icon as any} size={22} color={c.color} />
              </View>
              <Text style={[styles.capTitle, { color: t.textPrimary }]}>{c.title}</Text>
              <Text style={[styles.capSub, { color: t.textSecondary }]}>{c.sub}</Text>
            </View>
          ))}
        </View>

        {/* Defects */}
        <Text style={[styles.sectionLabel, { color: t.textMuted }]}>DETECTABLE DEFECTS</Text>
        <View style={styles.defectGrid}>
          {[
            { icon: 'grain', label: 'Surface Cracks' }, { icon: 'straighten', label: 'Misalignment' },
            { icon: 'water-drop', label: 'Water Damage' }, { icon: 'broken-image', label: 'Spalling' },
            { icon: 'texture', label: 'Corrosion' }, { icon: 'warning-amber', label: 'Deformation' },
          ].map((d) => (
            <View key={d.label} style={[styles.defectChip, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
              <MaterialIcons name={d.icon as any} size={16} color={t.textSecondary} />
              <Text style={[styles.defectText, { color: t.textSecondary }]}>{d.label}</Text>
            </View>
          ))}
        </View>

        {/* Empty */}
        <Text style={[styles.sectionLabel, { color: t.textMuted }]}>RECENT SCANS</Text>
        <View style={[styles.emptyState, { backgroundColor: t.cardSubtle, borderColor: t.cardBorder }]}>
          <View style={[styles.emptyIcon, { backgroundColor: t.card }]}>
            <MaterialIcons name="photo-camera" size={28} color={t.textMuted} />
          </View>
          <Text style={[styles.emptyText, { color: t.textSecondary }]}>No scans yet</Text>
          <Text style={[styles.emptySubtext, { color: t.textMuted }]}>Your scan history will appear here</Text>
        </View>
      </ScrollView>
    </View>
  );
}
