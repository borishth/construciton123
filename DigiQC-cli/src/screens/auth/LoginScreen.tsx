import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { styles } from '@/styles/login.styles';

export default function LoginScreen() {
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSendCode = () => {
    console.log("Mock verification sent, redirecting to home...", { countryCode, phoneNumber });
    if (!phoneNumber) {
      alert("Please enter a phone number.");
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Background Blobs */}
      <View style={styles.blobContainer}>
        <View style={styles.blob1} />
        <View style={styles.blob2} />
        <View style={styles.blob3} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        <View style={styles.mainContent}>
          {/* Brand Identity */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: 'transparent', overflow: 'hidden', borderRadius: 20 }]}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              />
            </View>
            <Text style={styles.title}>
              Digi<Text style={{ color: '#f04313' }}>QC</Text>
            </Text>
            <Text style={[styles.subtitle, { color: '#f04313' }]}>PRECISION INSPECTION MANAGEMENT</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Welcome Back</Text>
              <Text style={styles.cardSubtitle}>Access your field directives and site reports.</Text>
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PHONE NUMBER</Text>
              <View style={styles.phoneInputRow}>
                <View style={styles.countryCodeContainer}>
                  <MaterialIcons name="public" size={18} color="rgba(114, 119, 133, 0.6)" style={styles.inputIcon} />
                  <TextInput style={styles.countryCodeInput} value={countryCode} onChangeText={setCountryCode} keyboardType="phone-pad" />
                </View>
                <View style={styles.phoneNumberContainer}>
                  <MaterialIcons name="phone" size={18} color="rgba(114, 119, 133, 0.6)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.phoneInput} placeholder="(555) 000-0000"
                    placeholderTextColor="rgba(114, 119, 133, 0.4)" value={phoneNumber}
                    onChangeText={setPhoneNumber} keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleSendCode} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>Send Verification Code</Text>
            </TouchableOpacity>

            <View style={styles.divider} />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2024 DigiQC Systems.{'\n'}Trusted by 10,000+ Site Architects globally.
            </Text>
            <View style={styles.footerLinks}>
              <TouchableOpacity><Text style={styles.footerLinkText}>PRIVACY POLICY</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.footerLinkText}>TERMS OF SERVICE</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
