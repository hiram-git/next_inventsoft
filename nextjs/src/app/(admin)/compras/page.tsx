import Link from 'next/link';
import { store } from '@/lib/store';
import { revalidatePath } from 'next/cache';

async function handleCompra(formData: FormData) {
  'use server';
  const action = formData.get('_action')?.toString();
  const id = formData.get('id')?.toString() ?? '';
  if (action === 'recibir') {
    await store.recibirCompra(id);
  } else if (action === 'cancelar') {
    await store.cancelarCompra(id);
  }
  revalidatePath('/compras');
}

export default async function ComprasPage() {
  const compras = await store.getCompras();

  const estadoBadge: Record<string, string> = {
    borrador: 'badge-warning', recibida: 'badge-success', cancelada: 'badge-danger',
  };

  return (
    <div>
      <div className="page-header">
        <h1>Compras</h1>
        <Link href="/compras/nueva" className="btn btn-primary">
          <span className="material-icons-round">add</span> Nueva Compra
        </Link>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Número</th><th>Fecha</th><th>Proveedor</th><th>Almacén</th>
              <th>Items</th><th>Total</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {compras.map(c => (
              <tr key={c.id}>
                <td><strong>{c.numero}</strong></td>
                <td>{c.fecha}</td>
                <td>{c.proveedorNombre}</td>
                <td>{c.almacenNombre}</td>
                <td>{c.items.length} producto(s)</td>
                <td><strong>${c.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong></td>
                <td>
                  <span className={`badge ${estadoBadge[c.estado] ?? 'badge-secondary'}`}>{c.estado}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Link href={`/compras/${c.id}`} className="btn btn-primary btn-sm" title="Ver">
                      <span className="material-icons-round" style={{ fontSize: 16 }}>visibility</span>
                    </Link>
                    {c.estado === 'borrador' && (
                      <>
                        <form action={handleCompra} style={{ display: 'inline' }}>
                          <input type="hidden" name="_action" value="recibir" />
                          <input type="hidden" name="id" value={c.id} />
                          <button type="submit" className="btn btn-success btn-sm" title="Recibir"
                            onClick={(e) => { if (!confirm('¿Recibir compra? Se actualizará inventario.')) e.preventDefault(); }}>
                            <span className="material-icons-round" style={{ fontSize: 16 }}>check_circle</span>
                          </button>
                        </form>
                        <form action={handleCompra} style={{ display: 'inline' }}>
                          <input type="hidden" name="_action" value="cancelar" />
                          <input type="hidden" name="id" value={c.id} />
                          <button type="submit" className="btn btn-danger btn-sm" title="Cancelar"
                            onClick={(e) => { if (!confirm('¿Cancelar?')) e.preventDefault(); }}>
                            <span className="material-icons-round" style={{ fontSize: 16 }}>cancel</span>
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {compras.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay compras.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <style>{`.badge-warning{background:#fef3c7;color:#b45309}`}</style>
    </div>
  );
}
