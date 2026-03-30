import { StyleSheet, Dimensions } from 'react-native';

const { width: SW } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 120 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  topBarLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarRing: {
    width: 55, height: 55, borderRadius: 18,
    borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  avatar: { width: 48, height: 48, borderRadius: 14, overflow: 'hidden' },
  roleText: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  brandText: { fontSize: 22, fontWeight: '800', marginTop: 1 },
  notifBtn: {
    width: 44, height: 44, borderRadius: 14, borderWidth: 1,
    justifyContent: 'center', alignItems: 'center',
  },
  notifDot: {
    position: 'absolute', top: 10, right: 12,
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: '#ef4444', borderWidth: 1.5,
  },
  heroCard: {
    borderRadius: 24, padding: 24, borderWidth: 1,
    marginBottom: 24, overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute', top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
  },
  heroGreeting: { fontSize: 26, fontWeight: '800', marginBottom: 6 },
  heroSubtext: { fontSize: 14, lineHeight: 22, marginBottom: 20, fontWeight: '500' },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, paddingHorizontal: 14, height: 48, gap: 10, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 13, fontWeight: '500' },
  searchDivider: { width: 1, height: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  statCard: {
    width: (SW - 52) / 2, borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1,
  },
  statIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  statValue: { fontSize: 28, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  overviewCard: { borderRadius: 20, padding: 20, borderWidth: 1, marginBottom: 16 },
  overviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  overviewIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  overviewTitle: { fontSize: 15, fontWeight: '700' },
  overviewSub: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  overviewDivider: { height: 1, marginVertical: 16 },
  overviewRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  overviewStat: { alignItems: 'center' },
  overviewStatValue: { fontSize: 22, fontWeight: '800' },
  overviewStatLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },
  overviewStatDivider: { width: 1, height: 30 },
  aboutCard: { flexDirection: 'row', gap: 12, borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 16 },
  aboutText: { flex: 1, fontSize: 12, lineHeight: 20, fontWeight: '500' },
});
