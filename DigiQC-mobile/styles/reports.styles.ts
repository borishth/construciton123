import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800' },
  scroll: { padding: 20, paddingBottom: 40 },
  sectionLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 16 },
  card: { borderRadius: 18, padding: 16, marginBottom: 14, borderLeftWidth: 4 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardInfo: { flex: 1, marginRight: 10 },
  reportSite: { fontSize: 14, fontWeight: '800', marginBottom: 4 },
  reportId: { fontSize: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '800' },
  cardMeta: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12 },
  serviceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#ba1a1a', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8, marginTop: 12, alignSelf: 'flex-start',
  },
  serviceBtnText: { fontSize: 12, fontWeight: '800', color: '#fff' },
});
