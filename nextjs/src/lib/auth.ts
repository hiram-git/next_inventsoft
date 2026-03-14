import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { store } from './store';

const SESSION_COOKIE = 'session_user_id';

export async function login(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 horas
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!userId) return null;
  const user = await store.getUsuario(userId);
  if (!user || !user.activo) return null;
  return { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol };
}

// Server Layout Guard — usado en app/(admin)/layout.tsx
export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect('/login');
  return session;
}
