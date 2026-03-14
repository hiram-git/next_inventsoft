import { requireAuth } from '@/lib/auth';
import AdminSidebar from '@/components/AdminLayout';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server Layout Guard — reemplaza el middleware de auth de Astro
  const user = await requireAuth();

  return <AdminSidebar user={user}>{children}</AdminSidebar>;
}
