import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAppTheme } from '@/hooks/use-app-theme';
import { styles } from '@/styles/service-request.styles';


export default function PhotoUploaderScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const t = useAppTheme();
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.assets && result.assets[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadPhoto = () => {
    if (!image) {
      Alert.alert('No image', 'Please select an image first.');
      return;
    }
    // Fake upload progress
    Alert.alert('Uploading', 'Simulating photo upload...', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { backgroundColor: t.card, borderBottomColor: t.cardBorder }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={t.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: t.textPrimary }]}>Attach Photo</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, { backgroundColor: t.card, borderColor: t.cardBorder, ...{ alignItems: 'center' } as any }]}>
          {image ? (
            <Image source={{ uri: image }} style={{ width: 300, height: 300, borderRadius: 12, marginBottom: 20 }} />
          ) : (
            <View style={{ width: 300, height: 300, borderRadius: 12, backgroundColor: t.cardSubtle, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: t.cardBorder, borderStyle: 'dashed' }}>
              <MaterialIcons name="image" size={48} color={t.textMuted} />
              <Text style={{ color: t.textSecondary, marginTop: 10 }}>No photo selected</Text>
            </View>
          )}

          <TouchableOpacity style={[styles.submitBtn, { backgroundColor: t.blue, marginBottom: 12, width: '100%' }]} onPress={pickImage}>
            <MaterialIcons name="photo-library" size={20} color="#fff" />
            <Text style={[styles.submitText, { marginLeft: 8 }]}>Pick an image from gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: image ? t.green : t.textMuted, width: '100%' }]}
            onPress={uploadPhoto}
            disabled={!image}
          >
            <Text style={styles.submitText}>Upload Photo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
