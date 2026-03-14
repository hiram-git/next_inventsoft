'use client';

import { useState, useRef } from 'react';

interface ItemCatalog {
  tipo: string;
  id: string;
  nombre: string;
  precio: number;
  stock?: number;
}

interface LineItem {
  id: string;
  tipo: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

interface Props {
  action: string;
  catalogItems: ItemCatalog[];
  children: React.ReactNode; // campos adicionales del form (cliente, almacen, etc.)
  submitLabel?: string;
  cancelHref?: string;
  mode?: 'factura' | 'cotizacion' | 'pedido' | 'compra';
}

function fmt(n: number) {
  return n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function DocumentForm({
  action,
  catalogItems,
  children,
  submitLabel = 'Guardar',
  cancelHref = '/',
  mode = 'factura',
}: Props) {
  const [items, setItems] = useState<LineItem[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ItemCatalog[]>([]);
  const [selected, setSelected] = useState<ItemCatalog | null>(null);
  const [qty, setQty] = useState(1);
  const [customPrice, setCustomPrice] = useState('');
  const [showResults, setShowResults] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const iva      = subtotal * 0.16;
  const total    = subtotal + iva;

  function search(q: string) {
    setQuery(q);
    if (!q.trim()) { setResults([]); setShowResults(false); return; }
    const filtered = catalogItems.filter(i => i.nombre.toLowerCase().includes(q.toLowerCase())).slice(0, 10);
    setResults(filtered);
    setShowResults(true);
  }

  function pickItem(item: ItemCatalog) {
    setSelected(item);
    setCustomPrice(mode === 'compra' ? '' : String(item.precio));
    setQuery(item.nombre);
    setShowResults(false);
    setQty(1);
  }

  function addItem() {
    if (!selected) return;
    const price = parseFloat(customPrice || String(selected.precio));
    if (isNaN(price) || price < 0 || qty < 1) return;
    const subtotal = parseFloat((price * qty).toFixed(2));

    setItems(prev => [...prev, {
      id: selected!.id,
      tipo: selected!.tipo ?? 'producto',
      nombre: selected!.nombre,
      precioUnitario: price,
      cantidad: qty,
      subtotal,
    }]);
    setSelected(null);
    setQuery('');
    setQty(1);
    setCustomPrice('');
    inputRef.current?.focus();
  }

  function removeItem(idx: number) {
    setItems(prev => prev.filter((_, i) => i !== idx));
  }

  return (
    <form method="POST" action={action}>
      <input type="hidden" name="items_json" value={JSON.stringify(items)} />

      {/* Campos personalizados (cliente, almacén, fecha, etc.) */}
      <div className="card" style={{ marginBottom: 16 }}>
        {children}
      </div>

      {/* Buscador de productos/servicios */}
      <div className="card" style={{ marginBottom: 16, position: 'relative', zIndex: 2 }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>
          {mode === 'compra' ? 'Productos a Comprar' : 'Productos y Servicios'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr' + (mode === 'compra' ? ' 1fr' : '') + ' auto', gap: 8, marginBottom: 16, alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0, position: 'relative' }}>
            <label>Buscar {mode === 'compra' ? 'producto' : 'producto/servicio'}</label>
            <input
              ref={inputRef}
              type="text"
              className="form-control"
              value={query}
              onChange={e => search(e.target.value)}
              onFocus={() => query && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              placeholder="Escriba para buscar…"
              autoComplete="off"
            />
            {showResults && results.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, background: 'white',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
                zIndex: 100, maxHeight: 240, overflowY: 'auto',
              }}>
                {results.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => pickItem(item)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      width: '100%', padding: '10px 14px', background: 'none', border: 'none',
                      cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--primary-light)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <span>{item.nombre}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      ${fmt(item.precio)}
                      {item.stock !== undefined && ` · stock: ${item.stock}`}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Cantidad</label>
            <input type="number" className="form-control" value={qty} min={1}
              onChange={e => setQty(parseInt(e.target.value) || 1)} />
          </div>
          {mode === 'compra' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Precio Unitario</label>
              <input type="number" className="form-control" step="0.01" min="0"
                value={customPrice} placeholder="0.00"
                onChange={e => setCustomPrice(e.target.value)} />
            </div>
          )}
          <button type="button" className="btn btn-success" onClick={addItem}
            style={{ height: 38 }} disabled={!selected}>
            <span className="material-icons-round" style={{ fontSize: 18 }}>add</span> Agregar
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Descripción</th>
              {mode !== 'compra' && <th>Tipo</th>}
              <th>P. Unitario</th><th>Cantidad</th><th>Subtotal</th><th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td>{item.nombre}</td>
                {mode !== 'compra' && <td>{item.tipo}</td>}
                <td>${fmt(item.precioUnitario)}</td>
                <td>{item.cantidad}</td>
                <td><strong>${fmt(item.subtotal)}</strong></td>
                <td>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(i)}>
                    <span className="material-icons-round" style={{ fontSize: 16 }}>delete</span>
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                Sin ítems. Busque y agregue productos.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ minWidth: 280 }}>
            {[
              { label: 'Subtotal:', val: subtotal },
              { label: 'IVA (16%):', val: iva },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span>{label}</span><span>${fmt(val)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: 700, fontSize: '1.2rem' }}>
              <span>Total:</span><span>${fmt(total)}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <a href={cancelHref} className="btn btn-secondary">Cancelar</a>
          <button type="submit" className="btn btn-primary" disabled={items.length === 0}>
            <span className="material-icons-round" style={{ fontSize: 18 }}>save</span> {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
