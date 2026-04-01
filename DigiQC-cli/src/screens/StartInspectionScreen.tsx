import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Platform,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { styles } from '@/styles/start-inspection.styles';
import { inspectionService } from '@/services/inspection.service';

export default function StartInspectionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [projectName, setProjectName] = useState('');
  const [siteName, setSiteName] = useState('');
  const [structureType, setStructureType] = useState('');
  const [checklistType, setChecklistType] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  );
  const [showTypeList, setShowTypeList] = useState(false);
  const [inspectionTypes, setInspectionTypes] = useState<string[]>([]);

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
    if (!projectName.trim() || !siteName.trim() || !checklistType || !inspectorName.trim()) {
      Alert.alert('Please fill in all required fields (Project, Site, Checklist Type, and Inspector).');
      return;
    }
    navigation.navigate('Checklists', {
      projectName, siteName, structureType, checklistType, date, inspectorName
    });
  };

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
          <MaterialIcons name="add-circle" size={36} color="#005bbf" />
        </View>
        <Text style={[styles.pageTitle, { color: '#191c1d' }]}>New Inspection</Text>
        <Text style={[styles.pageSubtitle, { color: '#727785' }]}>Fill in the details below to begin your quality inspection checklist.</Text>

        {/* Project Name */}
        <Text style={[styles.label, { color: '#525f73' }]}>PROJECT NAME</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="business" size={18} color="#727785" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: '#191c1d' }]}
            placeholder="e.g. Skyline Heights"
            placeholderTextColor="#727785"
            value={projectName}
            onChangeText={setProjectName}
          />
        </View>

        {/* Site Name */}
        <Text style={[styles.label, { color: '#525f73' }]}>SITE / LOCATION</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="location-on" size={18} color="#727785" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: '#191c1d' }]}
            placeholder="e.g. Block A - Ground Floor"
            placeholderTextColor="#727785"
            value={siteName}
            onChangeText={setSiteName}
          />
        </View>

        {/* Structure Type & Checklist Type */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: '#525f73' }]}>STRUCTURE TYPE</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={[styles.input, { color: '#191c1d' }]}
                placeholder="e.g. Commercial"
                placeholderTextColor="#727785"
                value={structureType}
                onChangeText={setStructureType}
              />
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: '#525f73' }]}>CHECKLIST TYPE</Text>
            <TouchableOpacity style={styles.inputBox} onPress={() => setShowTypeList(!showTypeList)} activeOpacity={0.8}>
              <Text style={[styles.input, { color: checklistType ? '#191c1d' : '#727785', paddingTop: Platform.OS === 'ios' ? 2 : 0 }]} numberOfLines={1}>
                {checklistType || 'Select type'}
              </Text>
              <MaterialIcons name={showTypeList ? 'expand-more' : 'expand-more'} size={18} color="#727785" />
            </TouchableOpacity>
          </View>
        </View>

        {showTypeList && (
          <View style={styles.dropdown}>
            {inspectionTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.dropdownItem, checklistType === type && styles.dropdownItemActive]}
                onPress={() => { setChecklistType(type); setShowTypeList(false); }}
              >
                <Text style={[styles.dropdownText, checklistType === type && styles.dropdownTextActive]}>
                  {type}
                </Text>
                {checklistType === type && <MaterialIcons name="check" size={18} color="#005bbf" />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Inspector Name */}
        <Text style={[styles.label, { color: '#525f73' }]}>INSPECTOR NAME</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="person" size={18} color="#727785" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: '#191c1d' }]}
            placeholder="e.g. Mark Johnson"
            placeholderTextColor="#727785"
            value={inspectorName}
            onChangeText={setInspectorName}
          />
        </View>

        {/* Date */}
        <Text style={[styles.label, { color: '#525f73' }]}>INSPECTION DATE</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="calendar-today" size={18} color="#727785" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: '#191c1d' }]}
            value={date}
            onChangeText={setDate}
            placeholder="DD MMM YYYY"
            placeholderTextColor="#727785"
          />
        </View>

        {/* Start Button */}
        <TouchableOpacity style={[styles.startBtn, { backgroundColor: '#005bbf', shadowColor: '#005bbf' }]} onPress={handleStart} activeOpacity={0.85}>
          <Text style={styles.startBtnText}>Start Inspection</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
