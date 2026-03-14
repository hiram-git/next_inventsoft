import { store } from '@/lib/store';
import { redirect } from 'next/navigation';
import DocumentForm from '@/components/DocumentForm';

async function createCompra(formData: FormData) {
  'use server';
  const almacenId       = formData.get('almacenId')?.toString() ?? '';
  const proveedorNombre = formData.get('proveedorNombre')?.toString() ?? '';
  const almacen         = await store.getAlmacen(almacenId);
  if (!almacen || !proveedorNombre) return;

  const items = JSON.parse(formData.get('items_json')?.toString() ?? '[]');
  if (items.length === 0) return;

  const subtotal = items.reduce((s: number, i: { subtotal: number }) => s + i.subtotal, 0);
  const iva = subtotal * 0.16;

  await store.createCompra({
    proveedorNombre,
    almacenId, almacenNombre: almacen.nombre,
    items, subtotal, iva, total: subtotal + iva,
    fecha: new Date().toISOString().split('T')[0],
  });

  redirect('/compras');
}

export default async function NuevaCompraPage() {
  const [almacenes, allProductos] = await Promise.all([
    store.getAlmacenes(), store.getProductos(),
  ]);

  const catalogItems = allProductos.filter(p => p.activo).map(p => ({
    tipo: 'producto', id: String(p.id), nombre: p.nombre, precio: p.precio,
  }));

  return (
    <div>
      <div className="page-header">
        <h1>Nueva Compra</h1>
        <a href="/compras" className="btn btn-secondary">
          <span className="material-icons-round">arrow_back</span> Volver
        </a>
      </div>

      <DocumentForm
        action={createCompra as unknown as string}
        catalogItems={catalogItems}
        cancelHref="/compras"
        submitLabel="Guardar Compra"
        mode="compra"
      >
        <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Datos de la Compra</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label>Proveedor *</label>
            <input type="text" name="proveedorNombre" className="form-control" required placeholder="Nombre del proveedor" />
          </div>
          <div className="form-group">
            <label>Almacén de destino *</label>
            <select name="almacenId" className="form-control" required>
              <option value="">Seleccionar almacén…</option>
              {almacenes.filter(a => a.activo).map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          </div>
        </div>
      </DocumentForm>
    </div>
  );
}
