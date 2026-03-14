import { store } from '@/lib/store';
import { notFound, redirect } from 'next/navigation';

async function updateProducto(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString() ?? '';
  await store.updateProducto(id, {
    codigo:       formData.get('codigo')?.toString() ?? '',
    nombre:       formData.get('nombre')?.toString() ?? '',
    descripcion:  formData.get('descripcion')?.toString() ?? '',
    marca:        formData.get('marca')?.toString() ?? '',
    grupo:        formData.get('grupo')?.toString() ?? '',
    departamento: formData.get('departamento')?.toString() ?? '',
    linea:        formData.get('linea')?.toString() ?? '',
    precio:       parseFloat(formData.get('precio')?.toString() ?? '0'),
    costo:        parseFloat(formData.get('costo')?.toString() ?? '0'),
    stock:        parseInt(formData.get('stock')?.toString() ?? '0'),
    tipoProducto: (formData.get('tipoProducto')?.toString() ?? 'simple') as 'simple' | 'compuesto' | 'kit',
    activo:       formData.get('activo') !== 'false',
  });
  redirect('/productos');
}

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [producto, departamentos, grupos, marcas, lineas] = await Promise.all([
    store.getProducto(id), store.getDepartamentos(), store.getGrupos(), store.getMarcas(), store.getLineas(),
  ]);
  if (!producto) notFound();

  return (
    <div>
      <div className="page-header">
        <h1>Editar Producto</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {(producto.tipoProducto === 'kit' || producto.tipoProducto === 'compuesto') && (
            <a href={`/productos/${id}/componentes`} className="btn btn-primary">
              <span className="material-icons-round">
                {producto.tipoProducto === 'kit' ? 'inventory_2' : 'blender'}
              </span>
              {producto.tipoProducto === 'kit' ? 'Productos del kit' : 'Ingredientes'}
            </a>
          )}
          <a href="/productos" className="btn btn-secondary">
            <span className="material-icons-round">arrow_back</span> Volver
          </a>
        </div>
      </div>

      <form action={updateProducto}>
        <input type="hidden" name="id" value={id} />

        <div className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Identificación</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Código</label>
              <input type="text" name="codigo" className="form-control" defaultValue={producto.codigo ?? ''} />
            </div>
            <div className="form-group" style={{ gridColumn: '2 / -1' }}>
              <label>Nombre *</label>
              <input type="text" name="nombre" className="form-control" required defaultValue={producto.nombre} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Descripción</label>
              <textarea name="descripcion" className="form-control" rows={2} defaultValue={producto.descripcion ?? ''} />
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Clasificación</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
            {[
              { name: 'departamento', label: 'Departamento', items: departamentos, val: producto.departamento },
              { name: 'grupo',        label: 'Grupo',        items: grupos,        val: producto.grupo },
              { name: 'marca',        label: 'Marca',        items: marcas,        val: producto.marca },
              { name: 'linea',        label: 'Línea',        items: lineas,        val: producto.linea },
            ].map(({ name, label, items, val }) => (
              <div key={name} className="form-group">
                <label>{label}</label>
                <select name={name} className="form-control" defaultValue={val ?? ''}>
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
              <input type="number" name="precio" className="form-control" required step="0.01" min="0" defaultValue={producto.precio} />
            </div>
            <div className="form-group">
              <label>Costo</label>
              <input type="number" name="costo" className="form-control" step="0.01" min="0" defaultValue={producto.costo ?? 0} />
            </div>
            <div className="form-group">
              <label>Stock Actual</label>
              <input type="number" name="stock" className="form-control" min="0" defaultValue={producto.stock ?? 0} />
            </div>
            <div className="form-group">
              <label>Tipo de Producto</label>
              <select name="tipoProducto" className="form-control" defaultValue={producto.tipoProducto ?? 'simple'}>
                <option value="simple">Simple</option>
                <option value="kit">Kit / Bundle</option>
                <option value="compuesto">Compuesto / Receta</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select name="activo" className="form-control" defaultValue={String(producto.activo)}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <a href="/productos" className="btn btn-secondary">Cancelar</a>
          <button type="submit" className="btn btn-primary">
            <span className="material-icons-round" style={{ fontSize: 18 }}>save</span> Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
