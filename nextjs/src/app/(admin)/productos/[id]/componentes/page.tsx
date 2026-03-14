import { store } from '@/lib/store';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';

async function handleComponente(formData: FormData) {
  'use server';
  const action = formData.get('_action')?.toString();
  const productoId = formData.get('productoId')?.toString() ?? '';
  if (action === 'add') {
    await store.addComponenteProducto(productoId, {
      componenteId: formData.get('componenteId')?.toString() ?? '',
      cantidad: parseFloat(formData.get('cantidad')?.toString() ?? '1'),
    });
  } else if (action === 'remove') {
    await store.removeComponenteProducto(formData.get('componenteRelId')?.toString() ?? '');
  }
  revalidatePath(`/productos/${productoId}/componentes`);
}

export default async function ComponentesProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [producto, componentes, todosProductos] = await Promise.all([
    store.getProducto(id),
    store.getComponentesProducto(id),
    store.getProductos(),
  ]);
  if (!producto) notFound();

  const disponibles = todosProductos.filter(p => p.activo && p.id !== parseInt(id));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Componentes de {producto.nombre}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
            Tipo: {producto.tipoProducto}
          </p>
        </div>
        <a href={`/productos/${id}/editar`} className="btn btn-secondary">
          <span className="material-icons-round">arrow_back</span> Volver a Producto
        </a>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Componentes actuales</h2>
        {componentes.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Sin componentes asignados.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Componente</th><th>Cantidad</th><th></th></tr>
            </thead>
            <tbody>
              {componentes.map(c => (
                <tr key={c.id}>
                  <td>{c.componenteNombre}</td>
                  <td>{c.cantidad}</td>
                  <td>
                    <form action={handleComponente} style={{ display: 'inline' }}>
                      <input type="hidden" name="_action" value="remove" />
                      <input type="hidden" name="productoId" value={id} />
                      <input type="hidden" name="componenteRelId" value={c.id} />
                      <button type="submit" className="btn btn-danger btn-sm"
                        onClick={(e) => { if (!confirm('¿Eliminar componente?')) e.preventDefault(); }}>
                        <span className="material-icons-round" style={{ fontSize: 16 }}>delete</span>
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Agregar Componente</h2>
        <form action={handleComponente} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 12, alignItems: 'end' }}>
          <input type="hidden" name="_action" value="add" />
          <input type="hidden" name="productoId" value={id} />
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Componente</label>
            <select name="componenteId" className="form-control" required>
              <option value="">Seleccionar…</option>
              {disponibles.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Cantidad</label>
            <input type="number" name="cantidad" className="form-control" step="0.01" min="0.01" defaultValue="1" />
          </div>
          <button type="submit" className="btn btn-primary">
            <span className="material-icons-round" style={{ fontSize: 18 }}>add</span> Agregar
          </button>
        </form>
      </div>
    </div>
  );
}
