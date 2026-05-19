import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from '@/context/AuthContext';
import {
  LogOut,
  ShieldCheck,
  UserRound,
  Users,
  Layers,
  Shield,
  Key,
  Settings
} from 'lucide-react-native';

export default function MenuScreen() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };
  // ADD IT RIGHT HERE:
  const menuItems = [
    { name: 'Users', icon: Users, route: '/(tabs)/users' },
    { name: 'Stages', icon: Layers, route: '/(tabs)/tree' },
    { name: 'Roles', icon: Shield, route: '/admin/roles' },
    { name: 'Permissions', icon: Key, route: '/admin/permissions' },
    { name: 'Settings', icon: Settings, route: '/settings' },
  ] as const;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>ACCOUNT</Text>
        <Text style={styles.title}>Menu</Text>
        <Text style={styles.subtitle}>Session, access, and admin shortcuts.</Text>
      </View>

      <View style={styles.panel}>
        {isLoading ? (
          <ActivityIndicator color="#38bdf8" />
        ) : (
          <>
            <View style={styles.identityRow}>
              <View style={styles.avatar}>
                <UserRound size={24} color="#f8fafc" />
              </View>

              <View style={styles.identityText}>
                <Text style={styles.name} numberOfLines={1}>
                  {user?.full_name || user?.username || 'Not signed in'}
                </Text>
                <Text style={styles.email} numberOfLines={1}>
                  {user?.email || 'No active backend session'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <ShieldCheck size={17} color="#38bdf8" />
              <Text style={styles.infoLabel}>Roles</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {user?.roles?.length ? user.roles.join(', ') : 'No roles'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account status</Text>
              <Text style={[styles.infoValue, user?.is_active && styles.activeValue]}>
                {user?.is_active ? 'Active' : 'Unknown'}
              </Text>
            </View>
          </>
        )}
      </View>



      {/* ======================================= */}
      {/* ADD THE NEW LINKS CONTAINER RIGHT HERE! */}
      {/* ======================================= */}
      <View style={styles.linksContainer}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={index}
              style={styles.linkRow}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.linkIcon}>
                <Icon size={20} color="#94a3b8" />
              </View>
              <Text style={styles.linkText}>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        activeOpacity={0.75}
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={isLoading}
      >
        <LogOut size={18} color="#fecaca" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
    paddingHorizontal: 18,
    paddingTop: 58,
  },
  header: {
    marginBottom: 24,
  },
  eyebrow: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
  },
  title: {
    color: '#f8fafc',
    fontSize: 31,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  panel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242b38',
    backgroundColor: '#171b24',
    padding: 15,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
  },
  identityText: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  email: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 3,
  },
  infoRow: {
    minHeight: 42,
    borderRadius: 8,
    backgroundColor: '#111722',
    paddingHorizontal: 10,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  infoLabel: {
    color: '#94a3b8',
    fontSize: 13,
  },
  infoValue: {
    flex: 1,
    minWidth: 0,
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
  },
  activeValue: {
    color: '#22c55e',
  },
  logoutButton: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7f1d1d',
    backgroundColor: '#2a1418',
    paddingHorizontal: 14,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#fecaca',
    fontSize: 14,
    fontWeight: '800',
  },
  linksContainer: {
    marginTop: 24,
    gap: 8, // Adds space between each link
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171b24',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242b38',
  },
  linkIcon: {
    marginRight: 12,
  },
  linkText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },

});
