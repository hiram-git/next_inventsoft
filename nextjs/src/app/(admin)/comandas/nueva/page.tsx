import { store } from '@/lib/store';
import { redirect } from 'next/navigation';

async function createComanda(formData: FormData) {
  'use server';
  const clienteNombre = formData.get('clienteNombre')?.toString() ?? '';
  const prioridad = formData.get('prioridad')?.toString() as 'baja' | 'normal' | 'alta' | 'urgente';
  const notas = formData.get('notas')?.toString() ?? '';
  const itemsStr = formData.get('items_text')?.toString() ?? '';

  await store.createComanda({
    clienteNombre,
    prioridad,
    notas,
    items: itemsStr ? itemsStr.split('\n').filter(Boolean).map(l => ({ descripcion: l.trim() })) : [],
    estado: 'nueva',
    creadoAt: new Date().toISOString(),
  });

  redirect('/comandas');
}

export default function NuevaComandaPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Nueva Comanda</h1>
        <a href="/comandas" className="btn btn-secondary">
          <span className="material-icons-round">arrow_back</span> Volver
        </a>
      </div>

      <div className="card">
        <form action={createComanda}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Cliente / Mesa</label>
              <input type="text" name="clienteNombre" className="form-control" placeholder="Nombre o número de mesa" />
            </div>
            <div className="form-group">
              <label>Prioridad</label>
              <select name="prioridad" className="form-control">
                <option value="normal">Normal</option>
                <option value="baja">Baja</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Items de la comanda</label>
              <textarea name="items_text" className="form-control" rows={5}
                placeholder="Un item por línea&#10;Ej: 2x Hamburguesa con queso&#10;1x Refresco de cola&#10;3x Papas fritas" />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Un ítem por línea</small>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Notas adicionales</label>
              <textarea name="notas" className="form-control" rows={2} placeholder="Alergias, instrucciones especiales…" />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <a href="/comandas" className="btn btn-secondary">Cancelar</a>
            <button type="submit" className="btn btn-primary">
              <span className="material-icons-round" style={{ fontSize: 18 }}>add</span> Crear Comanda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
