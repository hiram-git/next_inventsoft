import { store } from '@/lib/store';
import { revalidatePath } from 'next/cache';

async function saveEmpresa(formData: FormData) {
  'use server';
  await store.updateEmpresa({
    nombre:    formData.get('nombre')?.toString() ?? '',
    ruc:       formData.get('ruc')?.toString() ?? '',
    direccion: formData.get('direccion')?.toString() ?? '',
    telefono:  formData.get('telefono')?.toString() ?? '',
    email:     formData.get('email')?.toString() ?? '',
    sitioWeb:  formData.get('sitioWeb')?.toString() ?? '',
    logoUrl:   formData.get('logoUrl')?.toString() ?? '',
  });
  revalidatePath('/configuracion/empresa');
}

export default async function EmpresaPage() {
  const empresa = await store.getEmpresa();

  return (
    <div>
      <div className="page-header"><h1>Configuración de Empresa</h1></div>
      <div className="card">
        <form action={saveEmpresa}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Nombre de la Empresa *</label>
              <input type="text" name="nombre" className="form-control" required defaultValue={empresa?.nombre ?? ''} />
            </div>
            <div className="form-group">
              <label>RUC / NIF</label>
              <input type="text" name="ruc" className="form-control" defaultValue={empresa?.ruc ?? ''} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Dirección</label>
              <input type="text" name="direccion" className="form-control" defaultValue={empresa?.direccion ?? ''} />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input type="text" name="telefono" className="form-control" defaultValue={empresa?.telefono ?? ''} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" className="form-control" defaultValue={empresa?.email ?? ''} />
            </div>
            <div className="form-group">
              <label>Sitio Web</label>
              <input type="url" name="sitioWeb" className="form-control" defaultValue={empresa?.sitioWeb ?? ''} />
            </div>
            <div className="form-group">
              <label>Logo URL</label>
              <input type="url" name="logoUrl" className="form-control" defaultValue={empresa?.logoUrl ?? ''} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <button type="submit" className="btn btn-primary">
              <span className="material-icons-round" style={{ fontSize: 18 }}>save</span> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
