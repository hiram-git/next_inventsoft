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
      unidad: formData.get('unidad')?.toString() ?? '',
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
  const esKit = producto.tipoProducto === 'kit';
  const esCompuesto = producto.tipoProducto === 'compuesto';

  // Para kit: calcular suma de precios de componentes
  const sumaComponentes = esKit
    ? componentes.reduce((acc, c) => {
        const prod = todosProductos.find(p => p.id === c.componenteId);
        return acc + (prod ? parseFloat(String(prod.precio)) * parseFloat(String(c.cantidad)) : 0);
      }, 0)
    : 0;
  const precioKit = parseFloat(String(producto.precio));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>
            {esKit ? 'Componentes del Kit' : 'Receta del Compuesto'}: {producto.nombre}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
            {esKit
              ? 'Define los productos que componen este kit. El precio del kit puede diferir de la suma individual.'
              : 'Define los ingredientes que se descuentan del inventario al vender este producto.'}
          </p>
        </div>
        <a href={`/productos/${id}/editar`} className="btn btn-secondary">
          <span className="material-icons-round">arrow_back</span> Volver a Producto
        </a>
      </div>

      {/* Resumen de precios — solo para kits */}
      {esKit && (
        <div className="card" style={{ marginBottom: 16, background: 'var(--bg-hover, #f0f4ff)', border: '1px solid var(--primary, #6366f1)20' }}>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Suma de componentes</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>${sumaComponentes.toFixed(2)}</div>
            </div>
            <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>→</div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Precio del kit (venta)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary, #6366f1)' }}>${precioKit.toFixed(2)}</div>
            </div>
            {sumaComponentes > 0 && (
              <>
                <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>·</div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Ahorro cliente</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: sumaComponentes > precioKit ? '#16a34a' : '#dc2626' }}>
                    {sumaComponentes > precioKit ? '-' : '+'}${Math.abs(sumaComponentes - precioKit).toFixed(2)}
                  </div>
                </div>
              </>
            )}
            <a href={`/productos/${id}/editar`} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
              <span className="material-icons-round" style={{ fontSize: 16 }}>edit</span> Cambiar precio kit
            </a>
          </div>
        </div>
      )}

      {/* Tabla de componentes */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>
          {esKit ? 'Productos del kit' : 'Ingredientes'}
        </h2>
        {componentes.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>
            {esKit ? 'Sin productos asignados al kit.' : 'Sin ingredientes asignados.'}
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{esKit ? 'Producto' : 'Ingrediente'}</th>
                <th>Cantidad</th>
                {!esKit && <th>Unidad</th>}
                {esKit && <th>Precio unit.</th>}
                {esKit && <th>Subtotal</th>}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {componentes.map(c => {
                const prod = todosProductos.find(p => p.id === c.componenteId);
                const precioUnit = prod ? parseFloat(String(prod.precio)) : 0;
                const subtotal = precioUnit * parseFloat(String(c.cantidad));
                return (
                  <tr key={c.id}>
                    <td>{c.componenteNombre}</td>
                    <td>{c.cantidad}</td>
                    {!esKit && <td style={{ color: 'var(--text-muted)' }}>{c.unidad || '—'}</td>}
                    {esKit && <td>${precioUnit.toFixed(2)}</td>}
                    {esKit && <td style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</td>}
                    <td>
                      <form action={handleComponente} style={{ display: 'inline' }}>
                        <input type="hidden" name="_action" value="remove" />
                        <input type="hidden" name="productoId" value={id} />
                        <input type="hidden" name="componenteRelId" value={c.id} />
                        <button type="submit" className="btn btn-danger btn-sm"
                          onClick={(e) => { if (!confirm('¿Eliminar?')) e.preventDefault(); }}>
                          <span className="material-icons-round" style={{ fontSize: 16 }}>delete</span>
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Formulario para agregar */}
      <div className="card">
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>
          {esKit ? 'Agregar producto al kit' : 'Agregar ingrediente'}
        </h2>
        <form action={handleComponente}
          style={{
            display: 'grid',
            gridTemplateColumns: esKit ? '2fr 1fr auto' : '2fr 1fr 1fr auto',
            gap: 12,
            alignItems: 'end',
          }}>
          <input type="hidden" name="_action" value="add" />
          <input type="hidden" name="productoId" value={id} />
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>{esKit ? 'Producto' : 'Ingrediente'}</label>
            <select name="componenteId" className="form-control" required>
              <option value="">Seleccionar…</option>
              {disponibles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre}{esKit ? ` — $${parseFloat(String(p.precio)).toFixed(2)}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Cantidad</label>
            <input type="number" name="cantidad" className="form-control" step="0.001" min="0.001" defaultValue="1" />
          </div>
          {esCompuesto && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Unidad</label>
              <input type="text" name="unidad" className="form-control" placeholder="kg, g, ml, unid…" />
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            <span className="material-icons-round" style={{ fontSize: 18 }}>add</span> Agregar
          </button>
        </form>

        {esKit && (
          <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Los precios mostrados son los precios individuales de cada producto. El precio de venta del kit se define en el producto.
          </p>
        )}
        {esCompuesto && (
          <p style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Al facturar este producto se descontará del inventario la cantidad indicada de cada ingrediente.
          </p>
        )}
      </div>
    </div>
  );
}
