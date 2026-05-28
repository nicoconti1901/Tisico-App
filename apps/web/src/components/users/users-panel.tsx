'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type Role, type User } from '@/lib/auth-types';
import { useState } from 'react';
import { CreateUserForm } from './create-user-form';

type UsersPanelProps = {
  initialUsers: User[];
};

export function UsersPanel({ initialUsers }: UsersPanelProps) {
  const [users, setUsers] = useState(initialUsers);

  function handleCreated(user: User) {
    setUsers((current) => [user, ...current]);
  }

  async function toggleActive(user: User) {
    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !user.active }),
    });

    if (!response.ok) return;

    const updated = (await response.json()) as User;
    setUsers((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    );
  }

  async function changeRole(user: User, role: Role) {
    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) return;

    const updated = (await response.json()) as User;
    setUsers((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
        <p className="mt-1 text-muted-foreground">
          Gestión de cuentas y roles del sistema
        </p>
      </section>

      <CreateUserForm onCreated={handleCreated} />

      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
          <CardDescription>{users.length} usuario(s) registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Nombre</th>
                  <th className="pb-3 pr-4 font-medium">Email</th>
                  <th className="pb-3 pr-4 font-medium">Rol</th>
                  <th className="pb-3 pr-4 font-medium">Estado</th>
                  <th className="pb-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{user.name}</td>
                    <td className="py-3 pr-4">{user.email}</td>
                    <td className="py-3 pr-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          changeRole(user, e.target.value as Role)
                        }
                        className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                      >
                        <option value="OPERATOR">Operador</option>
                        <option value="SUPERVISOR">Supervisor</option>
                        <option value="ADMIN">Administrador</option>
                      </select>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={user.active ? 'success' : 'secondary'}>
                        {user.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(user)}
                      >
                        {user.active ? 'Desactivar' : 'Activar'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
