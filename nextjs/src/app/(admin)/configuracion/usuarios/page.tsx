import { store } from '@/lib/store';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

async function handleUsuario(formData: FormData) {
  'use server';
  const action = formData.get('_action')?.toString();
  if (action === 'create') {
    const pass = formData.get('password')?.toString() ?? '';
    const hashed = await bcrypt.hash(pass, 10);
    await store.createUsuario({
      nombre:   formData.get('nombre')?.toString() ?? '',
      email:    formData.get('email')?.toString() ?? '',
      password: hashed,
      rol:      formData.get('rol')?.toString() ?? 'usuario',
    });
  } else if (action === 'delete') {
    await store.deleteUsuario(formData.get('id')?.toString() ?? '');
  } else if (action === 'toggle') {
    const id = formData.get('id')?.toString() ?? '';
    const activo = formData.get('activo') === 'true';
    await store.updateUsuario(id, { activo: !activo });
  }
  revalidatePath('/configuracion/usuarios');
}

export default async function UsuariosPage() {
  const [usuarios, roles] = await Promise.all([store.getUsuarios(), store.getRoles()]);

  return (
    <div>
      <div className="page-header"><h1>Usuarios del Sistema</h1></div>

      <div className="card" style={{ marginBottom: 16 }}>
        <table>
          <thead>
            <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td><strong>{u.nombre}</strong></td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
                <td>
                  <span className={`badge ${u.activo ? 'badge-success' : 'badge-secondary'}`}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <form action={handleUsuario} style={{ display: 'inline' }}>
                      <input type="hidden" name="_action" value="toggle" />
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="activo" value={String(u.activo)} />
                      <button type="submit" className={`btn btn-sm ${u.activo ? 'btn-secondary' : 'btn-success'}`}>
                        {u.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </form>
                    <form action={handleUsuario} style={{ display: 'inline' }}>
                      <input type="hidden" name="_action" value="delete" />
                      <input type="hidden" name="id" value={u.id} />
                      <button type="submit" className="btn btn-danger btn-sm"
                        onClick={(e) => { if (!confirm('¿Eliminar usuario?')) e.preventDefault(); }}>
                        <span className="material-icons-round" style={{ fontSize: 16 }}>delete</span>
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Crear Usuario</h2>
        <form action={handleUsuario}>
          <input type="hidden" name="_action" value="create" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Nombre *</label>
              <input type="text" name="nombre" className="form-control" required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Email *</label>
              <input type="email" name="email" className="form-control" required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Contraseña *</label>
              <input type="password" name="password" className="form-control" required minLength={6} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Rol</label>
              <select name="rol" className="form-control">
                {roles.map(r => <option key={r.id} value={r.nombre}>{r.nombre}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <button type="submit" className="btn btn-primary">
              <span className="material-icons-round" style={{ fontSize: 18 }}>add</span> Crear Usuario
            </button>
          </div>
        </form>
      </div>
      <style>{`.badge-secondary{background:var(--bg);color:var(--text-muted)}`}</style>
    </div>
  );
}
