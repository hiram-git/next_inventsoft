import { store } from '@/lib/store';
import { revalidatePath } from 'next/cache';
import DeleteButton from '@/components/DeleteButton';

async function handleVendedor(formData: FormData) {
  'use server';
  const action = formData.get('_action')?.toString();
  if (action === 'create') {
    await store.createVendedor({
      nombre: formData.get('nombre')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      telefono: formData.get('telefono')?.toString() ?? '',
    });
  } else if (action === 'update') {
    await store.updateVendedor(formData.get('id')?.toString() ?? '', {
      nombre: formData.get('nombre')?.toString() ?? '',
      email: formData.get('email')?.toString() ?? '',
      telefono: formData.get('telefono')?.toString() ?? '',
    });
  } else if (action === 'delete') {
    await store.deleteVendedor(formData.get('id')?.toString() ?? '');
  }
  revalidatePath('/vendedores');
}

export default async function VendedoresPage() {
  const vendedores = await store.getVendedores();

  return (
    <div>
      <div className="page-header">
        <h1>Vendedores</h1>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nombre</th><th>Email</th><th>Teléfono</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.map(v => (
              <tr key={v.id}>
                <td><strong>{v.nombre}</strong></td>
                <td>{v.email || '—'}</td>
                <td>{v.telefono || '—'}</td>
                <td>
                  <span className={`badge ${v.activo ? 'badge-success' : 'badge-secondary'}`}>
                    {v.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <DeleteButton action={handleVendedor} id={v.id} />
                </td>
              </tr>
            ))}
            {vendedores.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay vendedores.</td></tr>
            )}
          </tbody>
        </table>

        <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: 12 }}>Agregar Vendedor</h3>
          <form action={handleVendedor} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
            <input type="hidden" name="_action" value="create" />
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Nombre *</label>
              <input type="text" name="nombre" className="form-control" required placeholder="Nombre completo" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Email</label>
              <input type="email" name="email" className="form-control" placeholder="correo@ejemplo.com" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Teléfono</label>
              <input type="text" name="telefono" className="form-control" placeholder="+507 xxxx-xxxx" />
            </div>
            <button type="submit" className="btn btn-primary">
              <span className="material-icons-round" style={{ fontSize: 18 }}>add</span> Agregar
            </button>
          </form>
        </div>
      </div>
      <style>{`.badge-secondary{background:var(--bg);color:var(--text-muted)}`}</style>
    </div>
  );
}
