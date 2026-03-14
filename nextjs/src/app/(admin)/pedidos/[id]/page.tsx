import Link from 'next/link';
import { store } from '@/lib/store';
import { notFound } from 'next/navigation';

export default async function PedidoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pedido = await store.getPedido(id);
  if (!pedido) notFound();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Pedido {pedido.numero}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>Fecha: {pedido.fecha}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/api/pdf/pedido/${id}`} target="_blank" className="btn btn-secondary">
            <span className="material-icons-round">picture_as_pdf</span> PDF
          </Link>
          <Link href={`/api/ticket/pedido/${id}`} target="_blank" className="btn btn-secondary">
            <span className="material-icons-round">receipt</span> Ticket
          </Link>
          <Link href="/pedidos" className="btn btn-secondary">
            <span className="material-icons-round">arrow_back</span> Volver
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Datos</h2>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px' }}>
            <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cliente:</dt>
            <dd><strong>{pedido.clienteNombre}</strong></dd>
            <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Almacén:</dt>
            <dd>{pedido.almacenNombre}</dd>
            {pedido.notas && (
              <>
                <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Notas:</dt>
                <dd>{pedido.notas}</dd>
              </>
            )}
          </dl>
        </div>
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Estado</h2>
          <span className={`badge ${
            pedido.estado === 'despachado' ? 'badge-success' :
            pedido.estado === 'cancelado' ? 'badge-danger' :
            pedido.estado === 'confirmado' ? 'badge-warning' : 'badge-secondary'
          }`} style={{ fontSize: '0.9rem', padding: '4px 12px' }}>{pedido.estado}</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Productos</h2>
        <table>
          <thead><tr><th>Producto</th><th>P. Unitario</th><th>Cantidad</th><th>Subtotal</th></tr></thead>
          <tbody>
            {pedido.items.map((item, i) => (
              <tr key={i}>
                <td>{item.nombre}</td>
                <td>${item.precioUnitario?.toFixed(2)}</td>
                <td>{item.cantidad}</td>
                <td><strong>${item.subtotal?.toFixed(2)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ maxWidth: 280, marginLeft: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <span>Subtotal:</span><span>${pedido.subtotal?.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <span>IVA:</span><span>${pedido.iva?.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 700, fontSize: '1.1rem' }}>
          <span>Total:</span><span>${pedido.total.toFixed(2)}</span>
        </div>
      </div>
      <style>{`.badge-secondary{background:var(--bg);color:var(--text-muted)}.badge-warning{background:#fef3c7;color:#b45309}`}</style>
    </div>
  );
}
