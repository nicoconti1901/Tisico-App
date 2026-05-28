import { cookies } from 'next/headers';
import { AUTH_COOKIE, type User } from './auth-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value;
}

export async function getSession(): Promise<User | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!response.ok) return null;
    return (await response.json()) as User;
  } catch {
    return null;
  }
}

export async function fetchWithAuth<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('No autenticado');
  }

  const response = await fetch(`${API_URL}/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string }).message ?? `Error ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}
