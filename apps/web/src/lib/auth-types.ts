export const AUTH_COOKIE = 'tisico_access_token';

export type Role = 'OPERATOR' | 'SUPERVISOR' | 'ADMIN';

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

/** Etiquetas visibles en la UI — genéricas y orientadas a la empresa */
export const ROLE_LABELS: Record<Role, string> = {
  OPERATOR: 'Operaciones',
  SUPERVISOR: 'Supervisión',
  ADMIN: 'Gestión integral',
};

export const COMPANY_PLATFORM_NAME = 'Plataforma SHE';
export const COMPANY_TAGLINE = 'Seguridad · Calidad · Medio Ambiente';
