import Link from 'next/link';
import { store } from '@/lib/store';
import { revalidatePath } from 'next/cache';
import DeleteButton from '@/components/DeleteButton';

async function deleteServicio(formData: FormData) {
  'use server';
  await store.deleteServicio(formData.get('id')?.toString() ?? '');
  revalidatePath('/servicios');
}

export default async function ServiciosPage() {
  const servicios = await store.getServicios();

  return (
    <div>
      <div className="page-header">
        <h1>Servicios</h1>
        <Link href="/servicios/nuevo" className="btn btn-primary">
          <span className="material-icons-round">add</span> Nuevo Servicio
        </Link>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Código</th><th>Nombre</th><th>Marca</th><th>Grupo</th>
              <th>Precio</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map(s => (
              <tr key={s.id} style={{ cursor: 'pointer' }}>
                <td>{s.codigo || '—'}</td>
                <td><strong>{s.nombre}</strong></td>
                <td>{s.marca || '—'}</td>
                <td>{s.grupo || '—'}</td>
                <td>${s.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                <td>
                  <span className={`badge ${s.activo ? 'badge-success' : 'badge-secondary'}`}>
                    {s.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Link href={`/servicios/${s.id}/editar`} className="btn btn-primary btn-sm">
                      <span className="material-icons-round" style={{ fontSize: 16 }}>edit</span>
                    </Link>
                    <DeleteButton action={deleteServicio} id={s.id} />
                  </div>
                </td>
              </tr>
            ))}
            {servicios.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay servicios.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <style>{`.badge-secondary{background:var(--bg);color:var(--text-muted)}`}</style>
    </div>
  );
}
