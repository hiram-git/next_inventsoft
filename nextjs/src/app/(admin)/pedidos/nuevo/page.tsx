import { store } from '@/lib/store';
import { redirect } from 'next/navigation';
import DocumentForm from '@/components/DocumentForm';

async function createPedido(formData: FormData) {
  'use server';
  const clienteId = formData.get('clienteId')?.toString() ?? '';
  const almacenId = formData.get('almacenId')?.toString() ?? '';
  const [cliente, almacen] = await Promise.all([store.getCliente(clienteId), store.getAlmacen(almacenId)]);
  if (!cliente || !almacen) return;

  const items = JSON.parse(formData.get('items_json')?.toString() ?? '[]');
  if (items.length === 0) return;

  const subtotal = items.reduce((s: number, i: { subtotal: number }) => s + i.subtotal, 0);
  const iva = subtotal * 0.16;

  await store.createPedido({
    clienteId, clienteNombre: cliente.nombre,
    almacenId, almacenNombre: almacen.nombre,
    items, subtotal, iva, total: subtotal + iva,
    notas: formData.get('notas')?.toString() ?? '',
    fecha: new Date().toISOString().split('T')[0],
  });

  redirect('/pedidos');
}

export default async function NuevoPedidoPage() {
  const [clientes, almacenes, allProductos] = await Promise.all([
    store.getClientes(), store.getAlmacenes(), store.getProductos(),
  ]);

  const catalogItems = allProductos.filter(p => p.activo).map(p => ({
    tipo: 'producto', id: String(p.id), nombre: p.nombre, precio: p.precio, stock: p.stock ?? 0,
  }));

  return (
    <div>
      <div className="page-header">
        <h1>Nuevo Pedido</h1>
        <a href="/pedidos" className="btn btn-secondary">
          <span className="material-icons-round">arrow_back</span> Volver
        </a>
      </div>

      <DocumentForm
        action={createPedido as unknown as string}
        catalogItems={catalogItems}
        cancelHref="/pedidos"
        submitLabel="Crear Pedido"
        mode="pedido"
      >
        <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Datos del Pedido</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>Cliente *</label>
            <select name="clienteId" className="form-control" required>
              <option value="">Seleccionar cliente…</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Almacén de origen *</label>
            <select name="almacenId" className="form-control" required>
              <option value="">Seleccionar almacén…</option>
              {almacenes.filter(a => a.activo).map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Notas</label>
          <textarea name="notas" className="form-control" rows={2} placeholder="Notas adicionales…" />
        </div>
        <div className="alert" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-icons-round" style={{ fontSize: 16 }}>info</span>
          Al confirmar el pedido, el stock se reservará en el almacén seleccionado.
        </div>
      </DocumentForm>
    </div>
  );
}
