import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { styles } from '../styles/checklists.styles';
import { inspectionService, InspectionItem } from '../services/inspection.service';

type Props = NativeStackScreenProps<RootStackParamList, 'ChecklistExecution'>;
type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function ChecklistScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<Props['route']>();
  const { inspection_id, projectName, inspectorName, date } = route.params;

  const [items, setItems] = useState<InspectionItem[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadItems();
  }, [inspection_id]);

  const loadItems = async () => {
    try {
      const data = await inspectionService.getExecutionItems(inspection_id);
      setItems(data);
    } catch (err) {
      Alert.alert('Load Error', 'Failed to fetch checklist questions.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Save Answer Action ────────────────────────────────────────────────
  const handleAnswer = async (itemId: string, choice: string) => {
    setSaving(prev => ({ ...prev, [itemId]: true }));
    try {
      // POST single answer per spec
      await inspectionService.saveAnswer(inspection_id, itemId, choice);
      
      // Update local state
      setAnswers(prev => ({ ...prev, [itemId]: choice }));
    } catch (err: any) {
      Alert.alert('Error', 'Failed to save answer to database.');
    } finally {
      setSaving(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const isComplete = items.length > 0 && Object.keys(answers).length === items.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#191c1d" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Checklist Execution</Text>
          <Text style={styles.headerSub}>{projectName || 'Site Inspection'}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#005bbf" style={{ marginTop: 60 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {items.map((item, index) => (
            <View key={item.id} style={styles.card}>
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                <View style={styles.itemIcon}>
                  <Text style={{ fontWeight: '800', color: '#005bbf' }}>{index + 1}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 16, color: '#191c1d', fontWeight: '600' }}>
                  {item.question_text}
                </Text>
              </View>

              <View style={styles.buttons}>
                {(['Yes', 'No', 'N/A']).map((opt) => {
                  const isSelected = answers[item.id] === opt.toLowerCase();
                  const isSaving = saving[item.id];
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.statusBtn,
                        isSelected && { backgroundColor: opt === 'Yes' ? '#006d3a' : opt === 'No' ? '#ba1a1a' : '#525f73', borderColor: 'transparent' }
                      ]}
                      onPress={() => !isSaving && handleAnswer(item.id, opt)}
                      disabled={isSaving}
                    >
                      {isSaving && isSelected ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={[styles.btnLabel, isSelected && { color: '#fff' }]}>{opt}</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          {/* Complete Button */}
          <TouchableOpacity
            style={[styles.submitBtn, { marginTop: 20, backgroundColor: isComplete ? '#006d3a' : '#b0bec5' }]}
            onPress={() => {
              if (!isComplete) {
                Alert.alert('Incomplete', 'Please answer all questions before finishing.');
                return;
              }
              navigation.navigate('ReportSummary', {
                reportId: `QC-${Math.floor(Math.random() * 9000) + 1000}`,
                projectName: projectName || '',
                inspectorName: inspectorName || '',
                date: date || '',
                summary: `Total: ${items.length}, Answered: ${Object.keys(answers).length}`,
                responses: JSON.stringify(answers)
              });
            }}
          >
            <MaterialIcons name="send" size={20} color="#fff" />
            <Text style={styles.submitBtnText}>Finish Inspection</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}
