import { store } from '@/lib/store';
import { redirect } from 'next/navigation';

async function createServicio(formData: FormData) {
  'use server';
  await store.createServicio({
    codigo:      formData.get('codigo')?.toString() ?? '',
    nombre:      formData.get('nombre')?.toString() ?? '',
    descripcion: formData.get('descripcion')?.toString() ?? '',
    marca:       formData.get('marca')?.toString() ?? '',
    grupo:       formData.get('grupo')?.toString() ?? '',
    precio:      parseFloat(formData.get('precio')?.toString() ?? '0'),
    costo:       parseFloat(formData.get('costo')?.toString() ?? '0'),
    activo:      formData.get('activo') !== 'false',
  });
  redirect('/servicios');
}

export default async function NuevoServicioPage() {
  const [grupos, marcas] = await Promise.all([store.getGrupos(), store.getMarcas()]);

  return (
    <div>
      <div className="page-header">
        <h1>Nuevo Servicio</h1>
        <a href="/servicios" className="btn btn-secondary">
          <span className="material-icons-round">arrow_back</span> Volver
        </a>
      </div>
      <form action={createServicio}>
        <div className="card">
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
            <div className="form-group">
              <label>Marca</label>
              <select name="marca" className="form-control">
                <option value="">Sin marca</option>
                {marcas.map(m => <option key={m.id} value={m.nombre}>{m.nombre}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Grupo</label>
              <select name="grupo" className="form-control">
                <option value="">Sin grupo</option>
                {grupos.map(g => <option key={g.id} value={g.nombre}>{g.nombre}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Precio *</label>
              <input type="number" name="precio" className="form-control" required step="0.01" min="0" defaultValue="0" />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <a href="/servicios" className="btn btn-secondary">Cancelar</a>
            <button type="submit" className="btn btn-primary">
              <span className="material-icons-round" style={{ fontSize: 18 }}>save</span> Crear Servicio
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
