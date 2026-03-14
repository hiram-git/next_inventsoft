import { store } from '@/lib/store';
import { revalidatePath } from 'next/cache';

async function saveImpresora(formData: FormData) {
  'use server';
  await store.updateConfigImpresora({
    tipo:        formData.get('tipo')?.toString() ?? 'network',
    ip:          formData.get('ip')?.toString() ?? '',
    puerto:      parseInt(formData.get('puerto')?.toString() ?? '9100'),
    interfaz:    formData.get('interfaz')?.toString() ?? '',
    habilitada:  formData.get('habilitada') === 'true',
  });
  revalidatePath('/configuracion/impresora');
}

export default async function ImpresoraPage() {
  const config = await store.getConfigImpresora();

  return (
    <div>
      <div className="page-header"><h1>Configuración de Impresora Térmica</h1></div>
      <div className="card">
        <form action={saveImpresora}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Tipo de conexión</label>
              <select name="tipo" className="form-control" defaultValue={config?.tipo ?? 'network'}>
                <option value="network">Red (TCP/IP)</option>
                <option value="printer">Impresora del sistema</option>
                <option value="usb">USB</option>
              </select>
            </div>
            <div className="form-group">
              <label>Habilitada</label>
              <select name="habilitada" className="form-control" defaultValue={String(config?.habilitada ?? false)}>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Dirección IP</label>
              <input type="text" name="ip" className="form-control" placeholder="192.168.1.100" defaultValue={config?.ip ?? ''} />
            </div>
            <div className="form-group">
              <label>Puerto</label>
              <input type="number" name="puerto" className="form-control" defaultValue={config?.puerto ?? 9100} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Nombre de interfaz / puerto USB</label>
              <input type="text" name="interfaz" className="form-control" placeholder="\\.\USB001 o /dev/usb/lp0" defaultValue={config?.interfaz ?? ''} />
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
