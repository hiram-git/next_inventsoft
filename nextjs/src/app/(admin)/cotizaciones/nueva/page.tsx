import { store } from '@/lib/store';
import { redirect } from 'next/navigation';
import DocumentForm from '@/components/DocumentForm';

async function createCotizacion(formData: FormData) {
  'use server';
  const clienteId = formData.get('clienteId')?.toString() ?? '';
  const cliente   = await store.getCliente(clienteId);
  if (!cliente) return;

  const items = JSON.parse(formData.get('items_json')?.toString() ?? '[]');
  if (items.length === 0) return;

  const subtotal = items.reduce((s: number, i: { subtotal: number }) => s + i.subtotal, 0);
  const iva = subtotal * 0.16;

  const cot = await store.createCotizacion({
    clienteId,
    clienteNombre: cliente.nombre,
    items,
    subtotal,
    iva,
    total: subtotal + iva,
    notas: formData.get('notas')?.toString() ?? '',
    fechaVencimiento: formData.get('fechaVencimiento')?.toString() || undefined,
    fecha: new Date().toISOString().split('T')[0],
  });

  redirect(`/cotizaciones/${cot.id}`);
}

export default async function NuevaCotizacionPage() {
  const [clientes, allProductos, allServicios] = await Promise.all([
    store.getClientes(), store.getProductos(), store.getServicios(),
  ]);

  const catalogItems = [
    ...allProductos.filter(p => p.activo).map(p => ({ tipo: 'producto', id: String(p.id), nombre: p.nombre, precio: p.precio })),
    ...allServicios.filter(s => s.activo).map(s => ({ tipo: 'servicio', id: String(s.id), nombre: s.nombre, precio: s.precio })),
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Nueva Cotización</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>No afecta inventario</p>
        </div>
        <a href="/cotizaciones" className="btn btn-secondary">
          <span className="material-icons-round">arrow_back</span> Volver
        </a>
      </div>

      <DocumentForm
        action={createCotizacion as unknown as string}
        catalogItems={catalogItems}
        cancelHref="/cotizaciones"
        submitLabel="Crear Cotización"
        mode="cotizacion"
      >
        <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Datos de la Cotización</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>Cliente *</label>
            <select name="clienteId" className="form-control" required>
              <option value="">Seleccionar cliente…</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Válida hasta</label>
            <input type="date" name="fechaVencimiento" className="form-control" />
          </div>
          <div className="form-group">
            <label>Notas / Condiciones</label>
            <input type="text" name="notas" className="form-control" placeholder="Condiciones de pago, entrega…" />
          </div>
        </div>
      </DocumentForm>
    </div>
  );
}
