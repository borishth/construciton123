import { fetchJson } from './api-client';

export type User = {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  department?: string | null;
  phone?: string | null;
  profile_photo_url?: string | null;
  is_active: boolean;
  is_superadmin: boolean;
  roles?: string[];
};

export async function fetchUsers() {
  const data = await fetchJson<User[]>('/users?limit=200', {
    credentials: 'include',
  });

  return Array.isArray(data) ? data : null;
}
