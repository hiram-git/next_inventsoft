import Link from 'next/link';
import { store } from '@/lib/store';
import { notFound } from 'next/navigation';

export default async function NotaCreditoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const nota = await store.getNotaCredito(id);
  if (!nota) notFound();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Nota de Crédito {nota.numero}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>Fecha: {nota.fecha}</p>
        </div>
        <Link href="/notas-credito" className="btn btn-secondary">
          <span className="material-icons-round">arrow_back</span> Volver
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Datos</h2>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px' }}>
            <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cliente:</dt>
            <dd><strong>{nota.clienteNombre}</strong></dd>
            <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Factura original:</dt>
            <dd><Link href={`/facturas/${nota.facturaId}`} style={{ color: 'var(--primary)' }}>{nota.facturaNumero}</Link></dd>
            {nota.motivo && (
              <>
                <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Motivo:</dt>
                <dd>{nota.motivo}</dd>
              </>
            )}
          </dl>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 4 }}>Total nota de crédito</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>${nota.total.toFixed(2)}</h2>
        </div>
      </div>

      {nota.items && nota.items.length > 0 && (
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Líneas</h2>
          <table>
            <thead><tr><th>Descripción</th><th>Cantidad</th><th>Subtotal</th></tr></thead>
            <tbody>
              {nota.items.map((item: { nombre: string; cantidad: number; subtotal?: number }, i: number) => (
                <tr key={i}>
                  <td>{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td>${item.subtotal?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
