import { store } from '@/lib/store';
import Link from 'next/link';

const quickActions = [
  { href: '/facturas/nueva',         icon: 'add_circle',            label: 'Nueva Factura',         color: '#2563eb', bg: '#dbeafe' },
  { href: '/pedidos/nuevo',          icon: 'shopping_cart',         label: 'Nuevo Pedido',          color: '#16a34a', bg: '#dcfce7' },
  { href: '/clientes',               icon: 'person_add',            label: 'Nuevo Cliente',         color: '#7c3aed', bg: '#ede9fe' },
  { href: '/cobros/nuevo',           icon: 'payments',              label: 'Registrar Cobro',       color: '#0891b2', bg: '#cffafe' },
  { href: '/compras/nueva',          icon: 'local_shipping',        label: 'Nueva Compra',          color: '#d97706', bg: '#fef3c7' },
  { href: '/cuentas-por-cobrar',     icon: 'account_balance_wallet',label: 'Cuentas por Cobrar',    color: '#dc2626', bg: '#fee2e2' },
  { href: '/inventario',             icon: 'view_list',             label: 'Ver Inventario',        color: '#059669', bg: '#d1fae5' },
  { href: '/kardex',                 icon: 'swap_vert',             label: 'Kardex',                color: '#6366f1', bg: '#e0e7ff' },
  { href: '/reportes/ventas',        icon: 'bar_chart',             label: 'Reporte Ventas',        color: '#0f766e', bg: '#ccfbf1' },
  { href: '/cotizaciones/nueva',     icon: 'request_quote',         label: 'Nueva Cotización',      color: '#be185d', bg: '#fce7f3' },
];

export default async function DashboardPage() {
  const [clientes, productos, facturas, cxc] = await Promise.all([
    store.getClientes(),
    store.getProductos(),
    store.getFacturas(),
    store.getCuentasPorCobrar(),
  ]);

  const totalVentas = facturas
    .filter(f => f.estado === 'pagada')
    .reduce((sum, f) => sum + f.total, 0);

  const facturasPendientes = facturas.filter(f =>
    f.estado === 'pendiente' || f.estado === 'parcial' || f.estado === 'vencida'
  ).length;

  const facturasVencidas = facturas.filter(f => f.estado === 'vencida').length;
  const productosLowStock = productos.filter(p => p.stock < 15).length;
  const totalCxC = cxc.reduce((s, f) => s + f.saldo, 0);

  const recentFacturas = [...facturas]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <span className="date-label">
          {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {quickActions.map(action => (
          <Link
            key={action.href}
            href={action.href}
            className="quick-action"
            style={{ '--qa-color': action.color, '--qa-bg': action.bg } as React.CSSProperties}
          >
            <div className="qa-icon">
              <span className="material-icons-round">{action.icon}</span>
            </div>
            <span className="qa-label">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
            <span className="material-icons-round">people</span>
          </div>
          <div className="stat-info"><h3>{clientes.length}</h3><p>Clientes</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <span className="material-icons-round">inventory</span>
          </div>
          <div className="stat-info"><h3>{productos.length}</h3><p>Productos</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
            <span className="material-icons-round">receipt</span>
          </div>
          <div className="stat-info"><h3>{facturas.length}</h3><p>Facturas</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}>
            <span className="material-icons-round">payments</span>
          </div>
          <div className="stat-info">
            <h3>${totalVentas.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h3>
            <p>Ventas cobradas</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <span className="material-icons-round">account_balance_wallet</span>
          </div>
          <div className="stat-info">
            <h3>${totalCxC.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h3>
            <p>Cuentas por cobrar</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <span className="material-icons-round">pending_actions</span>
          </div>
          <div className="stat-info"><h3>{facturasPendientes}</h3><p>Facturas pendientes</p></div>
        </div>
      </div>

      {/* Alerts */}
      {facturasVencidas > 0 && (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>
          <span className="material-icons-round">warning</span>
          {' '}{facturasVencidas} factura(s) vencida(s).{' '}
          <Link href="/cuentas-por-cobrar" style={{ color: 'inherit', fontWeight: 600 }}>Ver cuentas por cobrar →</Link>
        </div>
      )}
      {productosLowStock > 0 && (
        <div className="alert alert-error" style={{ background: '#fefce8', borderColor: '#fde68a', color: '#92400e', marginBottom: 16 }}>
          <span className="material-icons-round">inventory_2</span>
          {' '}{productosLowStock} producto(s) con stock bajo.{' '}
          <Link href="/inventario" style={{ color: 'inherit', fontWeight: 600 }}>Ver inventario →</Link>
        </div>
      )}

      {/* Recent Invoices */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Facturas Recientes</h2>
          <Link href="/facturas" className="btn btn-secondary btn-sm">Ver todas</Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {recentFacturas.map(f => (
              <tr key={f.id}>
                <td><Link href={`/facturas/${f.id}`} style={{ color: 'var(--primary)' }}>{f.numero}</Link></td>
                <td>{f.clienteNombre}</td>
                <td>{f.fecha}</td>
                <td><strong>${f.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong></td>
                <td>
                  <span className={`badge ${
                    f.estado === 'pagada' ? 'badge-success' :
                    f.estado === 'cancelada' ? 'badge-danger' : 'badge-warning'
                  }`}>{f.estado}</span>
                </td>
              </tr>
            ))}
            {recentFacturas.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay facturas.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .date-label { font-size: 0.875rem; color: var(--text-muted); }
        .quick-actions { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; margin-bottom: 24px; }
        .quick-action { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 8px; background: white; border-radius: var(--radius); box-shadow: var(--shadow); text-decoration: none; color: var(--text); transition: transform 0.2s, box-shadow 0.2s; }
        .quick-action:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
        .qa-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: var(--qa-bg); color: var(--qa-color); font-size: 1.5rem; }
        .qa-label { font-size: 0.78rem; font-weight: 500; text-align: center; line-height: 1.3; }
        .alert { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-radius: var(--radius); border: 1px solid; }
        .badge-warning { background: #fef3c7; color: #b45309; }
      `}</style>
    </div>
  );
}
