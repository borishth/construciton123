import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert, Modal, FlatList,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { styles } from '../styles/checklists.styles';
import { templateService, Template } from '../services/template.service';
import { inspectionService } from '../services/inspection.service';

type Props = NativeStackScreenProps<RootStackParamList, 'Checklists'>;
type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function Assignchecklist() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<Props['route']>();

  // ─── State ─────────────────────────────────────────────────────────────────
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [projectName, setProjectName] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await templateService.getTemplates();
      setTemplates(data);
      if (route.params?.template_id) {
        const match = data.find(t => t.id === route.params.template_id);
        if (match) setSelectedTemplate(match);
      }
    } catch (err) {
      Alert.alert('Load Error', 'Could not fetch templates from AWS database.');
    } finally {
      setLoadingTemplates(false);
    }
  };

  // ─── Submit Inspection Action ────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selectedTemplate) {
      Alert.alert('Selection Required', 'Please select a template from the list.');
      return;
    }
    if (!projectName.trim()) {
      Alert.alert('Missing Field', 'Please enter a project name.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await inspectionService.createInspection(
        selectedTemplate.id,
        projectName.trim(),
        assignedTo.trim() || undefined,
        dueDate.trim() || undefined
      );

      if (result.success) {
        Alert.alert('Success', 'Inspection assigned and saved successfully.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MainTabs')
          }
        ]);
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.detail || 'Failed to create inspection record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#191c1d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assign Checklist</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.typeBadge}>
          <MaterialIcons name="assignment-ind" size={16} color="#005bbf" />
          <Text style={styles.typeText}>Assign Template to Project</Text>
        </View>

        {/* Template Dropdown/Picker */}
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#525f73', marginBottom: 6 }}>SELECT TEMPLATE</Text>
        <TouchableOpacity 
          style={[styles.inputBox, { justifyContent: 'space-between' }]} 
          onPress={() => setShowPicker(true)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="description" size={18} color="#727785" style={{ marginRight: 8 }} />
            <Text style={{ color: selectedTemplate ? '#191c1d' : '#727785' }}>
              {selectedTemplate ? selectedTemplate.title : 'Tap to select...'}
            </Text>
          </View>
          <MaterialIcons name="arrow-drop-down" size={24} color="#005bbf" />
        </TouchableOpacity>

        {/* Project Name */}
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#525f73', marginTop: 16, marginBottom: 6 }}>PROJECT NAME</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="business" size={18} color="#727785" style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1, color: '#191c1d' }}
            placeholder="e.g. Project Alpha"
            value={projectName}
            onChangeText={setProjectName}
          />
        </View>

        {/* Assigned To */}
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#525f73', marginTop: 16, marginBottom: 6 }}>ASSIGNED TO</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="person" size={18} color="#727785" style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1, color: '#191c1d' }}
            placeholder="e.g. Inspector Jimmy"
            value={assignedTo}
            onChangeText={setAssignedTo}
          />
        </View>

        {/* Due Date */}
        <Text style={{ fontSize: 12, fontWeight: '700', color: '#525f73', marginTop: 16, marginBottom: 6 }}>DUE DATE</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="event" size={18} color="#727785" style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1, color: '#191c1d' }}
            placeholder="e.g. 2026-04-20"
            value={dueDate}
            onChangeText={setDueDate}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { marginTop: 32, backgroundColor: submitting ? '#8ca8c5' : '#005bbf' }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <MaterialIcons name="check-circle" size={20} color="#fff" />}
          <Text style={styles.submitBtnText}>{submitting ? 'Submitting...' : 'Submit Inspection'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Template Picker Modal */}
      <Modal visible={showPicker} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '60%' }}>
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f3f4', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, fontWeight: '800' }}>Select Template</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <MaterialIcons name="close" size={24} color="#727785" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={templates}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f3f4', backgroundColor: selectedTemplate?.id === item.id ? '#e8f0fe' : '#fff' }}
                  onPress={() => { setSelectedTemplate(item); setShowPicker(false); }}
                >
                  <Text style={{ fontSize: 15, color: '#191c1d' }}>{item.title}</Text>
                  {item.work_type && <Text style={{ fontSize: 12, color: '#727785' }}>{item.work_type}</Text>}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
