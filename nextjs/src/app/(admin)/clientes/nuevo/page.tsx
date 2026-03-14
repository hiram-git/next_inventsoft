import { store } from '@/lib/store';
import { createCliente } from '../actions';

export default async function NuevoClientePage() {
  const [tiposCliente, vendedores] = await Promise.all([
    store.getTiposCliente(),
    store.getVendedores(),
  ]);

  return (
    <div>
      <div className="page-header">
        <h1>Nuevo Cliente</h1>
        <a href="/clientes" className="btn btn-secondary">
          <span className="material-icons-round">arrow_back</span> Volver
        </a>
      </div>

      <form action={createCliente}>
        <div className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Datos Básicos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Nombre / Razón Social *</label>
              <input type="text" name="nombre" className="form-control" required />
            </div>
            <div className="form-group">
              <label>Nombre Comercial</label>
              <input type="text" name="nombreComercial" className="form-control" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" className="form-control" />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input type="text" name="telefono" className="form-control" />
            </div>
            <div className="form-group">
              <label>Tipo de Cliente</label>
              <select name="tipoCliente" className="form-control">
                <option value="">Sin tipo</option>
                {tiposCliente.map(t => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Vendedor</label>
              <select name="vendedorId" className="form-control">
                <option value="">Sin vendedor</option>
                {vendedores.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Dirección</label>
              <input type="text" name="direccion" className="form-control" />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Datos Fiscales</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Contribuyente</label>
              <select name="contribuyente" className="form-control">
                <option value="">No aplica</option>
                <option value="juridico">Jurídico</option>
                <option value="natural">Natural</option>
              </select>
            </div>
            <div className="form-group">
              <label>RUC</label>
              <input type="text" name="ruc" className="form-control" />
            </div>
            <div className="form-group">
              <label>Dígito Verificador</label>
              <input type="text" name="digitoVerificador" className="form-control" />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Crédito</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Permite Crédito</label>
              <select name="permiteCredito" className="form-control">
                <option value="false">No</option>
                <option value="true">Sí</option>
              </select>
            </div>
            <div className="form-group">
              <label>Límite de Crédito</label>
              <input type="number" name="limiteCredito" className="form-control" defaultValue="0" step="0.01" min="0" />
            </div>
            <div className="form-group">
              <label>Día de Vencimiento</label>
              <input type="number" name="diaVencimiento" className="form-control" defaultValue="30" min="1" max="90" />
            </div>
            <div className="form-group">
              <label>Descuento Global (%)</label>
              <input type="number" name="descuentoGlobal" className="form-control" defaultValue="0" step="0.01" min="0" max="100" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <a href="/clientes" className="btn btn-secondary">Cancelar</a>
          <button type="submit" className="btn btn-primary">
            <span className="material-icons-round" style={{ fontSize: 18 }}>save</span> Crear Cliente
          </button>
        </div>
      </form>
    </div>
  );
}
