import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute', bottom: 12, left: 12, right: 12,
    height: 72, borderRadius: 28, borderTopWidth: 0, borderWidth: 1,
    elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.2, shadowRadius: 24, paddingBottom: 0, paddingTop: 0,
  },
  tabItem: { paddingTop: 8, paddingBottom: 6 },
  tabLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5, marginTop: 2 },
  tabIconWrap: {
    width: 36, height: 36, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  fab: {
    position: 'absolute', right: 20, bottom: 96,
    width: 52, height: 52, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    elevation: 12, shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 16, borderWidth: 1,
  },
  fabLabel: {
    position: 'absolute', right: 32, bottom: 86,
    fontSize: 9, fontWeight: '800', letterSpacing: 1,
  },
});
