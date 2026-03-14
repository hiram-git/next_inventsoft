'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TIPO_INFO = {
  simple: null,
  kit: {
    icon: 'inventory_2',
    color: '#7c3aed',
    titulo: 'Kit (bundle)',
    desc: 'Agrupa varios productos con un precio de venta personalizado. Ej: Combo gaseosas — Coca $12 + Fanta $8, vendido como kit a $15. Al guardar podrás agregar los productos del kit.',
  },
  compuesto: {
    icon: 'blender',
    color: '#0891b2',
    titulo: 'Producto Compuesto (receta)',
    desc: 'Define ingredientes que se descuentan del inventario al vender. Ej: Hamburguesa = pan + carne + mayonesa + cebolla. Al guardar podrás agregar los ingredientes con sus cantidades y unidades.',
  },
};

export default function NuevoProductoPage() {
  const [tipo, setTipo] = useState<'simple' | 'kit' | 'compuesto'>('simple');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const res = await fetch('/api/productos/nuevo', { method: 'POST', body: data });
    if (res.ok) {
      const { id, tipoProducto } = await res.json();
      if (tipoProducto !== 'simple') {
        router.push(`/productos/${id}/componentes`);
      } else {
        router.push('/productos');
      }
    } else {
      setLoading(false);
    }
  }

  const info = TIPO_INFO[tipo];

  return (
    <div>
      <div className="page-header">
        <h1>Nuevo Producto</h1>
        <a href="/productos" className="btn btn-secondary">
          <span className="material-icons-round">arrow_back</span> Volver
        </a>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tipo de producto — primero para que el hint aparezca al inicio */}
        <div className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Tipo de Producto</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {(['simple', 'kit', 'compuesto'] as const).map(t => (
              <label key={t} style={{
                border: `2px solid ${tipo === t ? (t === 'kit' ? '#7c3aed' : t === 'compuesto' ? '#0891b2' : 'var(--primary)') : 'var(--border)'}`,
                borderRadius: 8,
                padding: '12px 16px',
                cursor: 'pointer',
                background: tipo === t ? (t === 'kit' ? '#f5f3ff' : t === 'compuesto' ? '#ecfeff' : 'var(--bg-hover,#f0f4ff)') : '',
                transition: 'all 0.15s',
              }}>
                <input type="radio" name="tipoProducto" value={t} checked={tipo === t}
                  onChange={() => setTipo(t)} style={{ display: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className="material-icons-round" style={{ fontSize: 20, color: tipo === t ? (t === 'kit' ? '#7c3aed' : t === 'compuesto' ? '#0891b2' : 'var(--primary)') : 'var(--text-muted)' }}>
                    {t === 'simple' ? 'check_box_outline_blank' : t === 'kit' ? 'inventory_2' : 'blender'}
                  </span>
                  <strong style={{ fontSize: '0.9rem' }}>
                    {t === 'simple' ? 'Simple' : t === 'kit' ? 'Kit / Bundle' : 'Compuesto / Receta'}
                  </strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {t === 'simple' && 'Producto con stock propio, sin receta.'}
                  {t === 'kit' && 'Bundle de productos con precio custom.'}
                  {t === 'compuesto' && 'Descuenta ingredientes del inventario.'}
                </div>
              </label>
            ))}
          </div>

          {info && (
            <div style={{
              marginTop: 12,
              padding: '12px 16px',
              background: `${info.color}10`,
              border: `1px solid ${info.color}30`,
              borderRadius: 8,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}>
              <span className="material-icons-round" style={{ color: info.color, fontSize: 20, marginTop: 1 }}>info</span>
              <div>
                <strong style={{ color: info.color, fontSize: '0.85rem' }}>{info.titulo}</strong>
                <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{info.desc}</p>
              </div>
            </div>
          )}
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Identificación</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Código</label>
              <input type="text" name="codigo" className="form-control" />
            </div>
            <div className="form-group" style={{ gridColumn: '2 / -1' }}>
              <label>Nombre *</label>
              <input type="text" name="nombre" className="form-control" required />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Descripción</label>
              <textarea name="descripcion" className="form-control" rows={2} />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>
            {tipo === 'kit' ? 'Precio del Kit' : tipo === 'compuesto' ? 'Precio y Costo' : 'Precios e Inventario'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>{tipo === 'kit' ? 'Precio de venta del kit *' : 'Precio de Venta *'}</label>
              <input type="number" name="precio" className="form-control" required step="0.01" min="0" defaultValue="0" />
              {tipo === 'kit' && (
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Puede ser diferente a la suma de los componentes</small>
              )}
            </div>
            <div className="form-group">
              <label>Costo</label>
              <input type="number" name="costo" className="form-control" step="0.01" min="0" defaultValue="0" />
            </div>
            {tipo === 'simple' && (
              <div className="form-group">
                <label>Stock Inicial</label>
                <input type="number" name="stock" className="form-control" min="0" defaultValue="0" />
              </div>
            )}
            {tipo !== 'simple' && (
              <input type="hidden" name="stock" value="0" />
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <a href="/productos" className="btn btn-secondary">Cancelar</a>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading
              ? <><span className="material-icons-round" style={{ fontSize: 18 }}>hourglass_empty</span> Guardando…</>
              : tipo !== 'simple'
                ? <><span className="material-icons-round" style={{ fontSize: 18 }}>arrow_forward</span> Crear y agregar {tipo === 'kit' ? 'productos del kit' : 'ingredientes'}</>
                : <><span className="material-icons-round" style={{ fontSize: 18 }}>save</span> Crear Producto</>
            }
          </button>
        </div>
      </form>
    </div>
  );
}
