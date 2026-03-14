import Link from 'next/link';
import { store } from '@/lib/store';
import { deleteCliente } from './actions';
import DeleteButton from '@/components/DeleteButton';

export default async function ClientesPage() {
  const clientes = await store.getClientes();

  return (
    <div>
      <div className="page-header">
        <h1>Clientes</h1>
        <Link href="/clientes/nuevo" className="btn btn-primary">
          <span className="material-icons-round">add</span> Nuevo Cliente
        </Link>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nombre / Razón Social</th>
              <th>Tipo</th>
              <th>RUC</th>
              <th>Teléfono</th>
              <th>Crédito</th>
              <th>Vendedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id}>
                <td>
                  <a href={`/clientes/${c.id}/editar`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    <div>{c.nombre}</div>
                    {c.nombreComercial && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.nombreComercial}</div>}
                  </a>
                </td>
                <td>{c.tipoCliente || '—'}</td>
                <td>{c.ruc ? `${c.ruc}${c.digitoVerificador ? '-' + c.digitoVerificador : ''}` : '—'}</td>
                <td>{c.telefono || '—'}</td>
                <td>
                  {c.permiteCredito
                    ? <span className="badge badge-success">Sí</span>
                    : <span className="badge badge-secondary">No</span>}
                </td>
                <td>{c.vendedor || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Link href={`/clientes/${c.id}/editar`} className="btn btn-primary btn-sm">
                      <span className="material-icons-round" style={{ fontSize: 16 }}>edit</span>
                    </Link>
                    <DeleteButton action={deleteCliente} id={c.id} />
                  </div>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay clientes registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`.badge-secondary { background: var(--bg); color: var(--text-muted); }`}</style>
    </div>
  );
}
