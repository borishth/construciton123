import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#ffffff',
  },
  scrollContainer: { flexGrow: 1 },
  blobContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '40%', zIndex: 0, overflow: 'hidden',
  },
  blob1: {
    position: 'absolute', width: 320, height: 320,
    backgroundColor: '#8ec1f8', borderRadius: 160, top: -80, left: -60,
  },
  blob2: {
    position: 'absolute', width: 240, height: 240,
    backgroundColor: '#bda698', borderRadius: 120, top: -100, right: -20, opacity: 0.9,
  },
  blob3: {
    position: 'absolute', width: 200, height: 200,
    backgroundColor: '#f9c19d', borderRadius: 100, top: -40, right: -40,
  },
  mainContent: {
    flex: 1, zIndex: 10, paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40,
    alignItems: 'center', justifyContent: 'center',
  },
  header: { alignItems: 'center', marginBottom: 40 },
  iconContainer: {
    width: 80, height: 80, backgroundColor: '#005bbf', borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    shadowColor: '#005bbf', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2, shadowRadius: 15, elevation: 8,
  },
  title: { fontSize: 36, fontWeight: '800', color: '#191c1d', marginBottom: 4, letterSpacing: -0.5 },
  subtitle: { fontSize: 12, fontWeight: '700', color: '#525f73', letterSpacing: 2.4 },
  card: {
    width: '100%', backgroundColor: '#ffffff', borderRadius: 40, padding: 32,
    shadowColor: '#000', shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.08, shadowRadius: 48,
    elevation: 5, borderWidth: 1, borderColor: 'rgba(193, 198, 214, 0.05)',
  },
  cardHeader: { marginBottom: 32 },
  cardTitle: { fontSize: 24, fontWeight: '700', color: '#191c1d', marginBottom: 8 },
  cardSubtitle: { fontSize: 14, color: '#414754' },
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 10, fontWeight: '700', color: '#525f73',
    letterSpacing: 1.5, marginBottom: 8, marginLeft: 4,
  },
  phoneInputRow: { flexDirection: 'row', gap: 8 },
  countryCodeContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f3f4f5', borderRadius: 16, paddingHorizontal: 12, height: 56, width: 96,
  },
  countryCodeInput: { flex: 1, height: '100%', fontSize: 14, color: '#191c1d', marginLeft: 4 },
  phoneNumberContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f3f4f5', borderRadius: 16, paddingHorizontal: 16, height: 56,
  },
  inputIcon: { marginRight: 8 },
  phoneInput: { flex: 1, height: '100%', fontSize: 16, color: '#191c1d' },
  primaryButton: {
    backgroundColor: '#005bbf', borderRadius: 16, height: 56,
    alignItems: 'center', justifyContent: 'center', marginTop: 16,
    shadowColor: '#005bbf', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2, shadowRadius: 15, elevation: 6,
  },
  primaryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  divider: {
    height: 1, backgroundColor: 'rgba(193, 198, 214, 0.1)', marginTop: 32, marginBottom: 24,
  },
  guestButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 8, paddingHorizontal: 16, gap: 8,
  },
  guestButtonText: { color: '#525f73', fontSize: 14, fontWeight: '600' },
  footer: { marginTop: 48, alignItems: 'center' },
  footerText: {
    textAlign: 'center', fontSize: 10, color: '#525f73',
    fontWeight: '500', lineHeight: 18, letterSpacing: 0.5,
  },
  footerLinks: { flexDirection: 'row', marginTop: 16, gap: 24 },
  footerLinkText: { fontSize: 10, fontWeight: '700', color: 'rgba(114, 119, 133, 0.6)', letterSpacing: 1.5 },
});
