import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert, Modal,
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    loadItems();
  }, [inspection_id]);

  const loadItems = async () => {
    try {
      const data = await inspectionService.getExecutionItems(inspection_id);
      setItems(data);
      
      // Load initial answers if they exist
      const initialAnswers: Record<string, string> = {};
      data.forEach((item: any) => {
        if (item.answer) {
          // Sync 'na' from DB to 'n/a' in the UI
          const uiAnswer = item.answer.toLowerCase() === 'na' ? 'n/a' : item.answer.toLowerCase();
          initialAnswers[item.id] = uiAnswer;
        }
      });
      setAnswers(initialAnswers);
    } catch (err) {
      Alert.alert('Load Error', 'Failed to fetch checklist questions.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Save Answer Action ────────────────────────────────────────────────
  const handleAnswer = async (itemId: string, choice: string) => {
    const lowerChoice = choice.toLowerCase();
    
    // Optimistic Update: Change color immediately in the UI
    const previousAnswers = { ...answers };
    setAnswers(prev => ({ ...prev, [itemId]: lowerChoice }));
    setSaving(prev => ({ ...prev, [itemId]: true }));

    try {
      await inspectionService.saveAnswer(inspection_id, itemId, choice);
    } catch (err: any) {
      // Rollback if save fails
      setAnswers(previousAnswers);
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
                  const isSelected = answers[item.id] === opt.toLowerCase() || 
                                    (opt === 'N/A' && (answers[item.id] === 'n/a' || answers[item.id] === 'na'));
                  const isSaving = saving[item.id];
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.statusBtn,
                        isSelected && { backgroundColor: '#005bbf', borderColor: 'transparent' }
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

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: '#525f73' }]}
              onPress={() => setShowSuccessModal(true)}
            >
              <MaterialIcons name="event-available" size={18} color="#fff" />
              <Text style={styles.submitBtnText}>Finished for Today</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: isComplete ? '#006d3a' : '#b0bec5' }]}
              onPress={() => {
                if (!isComplete) {
                  Alert.alert('Incomplete', 'Please answer all questions before finishing.');
                  return;
                }
                setShowSuccessModal(true);
              }}
            >
              <MaterialIcons name="done-all" size={18} color="#fff" />
              <Text style={styles.submitBtnText}>Finished Inspection</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <MaterialIcons name="check" size={40} color="#006d3a" />
            </View>
            <Text style={styles.modalTitle}>Thank You!</Text>
            <Text style={styles.modalText}>
              Your progress has been recorded successfully. You can return to this project later or start a new one.
            </Text>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('Inspections');
              }}
            >
              <Text style={styles.modalBtnText}>Go to All Inspections</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
