import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { styles } from '@/styles/login.styles';
import { API_BASE_URL } from '../../config/api.config';

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('inspector');


  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSignUp = async () => {
    if (!email || !password || !username || !role) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username,
          role,
          is_active: true
        }),
      });

      const contentType = response.headers.get("content-type");
      let data = null;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (response.ok) {
        Alert.alert("Success", "Account created successfully! You can now log in.", [
          { text: "OK", onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) }
        ]);
      } else {
        let errorMessage = "Could not create account at this time.";
        if (typeof data?.detail === 'string') {
          errorMessage = data.detail;
        } else if (Array.isArray(data?.detail)) {
          errorMessage = data.detail.map((err: any) => err.msg).join('\n');
        }
        Alert.alert("Sign Up Failed", errorMessage);
      }
    } catch (error) {
      console.error("Sign Up Error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.blobContainer}>
        <View style={styles.blob1} />
        <View style={styles.blob2} />
        <View style={styles.blob3} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        <View style={styles.mainContent}>

          <View style={[styles.header, { marginBottom: 20 }]}>
            <Text style={styles.title}>
              Construct<Text style={{ color: '#f04313' }}>Hub</Text>
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Create Account</Text>
              <Text style={styles.cardSubtitle}>Register to access field directives.</Text>
            </View>

            {/* Username Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>USERNAME</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="person" size={18} color="rgba(114, 119, 133, 0.6)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="johndoe"
                  placeholderTextColor="rgba(114, 119, 133, 0.4)"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={18} color="rgba(114, 119, 133, 0.6)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="name@company.com"
                  placeholderTextColor="rgba(114, 119, 133, 0.4)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={18} color="rgba(114, 119, 133, 0.6)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(114, 119, 133, 0.4)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={18}
                    color="rgba(114, 119, 133, 0.6)"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Role Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ACCOUNT TYPE</Text>
              <View style={{ flexDirection: 'row', marginTop: 4 }}>
                <TouchableOpacity
                  style={[
                    { flex: 1, paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center', backgroundColor: '#ffffff', marginRight: 6 },
                    role === 'inspector' && { backgroundColor: '#005bbf', borderColor: '#005bbf' }
                  ]}
                  onPress={() => setRole('inspector')}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="fact-check" size={20} color={role === 'inspector' ? '#ffffff' : '#727785'} style={{ marginBottom: 6 }} />
                  <Text style={[
                    { fontSize: 13, fontWeight: '600', color: '#4b5563' },
                    role === 'inspector' && { color: '#ffffff' }
                  ]}>
                    Inspector
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    { flex: 1, paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center', backgroundColor: '#ffffff', marginLeft: 6 },
                    role === 'client' && { backgroundColor: '#005bbf', borderColor: '#005bbf' }
                  ]}
                  onPress={() => setRole('client')}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="business-center" size={20} color={role === 'client' ? '#ffffff' : '#727785'} style={{ marginBottom: 6 }} />
                  <Text style={[
                    { fontSize: 13, fontWeight: '600', color: '#4b5563' },
                    role === 'client' && { color: '#ffffff' }
                  ]}>
                    Client
                  </Text>
                </TouchableOpacity>
              </View>
            </View>



            <TouchableOpacity
              style={[styles.primaryButton, loading && { opacity: 0.7 }]}
              onPress={handleSignUp}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.primaryButtonText}>Processing...</Text>
              ) : (
                <Text style={styles.primaryButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.outlineButton, { marginTop: 16 }]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.outlineButtonText}>Back to Sign In</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
