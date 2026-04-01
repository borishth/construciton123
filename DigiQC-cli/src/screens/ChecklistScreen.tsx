import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { styles } from '@/styles/checklists.styles';
import { inspectionService } from '@/services/inspection.service';

type Status = 'Yes' | 'No' | 'N/A' | 'none';
type Props = NativeStackScreenProps<RootStackParamList, 'Checklists'>;

export default function ChecklistScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Props['route']>();
  const { projectName, siteName, structureType, checklistType, date, inspectorName } = route.params || {};

  const [checklistItems, setChecklistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Record<string, Status>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [defectTypes, setDefectTypes] = useState<string[]>([
    'Crack',
    'Leakage',
    'Alignment Issue',
    'Surface Damage',
    'Honeycombing'
  ]);
  const [defectSelections, setDefectSelections] = useState<Record<string, string>>({});
  const [showDefectPicker, setShowDefectPicker] = useState<string | null>(null);

  useEffect(() => {
    loadChecklist();
  }, []);

  const loadChecklist = async () => {
    try {
      const items = await inspectionService.getChecklistItems();
      setChecklistItems(items);
      setResults(Object.fromEntries(items.map((i: any) => [i.id, 'none'])));
      setComments(Object.fromEntries(items.map((i: any) => [i.id, ''])));
    } catch (error) {
      console.error('Failed to load checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  const setStatus = (id: string, status: Status) => {
    setResults((prev) => ({ ...prev, [id]: status }));
  };

  const handleSubmit = async () => {
    const unrated = checklistItems.filter((i) => results[i.id] === 'none');
    if (unrated.length > 0) {
      alert(`Please rate all items. Missing: ${unrated.map((i) => i.label).join(', ')}`);
      return;
    }

    const passedCount = checklistItems.filter(i => results[i.id] === 'Yes').length;
    const failedCount = checklistItems.filter(i => results[i.id] === 'No').length;
    const naCount = checklistItems.filter(i => results[i.id] === 'N/A').length;
    
    const responses = checklistItems.map(item => ({
      id: item.id,
      label: item.label,
      status: results[item.id],
      defectType: results[item.id] === 'No' ? defectSelections[item.id] : undefined,
      comment: results[item.id] === 'No' ? comments[item.id] : undefined,
    }));

    const reportId = `#QC-${Math.floor(Math.random() * 9000) + 1000}`;
    const overallStatus = failedCount > 0 ? 'FAIL' : 'PASS';

    await inspectionService.submitInspection({
      projectName: projectName as string,
      siteName: siteName as string,
      structureType: structureType as string,
      checklistType: checklistType as string,
      date: date as string,
      inspectorName: inspectorName as string,
      status: overallStatus,
      responses,
      summary: {
        totalItems: checklistItems.length,
        passedCount,
        failedCount,
        naCount,
      }
    });

    navigation.navigate('ReportSummary', {
      reportId,
      projectName: projectName as string,
      siteName: siteName as string,
      inspectorName: inspectorName as string,
      date: date as string,
      summary: JSON.stringify({
        totalItems: checklistItems.length,
        passedCount,
        failedCount,
        naCount,
      }),
      responses: JSON.stringify(responses),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#191c1d" />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: '#191c1d' }]}>Inspection Checklist</Text>
          <Text style={[styles.headerSub, { color: '#727785' }]}>{siteName} • {date}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.typeBadge, { backgroundColor: '#e8f0fe' }]}>
          <MaterialIcons name="fact-check" size={16} color="#005bbf" />
          <Text style={[styles.typeText, { color: '#005bbf' }]}>{checklistType}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#005bbf" style={{ marginTop: 40 }} />
        ) : (
          checklistItems.map((item) => {
            const status = results[item.id];
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.itemLeft}>
                    <View style={[styles.itemIcon, { backgroundColor: '#e8f0fe' }]}>
                      <MaterialIcons name={item.icon || 'check-box-outline-blank'} size={20} color="#005bbf" />
                    </View>
                    <Text style={[styles.itemLabel, { color: '#191c1d' }]}>{item.label}</Text>
                  </View>
                  <View style={[styles.buttons, { flexWrap: 'wrap', justifyContent: 'flex-end', gap: 6 }]}>
                    <TouchableOpacity
                      style={[styles.statusBtn, { minWidth: 60 }, status === 'Yes' && { backgroundColor: '#006d3a', borderColor: '#006d3a' }]}
                      onPress={() => setStatus(item.id, 'Yes')}
                    >
                      <Text style={[styles.btnLabel, { color: status === 'Yes' ? '#fff' : '#006d3a' }]}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.statusBtn, { minWidth: 60 }, status === 'No' && { backgroundColor: '#ba1a1a', borderColor: '#ba1a1a' }]}
                      onPress={() => setStatus(item.id, 'No')}
                    >
                      <Text style={[styles.btnLabel, { color: status === 'No' ? '#fff' : '#ba1a1a' }]}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.statusBtn, { minWidth: 60 }, status === 'N/A' && { backgroundColor: '#525f73', borderColor: '#525f73' }]}
                      onPress={() => setStatus(item.id, 'N/A')}
                    >
                      <Text style={[styles.btnLabel, { color: status === 'N/A' ? '#fff' : '#525f73' }]}>N/A</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {status === 'No' && (
                  <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: '#f1f3f4', paddingTop: 12 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#ba1a1a', marginBottom: 8 }}>DEFECT DETAILS REQUIRED</Text>
                    
                    <TouchableOpacity 
                      style={[styles.inputBox, { marginBottom: 8, height: 40, paddingHorizontal: 12, backgroundColor: '#fff8f7' }]} 
                      onPress={() => setShowDefectPicker(showDefectPicker === item.id ? null : item.id)}
                    >
                      <Text style={{ flex: 1, color: defectSelections[item.id] ? '#191c1d' : '#ba1a1a', fontSize: 14 }}>
                        {defectSelections[item.id] || 'Select Defect Type...'}
                      </Text>
                      <MaterialIcons name="arrow-drop-down" size={24} color="#ba1a1a" />
                    </TouchableOpacity>

                    {showDefectPicker === item.id && (
                      <View style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ffdad6', marginBottom: 12, overflow: 'hidden' }}>
                        {defectTypes.map((dt) => (
                          <TouchableOpacity 
                            key={dt} 
                            style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f3f4', backgroundColor: defectSelections[item.id] === dt ? '#ffdad6' : '#fff' }}
                            onPress={() => { setDefectSelections({ ...defectSelections, [item.id]: dt }); setShowDefectPicker(null); }}
                          >
                            <Text style={{ color: '#191c1d', fontSize: 13 }}>{dt}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    <TextInput
                      style={[styles.commentInput, { backgroundColor: '#fff8f7', borderColor: '#ffdad6', color: '#191c1d' }]}
                      placeholder="Describe the defect..."
                      placeholderTextColor="#ba1a1a80"
                      value={comments[item.id]}
                      onChangeText={(t) => setComments((prev) => ({ ...prev, [item.id]: t }))}
                    />
                  </View>
                )}
              </View>
            );
          })
        )}

        {!loading && (
          <TouchableOpacity style={[styles.submitBtn, { backgroundColor: '#005bbf', shadowColor: '#005bbf' }]} onPress={handleSubmit} activeOpacity={0.85}>
            <Text style={styles.submitBtnText}>Submit Inspection</Text>
            <MaterialIcons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
