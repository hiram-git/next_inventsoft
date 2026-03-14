import { store } from '@/lib/store';
import { revalidatePath } from 'next/cache';
import DeleteButton from '@/components/DeleteButton';

async function handleRol(formData: FormData) {
  'use server';
  const action = formData.get('_action')?.toString();
  if (action === 'create') {
    await store.createRol({
      nombre:      formData.get('nombre')?.toString() ?? '',
      descripcion: formData.get('descripcion')?.toString() ?? '',
      permisos:    [],
    });
  } else if (action === 'delete') {
    await store.deleteRol(formData.get('id')?.toString() ?? '');
  }
  revalidatePath('/configuracion/roles');
}

export default async function RolesPage() {
  const roles = await store.getRoles();

  return (
    <div>
      <div className="page-header"><h1>Roles del Sistema</h1></div>

      <div className="card" style={{ marginBottom: 16 }}>
        <table>
          <thead>
            <tr><th>Nombre</th><th>Descripción</th><th>Permisos</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {roles.map(r => (
              <tr key={r.id}>
                <td><strong>{r.nombre}</strong></td>
                <td>{r.descripcion || '—'}</td>
                <td>{(r.permisos ?? []).length} permisos</td>
                <td>
                  <DeleteButton action={handleRol} id={r.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Nuevo Rol</h2>
        <form action={handleRol} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 12, alignItems: 'end' }}>
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
  );
}
