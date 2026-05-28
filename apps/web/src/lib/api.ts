export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function fetchApi<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export type ApiInfo = {
  name: string;
  version: string;
  description: string;
};

export type HealthStatus = {
  status: 'ok' | 'degraded';
  timestamp: string;
  services: {
    database: 'up' | 'down';
  };
};

export function getApiInfo() {
  return fetchApi<ApiInfo>('');
}

export function getHealthStatus() {
  return fetchApi<HealthStatus>('/health');
}
