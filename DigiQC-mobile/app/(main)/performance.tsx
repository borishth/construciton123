import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/use-app-theme';
import { styles } from '@/styles/main/performance.styles';

export default function PerformanceTab() {
  const t = useAppTheme();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.headerArea}>
          <Text style={[styles.pageTitle, { color: t.textPrimary }]}>Performance</Text>
          <Text style={[styles.pageSubtitle, { color: t.textSecondary }]}>Quality analytics & trend insights</Text>
        </View>

        {/* Score */}
        <View style={[styles.scoreCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <View style={[styles.scoreGlow, { backgroundColor: t.glow }]} />
          <View style={[styles.scoreCircle, { backgroundColor: t.cardSubtle, borderColor: t.blue }]}>
            <Text style={[styles.scoreValue, { color: t.textPrimary }]}>94</Text>
          </View>
          <Text style={[styles.scoreLabel, { color: t.green }]}>Global Quality Score</Text>
          <View style={[styles.trendBadge, { backgroundColor: t.greenSoft }]}>
            <MaterialIcons name="trending-up" size={14} color={t.green} />
            <Text style={[styles.trendText, { color: t.green }]}>+12.5% vs Last Month</Text>
          </View>
        </View>

        {/* Metrics */}
        <View style={[styles.metricsCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <Text style={[styles.metricsTitle, { color: t.textPrimary }]}>Quality Metrics</Text>
          <Text style={[styles.metricsSub, { color: t.textSecondary }]}>Quality score vs Structural integrity</Text>
          <View style={styles.progressGroup}>
            {[
              { label: 'Safety Compliance', pct: 98, color: t.green },
              { label: 'Material Precision', pct: 89, color: t.blue },
              { label: 'Timeline Adherence', pct: 92, color: t.purple },
              { label: 'Documentation', pct: 96, color: t.green },
            ].map((m) => (
              <View key={m.label} style={styles.progressItem}>
                <View style={styles.progressLabelRow}>
                  <Text style={[styles.progressLabel, { color: t.textSecondary }]}>{m.label}</Text>
                  <Text style={[styles.progressPct, { color: m.color }]}>{m.pct}%</Text>
                </View>
                <View style={[styles.progressTrack, { backgroundColor: t.trackBg }]}>
                  <View style={[styles.progressFill, { width: `${m.pct}%`, backgroundColor: m.color }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Summary */}
        <Text style={[styles.sectionLabel, { color: t.textMuted }]}>INSPECTION SUMMARY</Text>
        <View style={styles.summaryRow}>
          {[
            { icon: 'check-circle', value: '92', label: 'Passed', color: t.green },
            { icon: 'cancel', value: '18', label: 'Failed', color: t.red },
            { icon: 'schedule', value: '14', label: 'Pending', color: t.amber },
          ].map((s) => (
            <View key={s.label} style={[styles.summaryCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
              <View style={[styles.summaryIcon, { backgroundColor: `${s.color}18` }]}>
                <MaterialIcons name={s.icon as any} size={20} color={s.color} />
              </View>
              <Text style={[styles.summaryValue, { color: t.textPrimary }]}>{s.value}</Text>
              <Text style={[styles.summaryLabel, { color: t.textSecondary }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Trend */}
        <View style={[styles.trendCard, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <Text style={[styles.trendTitle, { color: t.textPrimary }]}>Monthly Trend</Text>
          <View style={styles.trendBarGroup}>
            {[
              { m: 'Oct', v: 78 }, { m: 'Nov', v: 82 }, { m: 'Dec', v: 85 },
              { m: 'Jan', v: 88 }, { m: 'Feb', v: 91 }, { m: 'Mar', v: 94 },
            ].map((item) => (
              <View key={item.m} style={styles.barCol}>
                <Text style={[styles.barValue, { color: t.textSecondary }]}>{item.v}</Text>
                <View style={[styles.barTrack, { backgroundColor: t.cardSubtle }]}>
                  <View style={[styles.barFill, { height: `${item.v}%`, backgroundColor: item.m === 'Mar' ? t.blue : `${t.blue}50` }]} />
                </View>
                <Text style={[styles.barLabel, { color: t.textSecondary }, item.m === 'Mar' && { color: t.blue }]}>{item.m}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
