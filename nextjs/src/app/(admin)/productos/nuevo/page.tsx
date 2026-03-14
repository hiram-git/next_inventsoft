import { store } from '@/lib/store';
import { redirect } from 'next/navigation';

async function createProducto(formData: FormData) {
  'use server';
  await store.createProducto({
    codigo:      formData.get('codigo')?.toString() ?? '',
    nombre:      formData.get('nombre')?.toString() ?? '',
    descripcion: formData.get('descripcion')?.toString() ?? '',
    marca:       formData.get('marca')?.toString() ?? '',
    grupo:       formData.get('grupo')?.toString() ?? '',
    departamento:formData.get('departamento')?.toString() ?? '',
    linea:       formData.get('linea')?.toString() ?? '',
    precio:      parseFloat(formData.get('precio')?.toString() ?? '0'),
    costo:       parseFloat(formData.get('costo')?.toString() ?? '0'),
    stock:       parseInt(formData.get('stock')?.toString() ?? '0'),
    tipoProducto: (formData.get('tipoProducto')?.toString() ?? 'simple') as 'simple' | 'compuesto' | 'kit',
    activo:      formData.get('activo') !== 'false',
  });
  redirect('/productos');
}

export default async function NuevoProductoPage() {
  const [departamentos, grupos, marcas, lineas] = await Promise.all([
    store.getDepartamentos(), store.getGrupos(), store.getMarcas(), store.getLineas(),
  ]);

  return (
    <div>
      <div className="page-header">
        <h1>Nuevo Producto</h1>
        <a href="/productos" className="btn btn-secondary">
          <span className="material-icons-round">arrow_back</span> Volver
        </a>
      </div>

      <form action={createProducto}>
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
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Clasificación</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
            {[
              { name: 'departamento', label: 'Departamento', items: departamentos },
              { name: 'grupo',        label: 'Grupo',        items: grupos },
              { name: 'marca',        label: 'Marca',        items: marcas },
              { name: 'linea',        label: 'Línea',        items: lineas },
            ].map(({ name, label, items }) => (
              <div key={name} className="form-group">
                <label>{label}</label>
                <select name={name} className="form-control">
                  <option value="">Sin {label.toLowerCase()}</option>
                  {items.map((item: { id: string | number; nombre: string }) => (
                    <option key={item.id} value={item.nombre}>{item.nombre}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Precios e Inventario</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Precio de Venta *</label>
              <input type="number" name="precio" className="form-control" required step="0.01" min="0" defaultValue="0" />
            </div>
            <div className="form-group">
              <label>Costo</label>
              <input type="number" name="costo" className="form-control" step="0.01" min="0" defaultValue="0" />
            </div>
            <div className="form-group">
              <label>Stock Inicial</label>
              <input type="number" name="stock" className="form-control" min="0" defaultValue="0" />
            </div>
            <div className="form-group">
              <label>Tipo de Producto</label>
              <select name="tipoProducto" className="form-control">
                <option value="simple">Simple</option>
                <option value="compuesto">Compuesto</option>
                <option value="kit">Kit</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <a href="/productos" className="btn btn-secondary">Cancelar</a>
          <button type="submit" className="btn btn-primary">
            <span className="material-icons-round" style={{ fontSize: 18 }}>save</span> Crear Producto
          </button>
        </div>
      </form>
    </div>
  );
}
