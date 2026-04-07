import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { styles } from '@/styles/edit-template.styles';

interface ChecklistItem {
  id: string;
  question: string;
  answer: 'Yes' | 'No' | 'N/A' | null;
}

type EditTemplateRouteProp = RouteProp<RootStackParamList, 'EditTemplate'>;

export default function EditTemplateScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<EditTemplateRouteProp>();

  const incoming = route.params?.items;
  const [items, setItems] = useState<ChecklistItem[]>(
    incoming && incoming.length > 0
      ? incoming.map((q: string, i: number) => ({ id: String(i + 1), question: q, answer: null }))
      : [
          { id: '1', question: 'Material quality check?', answer: null },
          { id: '2', question: 'Alignment and plumb check?', answer: null },
          { id: '3', question: 'Mortar ratio check?', answer: null },
          { id: '4', question: 'Curing status check?', answer: null },
        ]
  );

  const answered = items.filter(i => i.answer !== null).length;
  const unanswered = items.length - answered;

  const handleAdd = () => {
    setItems([...items, { id: Date.now().toString(), question: '', answer: null }]);
  };

  const handleUpdate = (id: string, text: string) => {
    setItems(items.map(i => (i.id === id ? { ...i, question: text } : i)));
  };

  const handleAnswer = (id: string, answer: 'Yes' | 'No' | 'N/A') => {
    setItems(items.map(i => (i.id === id ? { ...i, answer: i.answer === answer ? null : answer } : i)));
  };

  const handleRemove = (id: string) => {
    if (items.length <= 1) {
      Alert.alert('Cannot Remove', 'At least one question is required.');
      return;
    }
    Alert.alert('Remove Question', 'Are you sure you want to delete this question?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setItems(items.filter(i => i.id !== id)) },
    ]);
  };

  const handleSave = () => {
    const emptyQuestions = items.filter(i => !i.question.trim());
    if (emptyQuestions.length > 0) {
      Alert.alert('Incomplete', `${emptyQuestions.length} question(s) have empty text. Please fill them in.`);
      return;
    }
    // Pass the items back via navigation params
    navigation.navigate('StartInspection', {
      templateItems: items.map(i => ({ id: i.id, question: i.question, answer: i.answer })),
    } as any);
  };

  const getAnswerIcon = (opt: string) => {
    switch (opt) {
      case 'Yes': return 'check-circle';
      case 'No': return 'cancel';
      case 'N/A': return 'remove-circle';
      default: return 'radio-button-unchecked';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#191c1d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Template</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{items.length}</Text>
          <Text style={styles.statLabel}>TOTAL</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#006d3a' }]}>{answered}</Text>
          <Text style={styles.statLabel}>ANSWERED</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#ba1a1a' }]}>{unanswered}</Text>
          <Text style={styles.statLabel}>PENDING</Text>
        </View>
      </View>

      {/* Questions List */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>INSPECTION QUESTIONS</Text>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>{items.length} items</Text>
          </View>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <MaterialIcons name="playlist-add" size={32} color="#005bbf" />
            </View>
            <Text style={styles.emptyTitle}>No Questions Yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap "Add Question" below to start{'\n'}building your inspection template.
            </Text>
          </View>
        ) : (
          items.map((item, index) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.cardIndex}>
                  <Text style={styles.cardIndexText}>{index + 1}</Text>
                </View>
                <View style={styles.cardBody}>
                  <TextInput
                    style={styles.questionInput}
                    value={item.question}
                    onChangeText={text => handleUpdate(item.id, text)}
                    placeholder="Type your question here..."
                    placeholderTextColor="#a0a4b0"
                    multiline
                  />
                </View>
                <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.deleteBtn}>
                  <MaterialIcons name="delete-outline" size={20} color="#ba1a1a" />
                </TouchableOpacity>
              </View>

              {/* Answer Options */}
              <View style={styles.answerRow}>
                {(['Yes', 'No', 'N/A'] as const).map(opt => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => handleAnswer(item.id, opt)}
                    style={[styles.answerChip, item.answer === opt && styles.answerChipActive]}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons
                      name={getAnswerIcon(opt)}
                      size={15}
                      color={item.answer === opt ? '#005bbf' : '#a0a4b0'}
                    />
                    <Text style={[styles.answerChipText, item.answer === opt && styles.answerChipTextActive]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.75}>
            <MaterialIcons name="add" size={20} color="#005bbf" />
            <Text style={styles.addBtnText}>Add Question</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <MaterialIcons name="save" size={18} color="#fff" />
            <Text style={styles.saveBtnText}>Save Template</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
