import { store } from '@/lib/store';
import { revalidatePath } from 'next/cache';

async function handlePermiso(formData: FormData) {
  'use server';
  const action = formData.get('_action')?.toString();
  if (action === 'create') {
    await store.createPermiso({
      clave:   formData.get('clave')?.toString() ?? '',
      nombre:  formData.get('nombre')?.toString() ?? '',
      modulo:  formData.get('modulo')?.toString() ?? '',
    });
  } else if (action === 'delete') {
    await store.deletePermiso(formData.get('id')?.toString() ?? '');
  }
  revalidatePath('/configuracion/permisos');
}

export default async function PermisosPage() {
  const permisos = await store.getPermisos();

  // Agrupar por módulo
  const byModulo = permisos.reduce((acc: Record<string, typeof permisos>, p) => {
    if (!acc[p.modulo]) acc[p.modulo] = [];
    acc[p.modulo].push(p);
    return acc;
  }, {});

  return (
    <div>
      <div className="page-header"><h1>Permisos del Sistema</h1></div>

      {Object.entries(byModulo).map(([modulo, items]) => (
        <div key={modulo} className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, textTransform: 'capitalize' }}>{modulo}</h2>
          <table>
            <thead><tr><th>Clave</th><th>Nombre</th><th></th></tr></thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id}>
                  <td><code style={{ background: 'var(--bg)', padding: '2px 6px', borderRadius: 4, fontSize: '0.8rem' }}>{p.clave}</code></td>
                  <td>{p.nombre}</td>
                  <td>
                    <form action={handlePermiso} style={{ display: 'inline' }}>
                      <input type="hidden" name="_action" value="delete" />
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="btn btn-danger btn-sm"
                        onClick={(e) => { if (!confirm('¿Eliminar?')) e.preventDefault(); }}>
                        <span className="material-icons-round" style={{ fontSize: 16 }}>delete</span>
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {permisos.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
          No hay permisos definidos.
        </div>
      )}

      <div className="card">
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Nuevo Permiso</h2>
        <form action={handlePermiso} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
          <input type="hidden" name="_action" value="create" />
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Clave *</label>
            <input type="text" name="clave" className="form-control" required placeholder="modulo.accion" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Nombre *</label>
            <input type="text" name="nombre" className="form-control" required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Módulo *</label>
            <input type="text" name="modulo" className="form-control" required />
          </div>
          <button type="submit" className="btn btn-primary">
            <span className="material-icons-round" style={{ fontSize: 18 }}>add</span> Crear
          </button>
        </form>
      </div>
    </div>
  );
}
