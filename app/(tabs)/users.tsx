import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Crown,
  Mail,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  UserCog,
  Users,
  UserX,
} from 'lucide-react-native';

import { fetchUsers, type User } from '@/api/users';

function getInitials(user: User) {
  const source = user.full_name || user.username;
  const parts = source.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function getPrimaryRole(user: User) {
  if (user.is_superadmin) {
    return 'superadmin';
  }

  return user.roles?.[0] ?? 'user';
}

function openPlaceholder(title: string) {
  Alert.alert(title, 'This action will be connected after the read-only user overview is stable.');
}

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setError(null);

    const data = await fetchUsers();

    if (!data) {
      setUsers([]);
      setSelectedUser(null);
      setError('Could not load users. Sign in again or check that the backend is running.');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    setUsers(data);
    setSelectedUser((current) => current ?? data[0] ?? null);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      const roles = user.roles?.join(' ') ?? '';

      return [
        user.username,
        user.full_name,
        user.email,
        user.department ?? '',
        roles,
        user.is_superadmin ? 'superadmin' : '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [searchQuery, users]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((user) => user.is_active).length,
      admins: users.filter((user) => user.is_superadmin || user.roles?.includes('admin')).length,
      inactive: users.filter((user) => !user.is_active).length,
    };
  }, [users]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38bdf8" />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>ACCESS DIRECTORY</Text>
          <Text style={styles.title}>Users</Text>
          <Text style={styles.subtitle}>Manage accounts, roles, and account status.</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.addButton}
          onPress={() => openPlaceholder('Create User')}
        >
          <Plus size={22} color="#f8fafc" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Search size={18} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search name, email, role, department"
          placeholderTextColor="#64748b"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Users size={18} color="#38bdf8" />
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <CheckCircle2 size={18} color="#22c55e" />
          <Text style={styles.statValue}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Crown size={18} color="#f59e0b" />
          <Text style={styles.statValue}>{stats.admins}</Text>
          <Text style={styles.statLabel}>Admins</Text>
        </View>
        <View style={styles.statCard}>
          <UserX size={18} color="#ef4444" />
          <Text style={styles.statValue}>{stats.inactive}</Text>
          <Text style={styles.statLabel}>Inactive</Text>
        </View>
      </View>

      {selectedUser ? (
        <View style={styles.selectedPanel}>
          <View style={styles.selectedHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(selectedUser)}</Text>
            </View>

            <View style={styles.selectedIdentity}>
              <Text style={styles.panelLabel}>Selected User</Text>
              <Text style={styles.selectedName} numberOfLines={1}>
                {selectedUser.full_name}
              </Text>
              <Text style={styles.selectedUsername} numberOfLines={1}>
                @{selectedUser.username}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                selectedUser.is_active ? styles.statusBadgeActive : styles.statusBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  selectedUser.is_active ? styles.statusTextActive : styles.statusTextInactive,
                ]}
              >
                {selectedUser.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>

          <View style={styles.detailList}>
            <View style={styles.detailRow}>
              <Mail size={16} color="#64748b" />
              <Text style={styles.detailText} numberOfLines={1}>
                {selectedUser.email}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Building2 size={16} color="#64748b" />
              <Text style={styles.detailText} numberOfLines={1}>
                {selectedUser.department || 'No department'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Phone size={16} color="#64748b" />
              <Text style={styles.detailText} numberOfLines={1}>
                {selectedUser.phone || 'No phone number'}
              </Text>
            </View>
          </View>

          <View style={styles.roleRow}>
            <ShieldCheck size={16} color="#38bdf8" />
            <Text style={styles.roleLabel}>Role</Text>
            <Text style={styles.roleValue} numberOfLines={1}>
              {getPrimaryRole(selectedUser)}
            </Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.panelAction}
              onPress={() => openPlaceholder('Edit User')}
            >
              <UserCog size={16} color="#cbd5e1" />
              <Text style={styles.panelActionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.75}
              style={styles.panelAction}
              onPress={() => openPlaceholder('Assign Role')}
            >
              <ShieldCheck size={16} color="#cbd5e1" />
              <Text style={styles.panelActionText}>Role</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>User List</Text>
        {loading ? <ActivityIndicator color="#38bdf8" /> : null}
      </View>

      {error ? (
        <View style={styles.emptyPanel}>
          <Text style={styles.emptyTitle}>Users unavailable</Text>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : filteredUsers.length > 0 ? (
        <View style={styles.userList}>
          {filteredUsers.map((user) => {
            const selected = selectedUser?.user_id === user.user_id;
            const role = getPrimaryRole(user);

            return (
              <TouchableOpacity
                key={user.user_id}
                activeOpacity={0.75}
                style={[styles.userCard, selected && styles.userCardSelected]}
                onPress={() => setSelectedUser(user)}
              >
                <View style={styles.smallAvatar}>
                  <Text style={styles.smallAvatarText}>{getInitials(user)}</Text>
                </View>

                <View style={styles.userInfo}>
                  <View style={styles.userTitleRow}>
                    <Text style={styles.userName} numberOfLines={1}>
                      {user.full_name}
                    </Text>
                    {user.is_superadmin ? (
                      <View style={styles.adminBadge}>
                        <Text style={styles.adminBadgeText}>ADMIN</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.userEmail} numberOfLines={1}>
                    {user.email}
                  </Text>
                  <View style={styles.userMetaRow}>
                    <Text style={styles.userMeta} numberOfLines={1}>
                      {role}
                    </Text>
                    <View
                      style={[
                        styles.statusDot,
                        user.is_active ? styles.statusDotActive : styles.statusDotInactive,
                      ]}
                    />
                    <Text style={styles.userMeta}>{user.is_active ? 'active' : 'inactive'}</Text>
                  </View>
                </View>

                <ChevronRight size={18} color="#64748b" />
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyPanel}>
          <Text style={styles.emptyTitle}>No users found</Text>
          <Text style={styles.emptyText}>Try another name, email, role, or department.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1117',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 58,
    paddingBottom: 108,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  headerCopy: {
    flex: 1,
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
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
  },
  searchBox: {
    minHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242b38',
    backgroundColor: '#151a23',
    paddingHorizontal: 14,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: '#f8fafc',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  statCard: {
    width: '48.5%',
    minHeight: 94,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242b38',
    backgroundColor: '#171b24',
    padding: 12,
    justifyContent: 'space-between',
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 8,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  selectedPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#263244',
    backgroundColor: '#171b24',
    padding: 15,
    marginTop: 16,
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
  },
  avatarText: {
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: '900',
  },
  selectedIdentity: {
    flex: 1,
    minWidth: 0,
  },
  panelLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  selectedName: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  selectedUsername: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    minHeight: 29,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 9,
    justifyContent: 'center',
  },
  statusBadgeActive: {
    borderColor: '#22c55e66',
  },
  statusBadgeInactive: {
    borderColor: '#ef444466',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  statusTextActive: {
    color: '#22c55e',
  },
  statusTextInactive: {
    color: '#ef4444',
  },
  detailList: {
    gap: 10,
    marginTop: 16,
  },
  detailRow: {
    minHeight: 34,
    borderRadius: 8,
    backgroundColor: '#111722',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  detailText: {
    flex: 1,
    minWidth: 0,
    color: '#cbd5e1',
    fontSize: 13,
  },
  roleRow: {
    minHeight: 42,
    borderRadius: 8,
    backgroundColor: '#111722',
    paddingHorizontal: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  roleLabel: {
    color: '#94a3b8',
    fontSize: 13,
  },
  roleValue: {
    flex: 1,
    minWidth: 0,
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  panelAction: {
    flex: 1,
    minHeight: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242b38',
    backgroundColor: '#151a23',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  panelActionText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionHeader: {
    minHeight: 32,
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  userList: {
    gap: 10,
  },
  userCard: {
    minHeight: 78,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242b38',
    backgroundColor: '#171b24',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#182237',
  },
  smallAvatar: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    marginRight: 12,
  },
  smallAvatarText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '900',
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    flexShrink: 1,
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '800',
  },
  userEmail: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  userMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 6,
  },
  userMeta: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotActive: {
    backgroundColor: '#22c55e',
  },
  statusDotInactive: {
    backgroundColor: '#ef4444',
  },
  adminBadge: {
    borderRadius: 6,
    backgroundColor: '#f59e0b22',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  adminBadgeText: {
    color: '#fbbf24',
    fontSize: 10,
    fontWeight: '900',
  },
  emptyPanel: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242b38',
    backgroundColor: '#171b24',
    padding: 16,
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 5,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 19,
  },
});
