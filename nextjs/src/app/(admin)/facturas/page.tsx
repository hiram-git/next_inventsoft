import Link from 'next/link';
import { store } from '@/lib/store';
import { revalidatePath } from 'next/cache';
import ConfirmButton from '@/components/ConfirmButton';

async function handleFactura(formData: FormData) {
  'use server';
  const action = formData.get('_action')?.toString();
  if (action === 'update_estado') {
    await store.updateFactura(formData.get('id')?.toString() ?? '', {
      estado: formData.get('estado')?.toString() as 'pendiente' | 'pagada' | 'cancelada',
    });
    revalidatePath('/facturas');
  }
}

export default async function FacturasPage() {
  const facturas = await store.getFacturas();

  return (
    <div>
      <div className="page-header">
        <h1>Facturas</h1>
        <Link href="/facturas/nueva" className="btn btn-primary">
          <span className="material-icons-round">add</span> Nueva Factura
        </Link>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Número</th><th>Fecha</th><th>Cliente</th><th>Items</th>
              <th>Total</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map(f => (
              <tr key={f.id}>
                <td><strong>{f.numero}</strong></td>
                <td>{f.fecha}</td>
                <td>{f.clienteNombre}</td>
                <td>{f.items.length} producto(s)</td>
                <td><strong>${f.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong></td>
                <td>
                  <span className={`badge ${
                    f.estado === 'pagada' ? 'badge-success' :
                    f.estado === 'cancelada' ? 'badge-danger' :
                    f.estado === 'vencida' ? 'badge-danger' : 'badge-warning'
                  }`}>{f.estado}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Link href={`/facturas/${f.id}`} className="btn btn-primary btn-sm" title="Ver">
                      <span className="material-icons-round" style={{ fontSize: 16 }}>visibility</span>
                    </Link>
                    {f.estado === 'pendiente' && (
                      <form action={handleFactura} style={{ display: 'inline' }}>
                        <input type="hidden" name="_action" value="update_estado" />
                        <input type="hidden" name="id" value={f.id} />
                        <input type="hidden" name="estado" value="pagada" />
                        <button type="submit" className="btn btn-success btn-sm" title="Marcar pagada">
                          <span className="material-icons-round" style={{ fontSize: 16 }}>check</span>
                        </button>
                      </form>
                    )}
                    {f.estado !== 'cancelada' && (
                      <form action={handleFactura} style={{ display: 'inline' }}>
                        <input type="hidden" name="_action" value="update_estado" />
                        <input type="hidden" name="id" value={f.id} />
                        <input type="hidden" name="estado" value="cancelada" />
                        <ConfirmButton mensaje="¿Cancelar esta factura?" className="btn btn-danger btn-sm" title="Cancelar">
                          <span className="material-icons-round" style={{ fontSize: 16 }}>cancel</span>
                        </ConfirmButton>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {facturas.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay facturas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <style>{`.badge-warning{background:#fef3c7;color:#b45309}`}</style>
    </div>
  );
}
