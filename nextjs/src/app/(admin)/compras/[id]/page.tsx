import Link from 'next/link';
import { store } from '@/lib/store';
import { notFound } from 'next/navigation';

export default async function CompraDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const compra = await store.getCompra(id);
  if (!compra) notFound();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Compra {compra.numero}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>Fecha: {compra.fecha}</p>
        </div>
        <Link href="/compras" className="btn btn-secondary">
          <span className="material-icons-round">arrow_back</span> Volver
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Datos</h2>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px' }}>
            <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Proveedor:</dt>
            <dd><strong>{compra.proveedorNombre}</strong></dd>
            <dt style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Almacén:</dt>
            <dd>{compra.almacenNombre}</dd>
          </dl>
        </div>
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Estado</h2>
          <span className={`badge ${
            compra.estado === 'recibida' ? 'badge-success' :
            compra.estado === 'cancelada' ? 'badge-danger' : 'badge-warning'
          }`} style={{ fontSize: '0.9rem', padding: '4px 12px' }}>{compra.estado}</span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Productos</h2>
        <table>
          <thead><tr><th>Producto</th><th>P. Unitario</th><th>Cantidad</th><th>Subtotal</th></tr></thead>
          <tbody>
            {compra.items.map((item, i) => (
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
          <span>Subtotal:</span><span>${compra.subtotal?.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
          <span>IVA:</span><span>${compra.iva?.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontWeight: 700, fontSize: '1.1rem' }}>
          <span>Total:</span><span>${compra.total.toFixed(2)}</span>
        </div>
      </div>
      <style>{`.badge-warning{background:#fef3c7;color:#b45309}`}</style>
    </div>
  );
}
