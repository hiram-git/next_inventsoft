import { store } from '@/lib/store';
import { redirect } from 'next/navigation';
import DocumentForm from '@/components/DocumentForm';

async function createFactura(formData: FormData) {
  'use server';
  const clienteId = formData.get('clienteId')?.toString() ?? '';
  const almacenId = formData.get('almacenId')?.toString() ?? '';
  const cliente   = await store.getCliente(clienteId);
  if (!cliente) return;

  const items = JSON.parse(formData.get('items_json')?.toString() ?? '[]');
  if (items.length === 0) return;

  const subtotal = items.reduce((s: number, i: { subtotal: number }) => s + i.subtotal, 0);
  const iva   = subtotal * 0.16;
  const total = subtotal + iva;

  let almacenNombre = '';
  if (almacenId) {
    const almacen = await store.getAlmacen(almacenId);
    almacenNombre = almacen?.nombre ?? '';
  }

  await store.createFactura({
    clienteId,
    clienteNombre: cliente.nombre,
    almacenId: almacenId || undefined,
    almacenNombre: almacenNombre || undefined,
    items,
    subtotal,
    iva,
    total,
    estado: 'pendiente',
    fecha: new Date().toISOString().split('T')[0],
    fechaVencimiento: formData.get('fechaVencimiento')?.toString() || undefined,
  });

  redirect('/facturas');
}

export default async function NuevaFacturaPage() {
  const [clientes, almacenes, allProductos, allServicios] = await Promise.all([
    store.getClientes(),
    store.getAlmacenes(),
    store.getProductos(),
    store.getServicios(),
  ]);

  const catalogItems = [
    ...allProductos.filter(p => p.activo).map(p => ({
      tipo: 'producto', id: String(p.id), nombre: p.nombre, precio: p.precio, stock: p.stock ?? 0,
    })),
    ...allServicios.filter(s => s.activo).map(s => ({
      tipo: 'servicio', id: String(s.id), nombre: s.nombre, precio: s.precio, stock: 999999,
    })),
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Nueva Factura</h1>
        <a href="/facturas" className="btn btn-secondary">
          <span className="material-icons-round">arrow_back</span> Volver
        </a>
      </div>

      <DocumentForm
        action={createFactura as unknown as string}
        catalogItems={catalogItems}
        cancelHref="/facturas"
        submitLabel="Crear Factura"
        mode="factura"
      >
        <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Datos de la Factura</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>Cliente *</label>
            <select name="clienteId" className="form-control" required>
              <option value="">Seleccionar cliente…</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Almacén (salida de inventario)</label>
            <select name="almacenId" className="form-control">
              <option value="">Sin afectar inventario</option>
              {almacenes.filter(a => a.activo).map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Fecha Vencimiento</label>
            <input type="date" name="fechaVencimiento" className="form-control" />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Para cuentas por cobrar</small>
          </div>
        </div>
      </DocumentForm>
    </div>
  );
}
