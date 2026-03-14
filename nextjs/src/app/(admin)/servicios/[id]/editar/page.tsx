import { store } from '@/lib/store';
import { notFound, redirect } from 'next/navigation';

async function updateServicio(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString() ?? '';
  await store.updateServicio(id, {
    codigo:      formData.get('codigo')?.toString() ?? '',
    nombre:      formData.get('nombre')?.toString() ?? '',
    descripcion: formData.get('descripcion')?.toString() ?? '',
    marca:       formData.get('marca')?.toString() ?? '',
    grupo:       formData.get('grupo')?.toString() ?? '',
    precio:      parseFloat(formData.get('precio')?.toString() ?? '0'),
    activo:      formData.get('activo') !== 'false',
  });
  redirect('/servicios');
}

export default async function EditarServicioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [servicio, grupos, marcas] = await Promise.all([
    store.getServicio(id), store.getGrupos(), store.getMarcas(),
  ]);
  if (!servicio) notFound();

  return (
    <div>
      <div className="page-header">
        <h1>Editar Servicio</h1>
        <a href="/servicios" className="btn btn-secondary">
          <span className="material-icons-round">arrow_back</span> Volver
        </a>
      </div>
      <form action={updateServicio}>
        <input type="hidden" name="id" value={id} />
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Código</label>
              <input type="text" name="codigo" className="form-control" defaultValue={servicio.codigo ?? ''} />
            </div>
            <div className="form-group" style={{ gridColumn: '2 / -1' }}>
              <label>Nombre *</label>
              <input type="text" name="nombre" className="form-control" required defaultValue={servicio.nombre} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Descripción</label>
              <textarea name="descripcion" className="form-control" rows={2} defaultValue={servicio.descripcion ?? ''} />
            </div>
            <div className="form-group">
              <label>Marca</label>
              <select name="marca" className="form-control" defaultValue={servicio.marca ?? ''}>
                <option value="">Sin marca</option>
                {marcas.map(m => <option key={m.id} value={m.nombre}>{m.nombre}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Grupo</label>
              <select name="grupo" className="form-control" defaultValue={servicio.grupo ?? ''}>
                <option value="">Sin grupo</option>
                {grupos.map(g => <option key={g.id} value={g.nombre}>{g.nombre}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Precio *</label>
              <input type="number" name="precio" className="form-control" required step="0.01" min="0" defaultValue={servicio.precio} />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select name="activo" className="form-control" defaultValue={String(servicio.activo)}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <a href="/servicios" className="btn btn-secondary">Cancelar</a>
            <button type="submit" className="btn btn-primary">
              <span className="material-icons-round" style={{ fontSize: 18 }}>save</span> Guardar Cambios
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
