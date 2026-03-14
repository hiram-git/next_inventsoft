'use server';

import { redirect } from 'next/navigation';
import { login } from '@/lib/auth';
import { store } from '@/lib/store';
import bcrypt from 'bcryptjs';

export async function handleLogin(formData: FormData) {
  const email    = formData.get('email')?.toString() ?? '';
  const password = formData.get('password')?.toString() ?? '';

  try {
    const user  = await store.getUsuarioByEmail(email);
    const valid = user ? await bcrypt.compare(password, user.password) : false;

    if (user && valid) {
      if (!user.activo) {
        redirect('/login?error=inactive');
      }
      await login(String(user.id));
      redirect('/dashboard');
    } else {
      redirect('/login?error=credentials');
    }
  } catch (err) {
    // redirect() throws internally, re-throw it
    throw err;
  }
}
