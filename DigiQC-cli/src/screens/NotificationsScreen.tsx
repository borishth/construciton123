import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export default function NotificationsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 56, left: 20 }}>
        <MaterialIcons name="arrow-back" size={24} color="#191c1d" />
      </TouchableOpacity>
      <Text style={styles.text}>Notifications Page</Text>
      <Text style={styles.subtext}>This is a working placeholder!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#191c1d' },
  subtext: { fontSize: 14, color: '#525f73', marginTop: 8 }
});
