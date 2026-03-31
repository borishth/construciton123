import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from '@/styles/service-request.styles';
import { useAppTheme } from '@/hooks/use-app-theme';
import { dailyReportService } from '@/services/daily-report.service';

export default function DailyReportScreen() {
  const router = useRouter();
  const t = useAppTheme();

  const [projectName, setProjectName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [workDone, setWorkDone] = useState('');
  const [progressNotes, setProgressNotes] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!projectName.trim() || !workDone.trim()) {
      Alert.alert('Missing Fields', 'Please fill in Project Name and Work Done.');
      return;
    }

    try {
      setLoading(true);
      await dailyReportService.createReport({
        project_name: projectName,
        date: date,
        work_done: workDone,
        progress_notes: progressNotes,
        general_notes: generalNotes,
        inspection_refs: [],
        ncr_refs: []
      });
      Alert.alert('Success', 'Daily report submitted successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not save the Daily Report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { backgroundColor: t.card, borderBottomColor: t.cardBorder }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={t.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.textPrimary }]}>Daily Report</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, { backgroundColor: t.card, borderColor: t.cardBorder }]}>
          <Text style={[styles.label, { color: t.textSecondary }]}>Project Name *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: t.inputBg, color: t.textPrimary, borderColor: t.inputBorder }]}
            placeholder="e.g. Skyline Mall"
            placeholderTextColor={t.textMuted}
            value={projectName}
            onChangeText={setProjectName}
          />

          <Text style={[styles.label, { color: t.textSecondary }]}>Date *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: t.inputBg, color: t.textPrimary, borderColor: t.inputBorder }]}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={t.textMuted}
          />

          <Text style={[styles.label, { color: t.textSecondary }]}>Work Done Today *</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: t.inputBg, color: t.textPrimary, borderColor: t.inputBorder }]}
            placeholder="Describe the activities..."
            placeholderTextColor={t.textMuted}
            value={workDone}
            onChangeText={setWorkDone}
            multiline
            numberOfLines={4}
          />

          <Text style={[styles.label, { color: t.textSecondary }]}>Progress Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: t.inputBg, color: t.textPrimary, borderColor: t.inputBorder }]}
            placeholder="Any delays, notable progress?"
            placeholderTextColor={t.textMuted}
            value={progressNotes}
            onChangeText={setProgressNotes}
            multiline
          />

          <Text style={[styles.label, { color: t.textSecondary }]}>General Observations</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: t.inputBg, color: t.textPrimary, borderColor: t.inputBorder }]}
            placeholder="Weather, visitors, generic info..."
            placeholderTextColor={t.textMuted}
            value={generalNotes}
            onChangeText={setGeneralNotes}
            multiline
          />

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: t.primary }, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitText}>{loading ? 'Submitting...' : 'Submit Report'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
