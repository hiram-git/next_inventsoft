import Link from 'next/link';
import { store } from '@/lib/store';

export default async function NotasCreditoPage() {
  const notas = await store.getNotasCredito();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Notas de Crédito</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>Cancelaciones y devoluciones</p>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Número</th><th>Fecha</th><th>Cliente</th><th>Factura Original</th>
              <th>Motivo</th><th>Total</th><th></th>
            </tr>
          </thead>
          <tbody>
            {notas.map(n => (
              <tr key={n.id}>
                <td><strong>{n.numero}</strong></td>
                <td>{n.fecha}</td>
                <td>{n.clienteNombre}</td>
                <td>
                  <Link href={`/facturas/${n.facturaId}`} style={{ color: 'var(--primary)' }}>
                    {n.facturaNumero}
                  </Link>
                </td>
                <td>{n.motivo || '—'}</td>
                <td><strong>${n.total.toFixed(2)}</strong></td>
                <td>
                  <Link href={`/notas-credito/${n.id}`} className="btn btn-primary btn-sm" title="Ver">
                    <span className="material-icons-round" style={{ fontSize: 16 }}>visibility</span>
                  </Link>
                </td>
              </tr>
            ))}
            {notas.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay notas de crédito.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
