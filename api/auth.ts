import { API_ORIGIN } from './config';
import type { User } from './users';

export async function loginUser(username: string, password: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(`${API_ORIGIN}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
      signal: controller.signal,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Login failed");
    }

    return data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Is the server running?");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchCurrentUser() {
  try {
    const response = await fetch(`${API_ORIGIN}/api/v1/auth/me`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as User;
  } catch {
    return null;
  }
}

export async function logoutUser() {
  await fetch(`${API_ORIGIN}/api/v1/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}
