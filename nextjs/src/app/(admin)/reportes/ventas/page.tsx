import { store } from '@/lib/store';
import Link from 'next/link';

export default async function ReporteVentasPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; anio?: string }>;
}) {
  const now  = new Date();
  const { mes: mesParam, anio: anioParam } = await searchParams;
  const mes  = parseInt(mesParam ?? String(now.getMonth() + 1));
  const anio = parseInt(anioParam ?? String(now.getFullYear()));

  const reporte = await store.getReporteVentas(mes, anio);

  const mesNombre = new Date(anio, mes - 1, 1).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Reporte de Ventas</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
            {mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1)}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/api/pdf/reporte?mes=${mes}&anio=${anio}`} target="_blank" className="btn btn-secondary">
            <span className="material-icons-round">picture_as_pdf</span> Exportar PDF
          </Link>
        </div>
      </div>

      {/* Filtro de período */}
      <div className="card" style={{ marginBottom: 16, padding: 16 }}>
        <form method="GET" style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Mes</label>
            <select name="mes" className="form-control" defaultValue={mes}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>
                  {new Date(2024, m - 1, 1).toLocaleDateString('es-MX', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Año</label>
            <input type="number" name="anio" className="form-control" defaultValue={anio} min="2020" max="2030" style={{ width: 100 }} />
          </div>
          <button type="submit" className="btn btn-primary">
            <span className="material-icons-round" style={{ fontSize: 16 }}>search</span> Ver Reporte
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Facturado', val: `$${(reporte?.totalFacturado ?? 0).toFixed(2)}`, icon: 'receipt', color: '#2563eb', bg: '#dbeafe' },
          { label: 'Total Cobrado',   val: `$${(reporte?.totalCobrado ?? 0).toFixed(2)}`,   icon: 'payments', color: '#16a34a', bg: '#dcfce7' },
          { label: 'Facturas',        val: reporte?.totalFacturas ?? 0,                     icon: 'description', color: '#7c3aed', bg: '#ede9fe' },
          { label: 'Clientes únicos', val: reporte?.clientesUnicos ?? 0,                    icon: 'people',      color: '#d97706', bg: '#fef3c7' },
        ].map(stat => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
              <span className="material-icons-round">{stat.icon}</span>
            </div>
            <div className="stat-info"><h3>{stat.val}</h3><p>{stat.label}</p></div>
          </div>
        ))}
      </div>

      {/* Detalle por factura */}
      <div className="card">
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Facturas del Período</h2>
        <table>
          <thead>
            <tr><th>Número</th><th>Fecha</th><th>Cliente</th><th>Items</th><th>Total</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {(reporte?.facturas ?? []).map((f: { id: string | number; numero: string; fecha: string; clienteNombre: string; items: unknown[]; total: number; estado: string }) => (
              <tr key={f.id}>
                <td><Link href={`/facturas/${f.id}`} style={{ color: 'var(--primary)' }}>{f.numero}</Link></td>
                <td>{f.fecha}</td>
                <td>{f.clienteNombre}</td>
                <td>{f.items.length}</td>
                <td><strong>${f.total.toFixed(2)}</strong></td>
                <td>
                  <span className={`badge ${
                    f.estado === 'pagada' ? 'badge-success' :
                    f.estado === 'cancelada' ? 'badge-danger' : 'badge-warning'
                  }`}>{f.estado}</span>
                </td>
              </tr>
            ))}
            {!(reporte?.facturas?.length) && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                Sin facturas en este período.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
      <style>{`.badge-warning{background:#fef3c7;color:#b45309}`}</style>
    </div>
  );
}
