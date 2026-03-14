import Link from 'next/link';
import { store } from '@/lib/store';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function deleteProducto(formData: FormData) {
  'use server';
  await store.deleteProducto(formData.get('id')?.toString() ?? '');
  revalidatePath('/productos');
}

export default async function ProductosPage() {
  const productos = await store.getProductos();

  return (
    <div>
      <div className="page-header">
        <h1>Productos</h1>
        <Link href="/productos/nuevo" className="btn btn-primary">
          <span className="material-icons-round">add</span> Nuevo Producto
        </Link>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Código</th><th>Nombre</th><th>Marca</th><th>Grupo</th>
              <th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td>{p.codigo || '—'}</td>
                <td><strong>{p.nombre}</strong></td>
                <td>{p.marca || '—'}</td>
                <td>{p.grupo || '—'}</td>
                <td>${p.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                <td>
                  <span className={`badge ${p.stock < 1 ? 'badge-danger' : p.stock < 15 ? 'badge-warning' : 'badge-success'}`}>
                    {p.stock}
                  </span>
                </td>
                <td>
                  <span className={`badge ${p.activo ? 'badge-success' : 'badge-secondary'}`}>
                    {p.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Link href={`/productos/${p.id}/editar`} className="btn btn-primary btn-sm">
                      <span className="material-icons-round" style={{ fontSize: 16 }}>edit</span>
                    </Link>
                    <form action={deleteProducto}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="btn btn-danger btn-sm"
                        onClick={(e) => { if (!confirm('¿Eliminar?')) e.preventDefault(); }}>
                        <span className="material-icons-round" style={{ fontSize: 16 }}>delete</span>
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay productos.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <style>{`.badge-secondary{background:var(--bg);color:var(--text-muted)}.badge-warning{background:#fef3c7;color:#b45309}`}</style>
    </div>
  );
}
