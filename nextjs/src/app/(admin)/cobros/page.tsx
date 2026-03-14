import Link from 'next/link';
import { store } from '@/lib/store';

export default async function CobrosPage() {
  const cobros = await store.getCobros();

  const metodoPagoLabel: Record<string, string> = {
    efectivo: 'Efectivo', transferencia: 'Transferencia', cheque: 'Cheque', tarjeta: 'Tarjeta',
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Cobros</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>Historial de pagos recibidos</p>
        </div>
        <Link href="/cobros/nuevo" className="btn btn-primary">
          <span className="material-icons-round">add</span> Registrar Cobro
        </Link>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Número</th><th>Fecha</th><th>Cliente</th><th>Factura</th>
              <th>Método</th><th>Referencia</th><th>Monto</th><th>Estado</th><th></th>
            </tr>
          </thead>
          <tbody>
            {cobros.map(c => (
              <tr key={c.id}>
                <td><strong>{c.numero}</strong></td>
                <td>{c.fecha}</td>
                <td>{c.clienteNombre}</td>
                <td>
                  <Link href={`/facturas/${c.facturaId}`} style={{ color: 'var(--primary)' }}>{c.facturaNumero}</Link>
                </td>
                <td>{metodoPagoLabel[c.metodoPago] ?? c.metodoPago}</td>
                <td style={{ color: 'var(--text-muted)' }}>{c.referencia || '—'}</td>
                <td><strong>${c.monto.toFixed(2)}</strong></td>
                <td>
                  <span className={`badge ${c.estado === 'aplicado' ? 'badge-success' : 'badge-danger'}`}>
                    {c.estado === 'aplicado' ? 'Aplicado' : 'Anulado'}
                  </span>
                </td>
                <td>
                  <Link href={`/cobros/${c.id}`} className="btn btn-secondary btn-sm">Ver</Link>
                </td>
              </tr>
            ))}
            {cobros.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay cobros.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
