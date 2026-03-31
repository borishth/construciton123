import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AIAssistant() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('Your AI answer will appear here...');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      // later connect your backend here
      // const res = await fetch("http://YOUR_IP:8000/api/v1/ai/query", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ query }),
      // });
      // const data = await res.json();
      // setAnswer(data.answer);

      setTimeout(() => {
        setAnswer(`You asked: ${query}`);
        setLoading(false);
      }, 800);
    } catch (error) {
      setLoading(false);
      setAnswer('Something went wrong while fetching the answer.');
      console.log('AI error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>AI Assistant</Text>
          <Text style={styles.subtitle}>
            Ask anything related to your DigiQC project.
          </Text>

          <View style={styles.answerCard}>
            <Text style={styles.answerLabel}>Answer</Text>
            <Text style={styles.answerText}>
              {loading ? 'Loading...' : answer}
            </Text>
          </View>
        </ScrollView>

        <View style={styles.bottomBox}>
          <TextInput
            style={styles.input}
            placeholder="Enter your query..."
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
            multiline
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>
              {loading ? 'Submitting...' : 'Submit Query'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 180, // important so content stays above bottom input area
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
  },
  answerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    minHeight: 180,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#222',
  },
  answerText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  bottomBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 70,
    backgroundColor: '#f7f8fa',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28, // extra space above tab bar
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111',
    minHeight: 90,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});