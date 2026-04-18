import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { styles } from '../styles/edit-template.styles';
import { checklistItemService, ChecklistItem } from '../services/checklist-item.service';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type EditRouteProp = RouteProp<RootStackParamList, 'EditTemplate'>;

export default function EditTemplateScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<EditRouteProp>();
  const { template_id } = route.params;

  const [questionText, setQuestionText] = useState('');
  const [savedItems, setSavedItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ─── Load Existing Items ────────────────────────────────────────────────
  useEffect(() => {
    loadItems();
  }, [template_id]);

  const loadItems = async () => {
    try {
      const items = await checklistItemService.getItemsByTemplate(template_id);
      setSavedItems(items);
    } catch (err) {
      console.error('Failed to load items', err);
    } finally {
      setFetching(false);
    }
  };

  // ─── Add Question Action ───────────────────────────────────────────────
  const handleAddQuestion = async () => {
    if (!questionText.trim()) {
      Alert.alert('Empty Question', 'Please enter question text before adding.');
      return;
    }

    setLoading(true);
    try {
      // Create item in DB immediately per spec
      const newItem = await checklistItemService.createItem(
        template_id,
        questionText.trim(),
        savedItems.length + 1 // Default order_index
      );

      // Refresh list locally
      setSavedItems([...savedItems, newItem]);
      setQuestionText('');
      Alert.alert('Success', 'Question added to template.');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.detail || 'Failed to save question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#191c1d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Checklist Items</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Input for new question */}
        <View style={styles.card}>
          <Text style={styles.label}>NEW QUESTION TEXT</Text>
          <TextInput
            style={[styles.questionInput, { height: 80, textAlignVertical: 'top' }]}
            placeholder="e.g. Is the slab reinforcement correctly placed?"
            value={questionText}
            onChangeText={setQuestionText}
            multiline
          />
          <TouchableOpacity
            style={[styles.addBtn, { marginTop: 12, opacity: loading ? 0.7 : 1 }]}
            onPress={handleAddQuestion}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#005bbf" /> : <MaterialIcons name="add" size={20} color="#005bbf" />}
            <Text style={styles.addBtnText}>{loading ? 'Saving...' : 'Add Question'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>QUESTIONS IN TEMPLATE ({savedItems.length})</Text>
        </View>

        {fetching ? (
          <ActivityIndicator size="large" color="#005bbf" style={{ marginTop: 40 }} />
        ) : savedItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ color: '#727785' }}>No questions added yet.</Text>
          </View>
        ) : (
          savedItems.map((item, index) => (
            <View key={item.id} style={styles.card}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={styles.cardIndex}>
                  <Text style={styles.cardIndexText}>{index + 1}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 15, color: '#191c1d' }}>{item.question_text}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: savedItems.length > 0 ? '#005bbf' : '#b0bec5' }]}
          onPress={() => navigation.navigate('Checklists', { template_id })}
          disabled={savedItems.length === 0}
        >
          <Text style={styles.saveBtnText}>Save and Continue</Text>
          <MaterialIcons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
