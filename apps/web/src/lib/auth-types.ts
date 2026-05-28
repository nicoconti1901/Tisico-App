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

export const ROLE_LABELS: Record<Role, string> = {
  OPERATOR: 'Operador',
  SUPERVISOR: 'Supervisor',
  ADMIN: 'Administrador',
};
