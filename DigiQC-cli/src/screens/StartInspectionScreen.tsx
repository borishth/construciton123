import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { styles } from '../styles/start-inspection.styles';
import { templateService } from '../services/template.service';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function StartInspectionScreen() {
  const navigation = useNavigation<NavProp>();

  const [workType, setWorkType] = useState('');
  const [checklistTitle, setChecklistTitle] = useState('');
  const [loading, setLoading] = useState(false);

  // ─── Create Template Action ───────────────────────────────────────────────
  const handleCreateTemplate = async () => {
    if (!workType.trim() || !checklistTitle.trim()) {
      Alert.alert('Required Fields', 'Please enter both Work Type and Checklist Title.');
      return;
    }

    setLoading(true);
    try {
      const result = await templateService.createTemplate(
        workType.trim(),
        checklistTitle.trim()
      );

      if (result.success) {
        // Navigate to Page 2 with the generated integer template_id
        navigation.navigate('EditTemplate', {
          template_id: result.id,
          items: [] // Initial empty list
        });
      } else {
        Alert.alert('Error', 'Failed to create template record.');
      }
    } catch (err: any) {
      console.log('Create template error:', err?.response?.data || err);
      Alert.alert(
        'API Error',
        JSON.stringify(err?.response?.data?.detail || err?.message || err)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#191c1d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Start Inspection</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.body}>
        <View style={[styles.iconBadge, { backgroundColor: '#e8f0fe' }]}>
          <MaterialIcons name="add-circle" size={36} color="#005bbf" />
        </View>
        <Text style={styles.pageTitle}>New Checklist</Text>
        <Text style={styles.pageSubtitle}>
          Create a template first, then add checklist items in the next step.
        </Text>

        {/* Work Type */}
        <Text style={styles.label}>WORK TYPE</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="handyman" size={18} color="#727785" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. Concrete"
            placeholderTextColor="#727785"
            value={workType}
            onChangeText={setWorkType}
          />
        </View>

        {/* Checklist Title */}
        <Text style={styles.label}>CHECKLIST TITLE</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="assignment" size={18} color="#727785" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. Column Inspection"
            placeholderTextColor="#727785"
            value={checklistTitle}
            onChangeText={setChecklistTitle}
          />
        </View>

        <TouchableOpacity
          style={[styles.startBtn, { marginTop: 20, backgroundColor: loading ? '#8ca8c5' : '#1a2332' }]}
          onPress={handleCreateTemplate}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
          ) : (
            <MaterialIcons name="description" size={20} color="#fff" />
          )}
          <Text style={styles.startBtnText}>
            {loading ? 'Creating Template...' : 'Create Template'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
