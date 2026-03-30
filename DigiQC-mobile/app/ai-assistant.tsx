import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const BASE_URL = 'http://10.150.8.179:8000/api/v1';

export default function AIAssistantScreen() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAskAI = async () => {
    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await fetch(`${BASE_URL}/ai/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      setAnswer(data.answer || 'No answer returned from server.');
    } catch (err: any) {
      setError(err.message || 'Something went wrong while fetching the answer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F7F9FB" />
      <View style={styles.wrapper}>
        <View style={styles.topBar}>
          <View style={styles.topBarInner}>
            <View style={styles.brandRow}>
              <View style={styles.logoBox}>
                <MaterialIcons name="bubble-chart" size={22} color="#FFFFFF" />
              </View>

              <View>
                <Text style={styles.brandTitle}>Digital Concierge</Text>
                <View style={styles.onlineRow}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>Assistant Online</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.moreButton}>
              <MaterialIcons name="more-vert" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>
          <View style={styles.topDivider} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>How can I assist you today?</Text>
            <Text style={styles.heroSubtitle}>
              Our Digital Concierge is ready to manage your schedules, provide
              insights, or handle complex requests.
            </Text>
          </View>

          {!answer && !loading && !error && (
            <View style={styles.botMessageRow}>
              <View style={styles.botAvatar}>
                <MaterialIcons name="smart-toy" size={18} color="#04162E" />
              </View>

              <View style={styles.botBubbleWrap}>
                <View style={styles.botBubble}>
                  <Text style={styles.botBubbleText}>
                    Ask anything from your DigiQC knowledge base. I can help you
                    with inspections, reports, checklist guidance, and technical
                    questions.
                  </Text>
                </View>
                <Text style={styles.timestamp}>READY</Text>
              </View>
            </View>
          )}

          {!!loading && (
            <View style={styles.botMessageRow}>
              <View style={styles.botAvatar}>
                <MaterialIcons name="smart-toy" size={18} color="#04162E" />
              </View>

              <View style={styles.typingBubble}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          )}

          {!!error && (
            <View style={styles.messageRightWrap}>
              <View style={styles.errorCard}>
                <View style={styles.errorHeader}>
                  <MaterialIcons name="warning" size={18} color="#B91C1C" />
                  <Text style={styles.errorTitle}>Error</Text>
                </View>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            </View>
          )}

          {!!answer && !loading && (
            <>
              <View style={styles.messageRightWrap}>
                <View style={styles.userBubble}>
                  <Text style={styles.userBubbleText}>{question}</Text>
                </View>
                <Text style={styles.timestamp}>YOUR QUESTION</Text>
              </View>

              <View style={styles.botMessageRowLarge}>
                <View style={styles.botAvatar}>
                  <MaterialIcons name="smart-toy" size={18} color="#04162E" />
                </View>

                <View style={styles.answerSection}>
                  <View style={styles.answerCard}>
                    <Text style={styles.answerLabel}>Answer</Text>
                    <Text style={styles.answerText}>{answer}</Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.bottomOverlay} />

        <View style={styles.inputOuter}>
          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="add" size={22} color="#48626E" />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Type a message or command..."
              value={question}
              onChangeText={setQuestion}
              multiline
              placeholderTextColor="#75777E"
            />

            <TouchableOpacity
              style={[styles.sendButton, loading && styles.sendButtonDisabled]}
              onPress={handleAskAI}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.sendButtonText}>Send</Text>
                  <MaterialIcons name="send" size={16} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F7F9FB',
  },

  topBar: {
    paddingTop: 52,
    backgroundColor: 'rgba(247,249,251,0.96)',
  },
  topBarInner: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#1A2B44',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 99,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  onlineText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 170,
  },

  heroSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#04162E',
    textAlign: 'center',
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#48626E',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },

  botMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 18,
    maxWidth: '88%',
  },
  botMessageRowLarge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 18,
    maxWidth: '95%',
  },
  botAvatar: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#E6E8EA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  botBubbleWrap: {
    flex: 1,
  },
  botBubble: {
    backgroundColor: '#E6E8EA',
    borderRadius: 18,
    borderBottomLeftRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  botBubbleText: {
    fontSize: 15,
    lineHeight: 23,
    color: '#191C1E',
  },

  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6E8EA',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: '#AFCBD8',
  },

  timestamp: {
    marginTop: 6,
    marginHorizontal: 6,
    fontSize: 10,
    fontWeight: '700',
    color: '#75777E',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  messageRightWrap: {
    alignItems: 'flex-end',
    marginTop: 18,
  },
  userBubble: {
    maxWidth: '88%',
    backgroundColor: '#04162E',
    borderRadius: 18,
    borderBottomRightRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#04162E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 5,
  },
  userBubbleText: {
    fontSize: 15,
    lineHeight: 23,
    color: '#FFFFFF',
  },

  answerSection: {
    flex: 1,
  },
  answerCard: {
    backgroundColor: '#E6E8EA',
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    padding: 18,
  },

  answerLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#04162E',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  answerText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#334155',
  },

  errorCard: {
    width: '88%',
    backgroundColor: '#FFF1F2',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorTitle: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '800',
    color: '#B91C1C',
  },
  errorText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#991B1B',
  },

  bottomOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
    backgroundColor: 'transparent',
  },

  inputOuter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    paddingHorizontal: 16,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 999,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    maxHeight: 110,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    color: '#191C1E',
  },
  sendButton: {
    height: 42,
    borderRadius: 999,
    backgroundColor: '#04162E',
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});