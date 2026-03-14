import Link from 'next/link';
import { store } from '@/lib/store';

export default async function InventarioPage({
  searchParams,
}: {
  searchParams: Promise<{ almacen?: string }>;
}) {
  const { almacen: almacenId } = await searchParams;
  const [almacenes, inventario] = await Promise.all([
    store.getAlmacenes(),
    store.getInventario(almacenId),
  ]);

  const grouped = new Map<string, { almacenNombre: string; items: typeof inventario }>();
  for (const item of inventario) {
    if (!grouped.has(item.almacenId)) {
      grouped.set(item.almacenId, { almacenNombre: item.almacenNombre, items: [] });
    }
    grouped.get(item.almacenId)!.items.push(item);
  }

  return (
    <div>
      <div className="page-header">
        <h1>Inventario</h1>
      </div>

      <div className="card" style={{ marginBottom: 16, padding: 16 }}>
        <form method="GET" style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Filtrar por Almacén</label>
            <select name="almacen" className="form-control">
              <option value="">Todos los almacenes</option>
              {almacenes.map(a => (
                <option key={a.id} value={a.id} selected={a.id === almacenId}>{a.nombre}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            <span className="material-icons-round" style={{ fontSize: 16 }}>search</span> Filtrar
          </button>
          {almacenId && (
            <Link href="/inventario" className="btn btn-secondary">
              <span className="material-icons-round" style={{ fontSize: 16 }}>clear</span> Limpiar
            </Link>
          )}
        </form>
      </div>

      {[...grouped.entries()].map(([almId, data]) => (
        <div key={almId} className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>
            <span className="material-icons-round" style={{ verticalAlign: 'middle', marginRight: 8 }}>warehouse</span>
            {data.almacenNombre}
          </h2>
          <table>
            <thead>
              <tr>
                <th>Código</th><th>Producto</th><th>Stock Total</th>
                <th>Reservado</th><th>Disponible</th><th>Estado</th><th></th>
              </tr>
            </thead>
            <tbody>
              {data.items.map(item => {
                const disponible = item.stock - item.stockReservado;
                return (
                  <tr key={item.id}>
                    <td>{item.productoCodigo || '—'}</td>
                    <td><strong>{item.productoNombre}</strong></td>
                    <td>{item.stock}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{item.stockReservado}</td>
                    <td><strong>{disponible}</strong></td>
                    <td>
                      <span className={`badge ${disponible < 1 ? 'badge-danger' : disponible < 10 ? 'badge-warning' : 'badge-success'}`}>
                        {disponible < 1 ? 'Sin stock' : disponible < 10 ? 'Bajo' : 'OK'}
                      </span>
                    </td>
                    <td>
                      <Link href={`/kardex?almacen=${almId}&producto=${item.productoId}`} className="btn btn-secondary btn-sm">
                        Kardex
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      {grouped.size === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
          No hay registros de inventario.
        </div>
      )}
      <style>{`.badge-warning{background:#fef3c7;color:#b45309}`}</style>
    </div>
  );
}
