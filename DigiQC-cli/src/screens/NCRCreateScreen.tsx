import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ncrService } from '@/services/ncr.service';

const SEVERITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

type Props = NativeStackScreenProps<RootStackParamList, 'NCRCreate'>;

export default function NCRCreateScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Props['route']>();
  const params = route.params || {};

  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim() || !assignedTo.trim() || !dueDate.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      await ncrService.createNCR({
        inspection_id: params.inspectionId || null,
        checklist_item_id: params.checklistItemId || null,
        description,
        severity,
        assigned_to: assignedTo,
        due_date: dueDate,
        status: 'Open',
      });
      Alert.alert('Success', 'NCR created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Failed to create NCR:', error);
      Alert.alert('Error', 'Failed to create NCR. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const severityColors: Record<string, { bg: string; text: string; border: string }> = {
    Low: { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' },
    Medium: { bg: '#fff3e0', text: '#e65100', border: '#ffcc80' },
    High: { bg: '#fbe9e7', text: '#bf360c', border: '#ffab91' },
    Critical: { bg: '#ffebee', text: '#b71c1c', border: '#ef9a9a' },
  };

  return (
    <SafeAreaView style={s.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <MaterialIcons name="arrow-back" size={22} color="#191c1d" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>Create NCR</Text>
            <Text style={s.headerSub}>Non-Conformance Report</Text>
          </View>
          <MaterialIcons name="warning-amber" size={24} color="#e65100" />
        </View>

        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          {/* Context info */}
          {params.checklistItemLabel && (
            <View style={s.contextCard}>
              <MaterialIcons name="link" size={16} color="#005bbf" />
              <Text style={s.contextText}>
                Linked to: {params.checklistItemLabel}
              </Text>
            </View>
          )}

          {/* Description */}
          <Text style={s.label}>Issue Description *</Text>
          <TextInput
            style={s.textArea}
            placeholder="Describe the non-conformance issue in detail..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          {/* Severity */}
          <Text style={s.label}>Severity *</Text>
          <View style={s.severityRow}>
            {SEVERITY_OPTIONS.map((opt) => {
              const colors = severityColors[opt];
              const selected = severity === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[
                    s.severityChip,
                    { borderColor: colors.border },
                    selected && { backgroundColor: colors.bg, borderWidth: 2 },
                  ]}
                  onPress={() => setSeverity(opt)}
                >
                  <Text style={[s.severityText, { color: colors.text }]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Assigned To */}
          <Text style={s.label}>Assigned To *</Text>
          <TextInput
            style={s.input}
            placeholder="Person responsible for resolution..."
            placeholderTextColor="#999"
            value={assignedTo}
            onChangeText={setAssignedTo}
          />

          {/* Due Date */}
          <Text style={s.label}>Due Date *</Text>
          <TextInput
            style={s.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#999"
            value={dueDate}
            onChangeText={setDueDate}
          />

          {/* Submit */}
          <TouchableOpacity
            style={[s.submitBtn, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            <MaterialIcons name="check-circle" size={20} color="#fff" />
            <Text style={s.submitText}>
              {loading ? 'Submitting...' : 'Submit NCR'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f8fa' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  backBtn: { marginRight: 12, padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#191c1d' },
  headerSub: { fontSize: 12, color: '#727785', marginTop: 2 },
  scroll: { padding: 20, paddingBottom: 40 },
  contextCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#e8f0fe', borderRadius: 10, padding: 12, marginBottom: 20,
    gap: 8,
  },
  contextText: { fontSize: 13, color: '#005bbf', fontWeight: '500' },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#ddd',
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#111',
  },
  textArea: {
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#ddd',
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#111',
    minHeight: 100, textAlignVertical: 'top',
  },
  severityRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  severityChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1, borderColor: '#ddd',
  },
  severityText: { fontSize: 13, fontWeight: '600' },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#e65100', borderRadius: 14, paddingVertical: 16,
    marginTop: 30, gap: 8,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
