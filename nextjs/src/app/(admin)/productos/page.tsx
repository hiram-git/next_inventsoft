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
              <th>Código</th><th>Nombre</th><th>Tipo</th><th>Marca</th><th>Grupo</th>
              <th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td>{p.codigo || '—'}</td>
                <td><strong>{p.nombre}</strong></td>
                <td>
                  {p.tipoProducto === 'kit' && (
                    <span className="badge" style={{ background: '#f5f3ff', color: '#7c3aed', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <span className="material-icons-round" style={{ fontSize: 12 }}>inventory_2</span> Kit
                    </span>
                  )}
                  {p.tipoProducto === 'compuesto' && (
                    <span className="badge" style={{ background: '#ecfeff', color: '#0891b2', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <span className="material-icons-round" style={{ fontSize: 12 }}>blender</span> Compuesto
                    </span>
                  )}
                  {(!p.tipoProducto || p.tipoProducto === 'simple') && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Simple</span>
                  )}
                </td>
                <td>{p.marca || '—'}</td>
                <td>{p.grupo || '—'}</td>
                <td>${p.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                <td>
                  {p.tipoProducto === 'kit' || p.tipoProducto === 'compuesto'
                    ? <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                    : <span className={`badge ${p.stock < 1 ? 'badge-danger' : p.stock < 15 ? 'badge-warning' : 'badge-success'}`}>{p.stock}</span>
                  }
                </td>
                <td>
                  <span className={`badge ${p.activo ? 'badge-success' : 'badge-secondary'}`}>
                    {p.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {(p.tipoProducto === 'kit' || p.tipoProducto === 'compuesto') && (
                      <Link href={`/productos/${p.id}/componentes`} className="btn btn-secondary btn-sm"
                        title={p.tipoProducto === 'kit' ? 'Productos del kit' : 'Ingredientes'}>
                        <span className="material-icons-round" style={{ fontSize: 16 }}>
                          {p.tipoProducto === 'kit' ? 'inventory_2' : 'blender'}
                        </span>
                      </Link>
                    )}
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
