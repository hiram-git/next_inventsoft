import { store } from '@/lib/store';
import { revalidatePath } from 'next/cache';
import DeleteButton from '@/components/DeleteButton';

async function handleAlmacen(formData: FormData) {
  'use server';
  const action = formData.get('_action')?.toString();
  if (action === 'create') {
    await store.createAlmacen({
      nombre: formData.get('nombre')?.toString() ?? '',
      descripcion: formData.get('descripcion')?.toString() ?? '',
    });
  } else if (action === 'update') {
    await store.updateAlmacen(formData.get('id')?.toString() ?? '', {
      nombre: formData.get('nombre')?.toString() ?? '',
      descripcion: formData.get('descripcion')?.toString() ?? '',
    });
  } else if (action === 'delete') {
    await store.deleteAlmacen(formData.get('id')?.toString() ?? '');
  }
  revalidatePath('/almacenes');
}

export default async function AlmacenesPage() {
  const almacenes = await store.getAlmacenes();

  return (
    <div>
      <div className="page-header"><h1>Almacenes</h1></div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nombre</th><th>Descripción</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {almacenes.map(a => (
              <tr key={a.id}>
                <td><strong>{a.nombre}</strong></td>
                <td>{a.descripcion || '—'}</td>
                <td>
                  <span className={`badge ${a.activo ? 'badge-success' : 'badge-secondary'}`}>
                    {a.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <DeleteButton action={handleAlmacen} id={a.id} />
                </td>
              </tr>
            ))}
            {almacenes.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay almacenes.</td></tr>
            )}
          </tbody>
        </table>

        <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <h3 style={{ fontSize: '0.95rem', marginBottom: 12 }}>Nuevo Almacén</h3>
          <form action={handleAlmacen} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
            <input type="hidden" name="_action" value="create" />
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Nombre *</label>
              <input type="text" name="nombre" className="form-control" required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Descripción</label>
              <input type="text" name="descripcion" className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary">
              <span className="material-icons-round" style={{ fontSize: 18 }}>add</span> Crear
            </button>
          </form>
        </div>
      </div>
      <style>{`.badge-secondary{background:var(--bg);color:var(--text-muted)}`}</style>
    </div>
  );
}
