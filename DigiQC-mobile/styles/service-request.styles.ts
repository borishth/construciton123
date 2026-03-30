import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  body: { padding: 24 },
  iconBadge: {
    width: 72, height: 72, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  pageTitle: { fontSize: 26, fontWeight: '800', marginBottom: 8 },
  pageSubtitle: { fontSize: 14, marginBottom: 32, lineHeight: 20 },
  label: {
    fontSize: 10, fontWeight: '800',
    letterSpacing: 1.5, marginBottom: 8, marginLeft: 4,
  },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, paddingHorizontal: 16, height: 56,
    marginBottom: 20, borderWidth: 1,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15 },
  priorityRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  priorityChip: {
    flex: 1, height: 44, borderRadius: 12,
    borderWidth: 1.5, justifyContent: 'center', alignItems: 'center',
  },
  priorityText: { fontSize: 13, fontWeight: '700' },
  submitBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    borderRadius: 16, height: 56, marginTop: 12, gap: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 6,
  },
  submitBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
