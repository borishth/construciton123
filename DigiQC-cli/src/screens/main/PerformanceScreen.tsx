import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function PerformanceScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Performance Metrics</Text>
        <Text style={styles.subtitle}>
          Track your inspection performance and project statistics.
        </Text>

        <View style={styles.card}>
          <MaterialIcons name="insights" size={40} color="#2563eb" />
          <Text style={styles.cardTitle}>Coming Soon</Text>
          <Text style={styles.cardText}>
            Analytics dashboards for inspections, NCRs, and project progress
            will be available here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 30,
    alignSelf: 'flex-start',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginTop: 16,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
