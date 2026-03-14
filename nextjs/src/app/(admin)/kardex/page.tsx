import Link from 'next/link';
import { store } from '@/lib/store';

export default async function KardexPage({
  searchParams,
}: {
  searchParams: Promise<{ almacen?: string; producto?: string }>;
}) {
  const { almacen: almacenId = '', producto: productoId = '' } = await searchParams;

  const [almacenes, productos, movimientos] = await Promise.all([
    store.getAlmacenes(),
    store.getProductos(),
    store.getKardex({
      almacenId: almacenId || undefined,
      productoId: productoId || undefined,
    }),
  ]);

  const tipoBadge: Record<string, string> = {
    entrada: 'badge-success', salida: 'badge-danger',
    reserva: 'badge-warning', liberacion: 'badge-secondary',
  };

  return (
    <div>
      <div className="page-header"><h1>Kardex de Inventario</h1></div>

      <div className="card" style={{ marginBottom: 16, padding: 16 }}>
        <form method="GET" style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 180 }}>
            <label>Almacén</label>
            <select name="almacen" className="form-control">
              <option value="">Todos</option>
              {almacenes.map(a => (
                <option key={a.id} value={a.id} selected={a.id === almacenId}>{a.nombre}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: 180 }}>
            <label>Producto</label>
            <select name="producto" className="form-control">
              <option value="">Todos</option>
              {productos.map(p => (
                <option key={p.id} value={p.id} selected={p.id === productoId}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            <span className="material-icons-round" style={{ fontSize: 16 }}>search</span> Filtrar
          </button>
          {(almacenId || productoId) && (
            <Link href="/kardex" className="btn btn-secondary">
              <span className="material-icons-round" style={{ fontSize: 16 }}>clear</span> Limpiar
            </Link>
          )}
        </form>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Fecha</th><th>Almacén</th><th>Producto</th><th>Tipo</th>
              <th>Cantidad</th><th>Stock Ant.</th><th>Stock Nuevo</th>
              <th>Referencia</th><th>Notas</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map(m => (
              <tr key={m.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{m.fecha}</td>
                <td>{m.almacenNombre}</td>
                <td><strong>{m.productoNombre}</strong></td>
                <td>
                  <span className={`badge ${tipoBadge[m.tipo] ?? 'badge-secondary'}`}>{m.tipo}</span>
                </td>
                <td style={{ color: (m.tipo === 'entrada' || m.tipo === 'liberacion') ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                  {(m.tipo === 'entrada' || m.tipo === 'liberacion') ? '+' : '-'}{m.cantidad}
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{m.stockAnterior}</td>
                <td><strong>{m.stockNuevo}</strong></td>
                <td>
                  {m.referenciaNumero
                    ? <code style={{ background: 'var(--bg)', padding: '2px 6px', borderRadius: 4, fontSize: '0.8rem' }}>{m.referenciaNumero}</code>
                    : '—'}
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m.notas || '—'}</td>
              </tr>
            ))}
            {movimientos.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay movimientos.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <style>{`.badge-secondary{background:var(--bg);color:var(--text-muted)}.badge-warning{background:#fef3c7;color:#b45309}`}</style>
    </div>
  );
}
