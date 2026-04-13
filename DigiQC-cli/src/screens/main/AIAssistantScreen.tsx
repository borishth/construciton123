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
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function AIAssistantScreen() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState("Hey Borish! 👋\nWhat's up—what are we working on today?");
  const [loading, setLoading] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = {
    outerBg: isDark ? '#2a2a2a' : '#ffffff',
    appBg: isDark ? '#111111' : '#ffffff',
    primaryText: isDark ? '#ffffff' : '#111827',
    secondaryText: isDark ? '#aaaaaa' : '#6b7280',
    userBubble: isDark ? 'rgba(47,47,47,0.92)' : '#dbeafe',
    botCard: isDark ? 'transparent' : 'transparent',
    inputBar: isDark ? 'rgba(47,47,47,0.92)' : '#ffffff',
    inputText: isDark ? '#ffffff' : '#111111',
    inputPlaceholder: isDark ? '#999999' : '#9ca3af',
    border: isDark ? 'rgba(255,255,255,0.05)' : '#dbe2ea',
    whiteButtonBg: isDark ? '#ffffff' : '#111827',
    whiteButtonText: isDark ? '#000000' : '#ffffff',
    ring: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,24,39,0.08)',
    glow: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(59,130,246,0.08)',
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setAnswer('Loading...');

      const res = await fetch('http://10.150.9.107:8000/api/v1/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to get answer');
      }

      setAnswer(data.answer);
    } catch (error: any) {
      console.log('AI error:', error);
      setAnswer(error?.message || 'Something went wrong while fetching the answer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.outerBg }]}
      edges={['top', 'left', 'right']}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.outerBg }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.appContainer, { backgroundColor: theme.appBg }]}>
          <View style={[styles.ambientGlow, { backgroundColor: theme.glow }]} />
          <View
            style={[
              styles.ringSmall,
              {
                borderColor: theme.ring,
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.55)',
              },
            ]}
          />
          <View
            style={[
              styles.ringMain,
              {
                borderColor: theme.ring,
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.4)',
              },
            ]}
          />

          <View style={styles.chatWrapper}>
            <ScrollView
              style={styles.chatHistory}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {query.trim().length > 0 && (
                <View style={[styles.userMessage, { backgroundColor: theme.userBubble, borderColor: theme.border }]}>
                  <Text style={[styles.userMessageText, { color: theme.primaryText }]}>
                    {query}
                  </Text>
                </View>
              )}

              <View style={styles.botMessage}>
                <View style={styles.botTextWrapper}>
                  {loading ? (
                    <View style={styles.loadingRow}>
                      <ActivityIndicator size="small" color={theme.primaryText} />
                      <Text style={[styles.botText, { color: theme.primaryText, marginLeft: 8 }]}>
                        Loading...
                      </Text>
                    </View>
                  ) : (
                    <Text style={[styles.botText, { color: theme.primaryText }]}>
                      {answer}
                    </Text>
                  )}
                </View>

                <View style={styles.botActions}>
                  <TouchableOpacity style={styles.actionIcon}>
                    <Text style={[styles.actionIconText, { color: theme.secondaryText }]}>⧉</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={[styles.inputContainer, { backgroundColor: theme.appBg }]}>
              <View style={[styles.inputBar, { backgroundColor: theme.inputBar, borderColor: theme.border }]}>
                <TouchableOpacity style={styles.iconButton}>
                  <Text style={[styles.iconButtonText, { color: theme.primaryText }]}>＋</Text>
                </TouchableOpacity>

                <TextInput
                  style={[styles.input, { color: theme.inputText }]}
                  placeholder="Reply to ChatGPT"
                  placeholderTextColor={theme.inputPlaceholder}
                  value={query}
                  onChangeText={setQuery}
                  multiline
                />

                <TouchableOpacity style={styles.micButton}>
                  <Text style={[styles.micButtonText, { color: theme.secondaryText }]}>🎤</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.voiceButton, { backgroundColor: theme.whiteButtonBg }]}
                  onPress={handleSubmit}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={theme.whiteButtonText} />
                  ) : (
                    <MaterialIcons name="arrow-upward" size={20} color={theme.whiteButtonText} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    top: '28%',
    left: '50%',
    marginLeft: -175,
    zIndex: 0,
  },
  ringSmall: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    top: 150,
    right: 40,
    zIndex: 1,
  },
  ringMain: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1.5,
    top: 180,
    left: -20,
    zIndex: 1,
  },
  chatWrapper: {
    flex: 1,
    zIndex: 2,
  },
  chatHistory: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  userMessage: {
    alignSelf: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    borderWidth: 1,
    maxWidth: '82%',
    marginBottom: 24,
  },
  userMessageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  botMessage: {
    alignSelf: 'flex-start',
    maxWidth: '92%',
  },
  botTextWrapper: {
    marginBottom: 12,
  },
  botText: {
    fontSize: 16,
    lineHeight: 24,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  actionIcon: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginRight: 8,
  },
  actionIconText: {
    fontSize: 16,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 130 : 110,
  },
  inputBar: {
    minHeight: 62,
    borderRadius: 30,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 16,
    paddingRight: 10,
    paddingVertical: 8,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
    marginRight: 10,
  },
  iconButtonText: {
    fontSize: 22,
    fontWeight: '400',
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 120,
    paddingTop: 8,
    paddingBottom: 8,
  },
  micButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
    marginLeft: 10,
    marginRight: 10,
  },
  micButtonText: {
    fontSize: 18,
  },
  voiceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  voiceButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
});