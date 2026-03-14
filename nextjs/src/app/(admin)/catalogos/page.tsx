import { store } from '@/lib/store';
import { revalidatePath } from 'next/cache';

async function handleCatalog(formData: FormData) {
  'use server';
  const action  = formData.get('_action')?.toString();
  const tabla   = formData.get('tabla')?.toString();
  const nombre  = formData.get('nombre')?.toString() ?? '';
  const id      = formData.get('id')?.toString();

  if (action === 'create') {
    if (tabla === 'departamentos') await store.createDepartamento({ nombre });
    else if (tabla === 'grupos')   await store.createGrupo({ nombre });
    else if (tabla === 'marcas')   await store.createMarca({ nombre });
    else if (tabla === 'lineas')   await store.createLinea({ nombre });
  } else if (action === 'delete') {
    if (tabla === 'departamentos') await store.deleteDepartamento(id!);
    else if (tabla === 'grupos')   await store.deleteGrupo(id!);
    else if (tabla === 'marcas')   await store.deleteMarca(id!);
    else if (tabla === 'lineas')   await store.deleteLinea(id!);
  }
  revalidatePath('/catalogos');
}

function CatalogSection({
  title, tabla, items,
}: { title: string; tabla: string; items: { id: string | number; nombre: string }[] }) {
  return (
    <div className="card">
      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>{title}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {items.map(item => (
          <div key={item.id} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--bg)', borderRadius: 20, padding: '4px 12px',
            fontSize: '0.875rem',
          }}>
            <span>{item.nombre}</span>
            <form action={handleCatalog} style={{ display: 'inline' }}>
              <input type="hidden" name="_action" value="delete" />
              <input type="hidden" name="tabla" value={tabla} />
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '0 2px', fontSize: '1rem', lineHeight: 1 }}
                onClick={(e) => { if (!confirm(`¿Eliminar "${item.nombre}"?`)) e.preventDefault(); }}>
                ×
              </button>
            </form>
          </div>
        ))}
        {items.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sin registros.</span>}
      </div>
      <form action={handleCatalog} style={{ display: 'flex', gap: 8 }}>
        <input type="hidden" name="_action" value="create" />
        <input type="hidden" name="tabla" value={tabla} />
        <input type="text" name="nombre" className="form-control" placeholder={`Nuevo ${title.toLowerCase().slice(0, -1)}…`} required style={{ flex: 1 }} />
        <button type="submit" className="btn btn-primary btn-sm">
          <span className="material-icons-round" style={{ fontSize: 16 }}>add</span> Agregar
        </button>
      </form>
    </div>
  );
}

export default async function CatalogosPage() {
  const [departamentos, grupos, marcas, lineas] = await Promise.all([
    store.getDepartamentos(), store.getGrupos(), store.getMarcas(), store.getLineas(),
  ]);

  return (
    <div>
      <div className="page-header"><h1>Catálogos</h1></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <CatalogSection title="Departamentos" tabla="departamentos" items={departamentos} />
        <CatalogSection title="Grupos"        tabla="grupos"        items={grupos} />
        <CatalogSection title="Marcas"        tabla="marcas"        items={marcas} />
        <CatalogSection title="Líneas"        tabla="lineas"        items={lineas} />
      </div>
    </div>
  );
}
