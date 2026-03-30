import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
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
