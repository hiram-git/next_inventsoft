import Link from 'next/link';
import { store } from '@/lib/store';
import { revalidatePath } from 'next/cache';

async function handleCotizacion(formData: FormData) {
  'use server';
  const action = formData.get('_action')?.toString();
  if (action === 'update_estado') {
    await store.updateCotizacion(formData.get('id')?.toString() ?? '', {
      estado: formData.get('estado')?.toString() as 'borrador' | 'enviada' | 'aceptada' | 'rechazada' | 'vencida' | 'convertida',
    });
    revalidatePath('/cotizaciones');
  }
}

export default async function CotizacionesPage() {
  const cotizaciones = await store.getCotizaciones();
  const today = new Date().toISOString().split('T')[0];

  const estadoMeta: Record<string, { label: string; cls: string }> = {
    borrador:   { label: 'Borrador',   cls: 'badge-secondary' },
    enviada:    { label: 'Enviada',    cls: 'badge-info' },
    aceptada:   { label: 'Aceptada',   cls: 'badge-success' },
    rechazada:  { label: 'Rechazada',  cls: 'badge-danger' },
    vencida:    { label: 'Vencida',    cls: 'badge-danger' },
    convertida: { label: 'Convertida', cls: 'badge-purple' },
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Cotizaciones</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>Presupuestos sin afectar inventario</p>
        </div>
        <Link href="/cotizaciones/nueva" className="btn btn-primary">
          <span className="material-icons-round">add</span> Nueva Cotización
        </Link>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Número</th><th>Fecha</th><th>Cliente</th><th>Vencimiento</th>
              <th>Total</th><th>Estado</th><th>Factura</th><th></th>
            </tr>
          </thead>
          <tbody>
            {cotizaciones.map(c => {
              const vencida = c.fechaVencimiento && c.fechaVencimiento < today && c.estado !== 'convertida' && c.estado !== 'rechazada';
              const meta = estadoMeta[c.estado] ?? { label: c.estado, cls: 'badge-secondary' };
              return (
                <tr key={c.id} style={{ background: vencida ? '#fff8f8' : undefined }}>
                  <td><strong>{c.numero}</strong></td>
                  <td>{c.fecha}</td>
                  <td>{c.clienteNombre}</td>
                  <td>
                    {c.fechaVencimiento
                      ? <span style={{ color: vencida ? 'var(--danger)' : undefined }}>{c.fechaVencimiento}</span>
                      : '—'}
                  </td>
                  <td><strong>${c.total.toFixed(2)}</strong></td>
                  <td><span className={`badge ${meta.cls}`}>{meta.label}</span></td>
                  <td>
                    {c.facturaNumero
                      ? <Link href={`/facturas/${c.facturaId}`} style={{ color: 'var(--primary)' }}>{c.facturaNumero}</Link>
                      : '—'}
                  </td>
                  <td>
                    <Link href={`/cotizaciones/${c.id}`} className="btn btn-primary btn-sm">
                      <span className="material-icons-round" style={{ fontSize: 16 }}>visibility</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
            {cotizaciones.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay cotizaciones.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <style>{`
        .badge-secondary{background:var(--bg);color:var(--text-muted)}
        .badge-info{background:#dbeafe;color:#2563eb}
        .badge-purple{background:#f3e8ff;color:#7c3aed}
      `}</style>
    </div>
  );
}
