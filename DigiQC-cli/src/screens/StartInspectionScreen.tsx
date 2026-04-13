import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Platform,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { styles } from '@/styles/start-inspection.styles';
import { inspectionService } from '@/services/inspection.service';

interface ChecklistItem {
  id: string;
  question: string;
  answer: 'Yes' | 'No' | 'N/A' | null;
}

export default function StartInspectionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'StartInspection'>>();
  const [workType, setWorkType] = useState('');
  const [checklistTitle, setChecklistTitle] = useState('');
  const [structureType, setStructureType] = useState('');
  const [checklistType, setChecklistType] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  );
  const [showTypeList, setShowTypeList] = useState(false);
  const [inspectionTypes, setInspectionTypes] = useState<string[]>([]);

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: '1', question: 'Material quality check?', answer: null },
    { id: '2', question: 'Alignment and plumb check?', answer: null },
    { id: '3', question: 'Mortar ratio check?', answer: null },
    { id: '4', question: 'Curing status check?', answer: null },
  ]);

  // Receive items back from EditTemplateScreen
  useEffect(() => {
    const templateItems = route.params?.templateItems;
    if (templateItems && templateItems.length > 0) {
      setChecklistItems(
        templateItems.map(i => ({
          id: i.id,
          question: i.question,
          answer: (i.answer as 'Yes' | 'No' | 'N/A' | null) ?? null,
        }))
      );
    }
  }, [route.params?.templateItems]);

  useEffect(() => {
    const loadInspectionTypes = async () => {
      try {
        const result = await inspectionService.getInspectionTypes();

        if (result?.data && result.data.length > 0) {
          setInspectionTypes(result.data);
        } else {
          setInspectionTypes([
            'Concrete Quality',
            'Safety Compliance',
            'Electrical Inspection',
            'Plumbing Check',
            'Structural Alignment',
          ]);
        }
      } catch (error) {
        console.log('Failed to load inspection types:', error);
        setInspectionTypes([
          'Concrete Quality',
          'Safety Compliance',
          'Electrical Inspection',
          'Plumbing Check',
          'Structural Alignment',
        ]);
      }
    };

    loadInspectionTypes();
  }, []);

  const handleStart = () => {
    if (!workType.trim() || !checklistTitle.trim()) {
      Alert.alert('Please fill in all required fields (Work Type and Checklist Title).');
      return;
    }
    navigation.navigate('Checklists', {
      workType, checklistTitle
    });
  };

  const handleEditTemplate = () => {
    navigation.navigate('EditTemplate', {
      items: checklistItems.map(i => i.question),
    });
  };

  const previewMax = 4;
  const previewItems = checklistItems.slice(0, previewMax);
  const remaining = checklistItems.length - previewMax;

  const newLocal = <MaterialIcons name="add-circle" size={36} color="#005bbf" />;
  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#191c1d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Start Inspection</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.body}>
        <View style={[styles.iconBadge, { backgroundColor: '#e8f0fe' }]}>
          {newLocal}
        </View>
        <Text style={[styles.pageTitle, { color: '#191c1d' }]}>New Checklist</Text>
        <Text style={[styles.pageSubtitle, { color: '#727785' }]}>Fill in the details below to begin your quality inspection checklist.</Text>

        {/* Work Type */}
        <Text style={[styles.label, { color: '#525f73' }]}>WORK TYPE</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="handyman" size={18} color="#727785" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: '#191c1d' }]}
            placeholder="e.g. Concrete Pouring"
            placeholderTextColor="#727785"
            value={workType}
            onChangeText={setWorkType}
          />
        </View>

        {/* Checklist Title */}
        <Text style={[styles.label, { color: '#525f73' }]}>CHECKLIST TITLE</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="assignment" size={18} color="#727785" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: '#191c1d' }]}
            placeholder="e.g. Pre-pour Checklist"
            placeholderTextColor="#727785"
            value={checklistTitle}
            onChangeText={setChecklistTitle}
          />
        </View>

        {/* Questions Preview (compact) */}
        <View style={{ marginTop: 24, marginBottom: 12 }}>
          <Text style={[styles.label, { color: '#525f73', marginBottom: 12 }]}>QUESTIONS PREVIEW (AUTO-LOADED)</Text>
          <View style={{
            backgroundColor: '#f8f9fa',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#e1e3e8',
            overflow: 'hidden',
          }}>
            {previewItems.map((item, index) => (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 13,
                  paddingHorizontal: 16,
                  borderBottomWidth: index < previewItems.length - 1 || remaining > 0 ? 1 : 0,
                  borderBottomColor: '#e8eaed',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#005bbf', width: 24 }}>
                  {index + 1}.
                </Text>
                <Text style={{ flex: 1, fontSize: 14, color: '#191c1d' }} numberOfLines={1}>
                  {item.question}
                </Text>
              </View>
            ))}

            {remaining > 0 && (
              <View style={{ paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#f0f2f5' }}>
                <Text style={{ fontSize: 12, color: '#727785', fontStyle: 'italic' }}>
                  + {remaining} more question{remaining > 1 ? 's' : ''} included automatically
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Create Template Button */}
        <TouchableOpacity
          onPress={handleEditTemplate}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 14,
            height: 52,
            marginTop: 8,
            marginBottom: 12,
            backgroundColor: '#1a2332',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
            gap: 8,
          }}
          activeOpacity={0.85}
        >
          <MaterialIcons name="description" size={18} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>
            Create Template
          </Text>
        </TouchableOpacity>

        {/* Start Button */}
        <TouchableOpacity style={[styles.startBtn, { backgroundColor: '#005bbf', shadowColor: '#005bbf' }]} onPress={handleStart} activeOpacity={0.85}>
          <Text style={styles.startBtnText}>Proceed to Assign</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
