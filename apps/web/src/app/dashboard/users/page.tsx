import { UsersPanel } from '@/components/users/users-panel';
import { fetchWithAuth } from '@/lib/session';
import type { User } from '@/lib/auth-types';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function UsersPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const users = await fetchWithAuth<User[]>('/users');

  return <UsersPanel initialUsers={users} />;
}
