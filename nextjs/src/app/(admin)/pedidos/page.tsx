import Link from 'next/link';
import { store } from '@/lib/store';
import { revalidatePath } from 'next/cache';

async function handlePedido(formData: FormData) {
  'use server';
  const action = formData.get('_action')?.toString();
  const id = formData.get('id')?.toString() ?? '';
  if (action === 'confirmar') {
    await store.confirmarPedido(id);
  } else if (action === 'despachar') {
    await store.despacharPedido(id);
  } else if (action === 'cancelar') {
    await store.cancelarPedido(id);
  }
  revalidatePath('/pedidos');
}

export default async function PedidosPage() {
  const pedidos = await store.getPedidos();

  const estadoBadge: Record<string, string> = {
    borrador: 'badge-secondary', confirmado: 'badge-warning',
    despachado: 'badge-success', cancelado: 'badge-danger',
  };

  return (
    <div>
      <div className="page-header">
        <h1>Pedidos</h1>
        <Link href="/pedidos/nuevo" className="btn btn-primary">
          <span className="material-icons-round">add</span> Nuevo Pedido
        </Link>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Número</th><th>Fecha</th><th>Cliente</th><th>Almacén</th>
              <th>Items</th><th>Total</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p.id}>
                <td><strong>{p.numero}</strong></td>
                <td>{p.fecha}</td>
                <td>{p.clienteNombre}</td>
                <td>{p.almacenNombre}</td>
                <td>{p.items.length} producto(s)</td>
                <td><strong>${p.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong></td>
                <td>
                  <span className={`badge ${estadoBadge[p.estado] ?? 'badge-secondary'}`}>{p.estado}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Link href={`/pedidos/${p.id}`} className="btn btn-primary btn-sm" title="Ver">
                      <span className="material-icons-round" style={{ fontSize: 16 }}>visibility</span>
                    </Link>
                    {p.estado === 'borrador' && (
                      <form action={handlePedido} style={{ display: 'inline' }}>
                        <input type="hidden" name="_action" value="confirmar" />
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="btn btn-success btn-sm" title="Confirmar"
                          onClick={(e) => { if (!confirm('¿Confirmar pedido? Se reservará stock.')) e.preventDefault(); }}>
                          <span className="material-icons-round" style={{ fontSize: 16 }}>check</span>
                        </button>
                      </form>
                    )}
                    {p.estado === 'confirmado' && (
                      <form action={handlePedido} style={{ display: 'inline' }}>
                        <input type="hidden" name="_action" value="despachar" />
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="btn btn-primary btn-sm" title="Despachar"
                          onClick={(e) => { if (!confirm('¿Despachar pedido?')) e.preventDefault(); }}>
                          <span className="material-icons-round" style={{ fontSize: 16 }}>local_shipping</span>
                        </button>
                      </form>
                    )}
                    {(p.estado === 'borrador' || p.estado === 'confirmado') && (
                      <form action={handlePedido} style={{ display: 'inline' }}>
                        <input type="hidden" name="_action" value="cancelar" />
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="btn btn-danger btn-sm" title="Cancelar"
                          onClick={(e) => { if (!confirm('¿Cancelar?')) e.preventDefault(); }}>
                          <span className="material-icons-round" style={{ fontSize: 16 }}>cancel</span>
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {pedidos.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay pedidos.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <style>{`.badge-secondary{background:var(--bg);color:var(--text-muted)}.badge-warning{background:#fef3c7;color:#b45309}`}</style>
    </div>
  );
}
