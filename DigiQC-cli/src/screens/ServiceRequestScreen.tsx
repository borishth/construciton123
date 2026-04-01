import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { styles } from '@/styles/service-request.styles';

const PRIORITIES = ['Low', 'Medium', 'High'];
const PRIORITY_COLORS: Record<string, string> = {
  Low: '#006d3a', Medium: '#b45309', High: '#ba1a1a',
};

type Props = NativeStackScreenProps<RootStackParamList, 'ServiceRequest'>;

export default function ServiceRequestScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Props['route']>();
  const params = route.params || {};

  const [description, setDescription] = useState(
    params.failedItems ? `Failed Items: ${params.failedItems}` : ''
  );
  const [priority, setPriority] = useState('Medium');
  const [assignee, setAssignee] = useState('');
  const [repairDate, setRepairDate] = useState('');

  const handleSubmit = () => {
    if (!description.trim() || !assignee.trim() || !repairDate.trim()) {
      Alert.alert('Please fill all fields.');
      return;
    }
    navigation.navigate('Service', { 
      description, priority, assignee, repairDate 
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#191c1d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Request</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.body}>
        <View style={[styles.iconBadge, { backgroundColor: '#ffdad6' }]}>
          <MaterialIcons name="build" size={36} color="#ba1a1a" />
        </View>
        <Text style={[styles.pageTitle, { color: '#191c1d' }]}>Log an Issue</Text>
        <Text style={[styles.pageSubtitle, { color: '#727785' }]}>
          An inspection item failed. Fill in the details to create a repair service request.
        </Text>

        <Text style={[styles.label, { color: '#525f73' }]}>ISSUE DESCRIPTION</Text>
        <View style={[styles.inputBox, { height: 110, alignItems: 'flex-start', paddingTop: 14 }]}>
          <MaterialIcons name="report-problem" size={18} color="#727785" style={[styles.inputIcon, { marginTop: 2 }]} />
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top', color: '#191c1d' }]}
            placeholder="Describe the issue found..."
            placeholderTextColor="#727785"
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <Text style={[styles.label, { color: '#525f73' }]}>PRIORITY</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.priorityChip, priority === p && { backgroundColor: PRIORITY_COLORS[p], borderColor: PRIORITY_COLORS[p] }]}
              onPress={() => setPriority(p)}
            >
              <Text style={[styles.priorityText, priority === p && { color: '#fff' }]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: '#525f73' }]}>ASSIGN TO</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="person" size={18} color="#727785" style={styles.inputIcon} />
          <TextInput style={[styles.input, { color: '#191c1d' }]} placeholder="Worker / Technician name" placeholderTextColor="#727785" value={assignee} onChangeText={setAssignee} />
        </View>

        <Text style={[styles.label, { color: '#525f73' }]}>EXPECTED REPAIR DATE</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="calendar-today" size={18} color="#727785" style={styles.inputIcon} />
          <TextInput style={[styles.input, { color: '#191c1d' }]} placeholder="DD MMM YYYY" placeholderTextColor="#727785" value={repairDate} onChangeText={setRepairDate} />
        </View>

        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: '#ba1a1a', shadowColor: '#ba1a1a' }]} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={styles.submitBtnText}>Submit Service Request</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
