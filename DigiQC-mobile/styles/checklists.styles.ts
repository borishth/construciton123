import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '800', textAlign: 'center' },
  headerSub: { fontSize: 12, textAlign: 'center', marginTop: 2 },
  scroll: { padding: 20, paddingBottom: 40 },
  typeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
    marginBottom: 20, alignSelf: 'flex-start',
  },
  typeText: { fontSize: 13, fontWeight: '700' },
  card: {
    borderRadius: 20, padding: 16, marginBottom: 14, borderWidth: 1,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  itemIcon: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  itemLabel: { fontSize: 14, fontWeight: '700', flexShrink: 1 },
  buttons: { flexDirection: 'row', gap: 8 },
  statusBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
    borderWidth: 1.5,
  },
  passActive: { backgroundColor: '#006d3a', borderColor: '#006d3a' },
  failActive: { backgroundColor: '#ba1a1a', borderColor: '#ba1a1a' },
  btnLabel: { fontSize: 12, fontWeight: '700' },
  commentInput: {
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 13, height: 40, borderWidth: 1,
  },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, paddingHorizontal: 12, height: 44,
    borderWidth: 1, borderColor: '#f1f3f4',
  },
  inputIcon: { marginRight: 8 },
  submitBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    borderRadius: 16, height: 56, marginTop: 12, gap: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 6,
  },
  submitBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
