import Link from 'next/link';
import { store } from '@/lib/store';

export default async function CuentasPorCobrarPage() {
  const cxc = await store.getCuentasPorCobrar();

  const totalPendiente = cxc.reduce((sum, f) => sum + f.saldo, 0);
  const totalVencido = cxc.filter(f => f.diasVencido > 0).reduce((sum, f) => sum + f.saldo, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Cuentas por Cobrar</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>Facturas pendientes de cobro</p>
        </div>
        <Link href="/cobros/nuevo" className="btn btn-primary">
          <span className="material-icons-round">payments</span> Registrar Cobro
        </Link>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
            <span className="material-icons-round">account_balance_wallet</span>
          </div>
          <div className="stat-info">
            <h3>${totalPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h3>
            <p>Total por cobrar</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <span className="material-icons-round">warning</span>
          </div>
          <div className="stat-info">
            <h3>${totalVencido.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h3>
            <p>Monto vencido</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
            <span className="material-icons-round">pending_actions</span>
          </div>
          <div className="stat-info">
            <h3>{cxc.length}</h3>
            <p>Facturas pendientes</p>
          </div>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Factura</th><th>Fecha</th><th>Vencimiento</th><th>Cliente</th>
              <th>Total</th><th>Cobrado</th><th>Saldo</th><th>Días Vencido</th><th></th>
            </tr>
          </thead>
          <tbody>
            {cxc.map(f => (
              <tr key={f.id} style={{ background: f.diasVencido > 0 ? '#fff8f8' : undefined }}>
                <td><strong>{f.numero}</strong></td>
                <td>{f.fecha}</td>
                <td style={{ color: f.diasVencido > 0 ? 'var(--danger)' : undefined }}>{f.fechaVencimiento || '—'}</td>
                <td>{f.clienteNombre}</td>
                <td>${f.total.toFixed(2)}</td>
                <td style={{ color: 'var(--success)' }}>${f.cobrado.toFixed(2)}</td>
                <td><strong>${f.saldo.toFixed(2)}</strong></td>
                <td>
                  {f.diasVencido > 0
                    ? <span className="badge badge-danger">{f.diasVencido}d</span>
                    : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Link href={`/facturas/${f.id}`} className="btn btn-primary btn-sm" title="Ver factura">
                      <span className="material-icons-round" style={{ fontSize: 16 }}>receipt</span>
                    </Link>
                    <Link href={`/cobros/nuevo?facturaId=${f.id}`} className="btn btn-success btn-sm" title="Registrar cobro">
                      <span className="material-icons-round" style={{ fontSize: 16 }}>payments</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {cxc.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
                <span className="material-icons-round" style={{ fontSize: 48, display: 'block', marginBottom: 12, opacity: 0.3 }}>check_circle</span>
                No hay facturas pendientes de cobro.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
