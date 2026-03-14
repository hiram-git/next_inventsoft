import Link from 'next/link';
import { store } from '@/lib/store';
import { revalidatePath } from 'next/cache';
import ConfirmButton from '@/components/ConfirmButton';

async function handleComanda(formData: FormData) {
  'use server';
  const id = formData.get('id')?.toString() ?? '';
  const estado = formData.get('estado')?.toString() as 'nueva' | 'en_preparacion' | 'lista' | 'entregada' | 'cancelada';
  await store.updateComandaEstado(id, estado);
  revalidatePath('/comandas');
}

export default async function ComandasPage() {
  const comandas = await store.getComandas();

  const estadoBadge: Record<string, string> = {
    nueva: 'badge-info', en_preparacion: 'badge-warning',
    lista: 'badge-success', entregada: 'badge-secondary', cancelada: 'badge-danger',
  };

  const prioridadBadge: Record<string, string> = {
    baja: 'badge-secondary', normal: 'badge-info', alta: 'badge-warning', urgente: 'badge-danger',
  };

  return (
    <div>
      <div className="page-header">
        <h1>Comandas de Cocina</h1>
        <Link href="/comandas/nueva" className="btn btn-primary">
          <span className="material-icons-round">add</span> Nueva Comanda
        </Link>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Número</th><th>Cliente/Mesa</th><th>Prioridad</th><th>Estado</th>
              <th>Creada</th><th>Notas</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {comandas.map(c => (
              <tr key={c.id}>
                <td><strong>{c.numero}</strong></td>
                <td>{c.clienteNombre || '—'}</td>
                <td>
                  <span className={`badge ${prioridadBadge[c.prioridad] ?? 'badge-secondary'}`}>{c.prioridad}</span>
                </td>
                <td>
                  <span className={`badge ${estadoBadge[c.estado] ?? 'badge-secondary'}`}>{c.estado.replace('_', ' ')}</span>
                </td>
                <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{c.creadoAt}</td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.notas || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {c.estado === 'nueva' && (
                      <form action={handleComanda} style={{ display: 'inline' }}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="estado" value="en_preparacion" />
                        <button type="submit" className="btn btn-warning btn-sm" title="Iniciar preparación">
                          <span className="material-icons-round" style={{ fontSize: 16 }}>restaurant</span>
                        </button>
                      </form>
                    )}
                    {c.estado === 'en_preparacion' && (
                      <form action={handleComanda} style={{ display: 'inline' }}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="estado" value="lista" />
                        <button type="submit" className="btn btn-success btn-sm" title="Marcar lista">
                          <span className="material-icons-round" style={{ fontSize: 16 }}>done_all</span>
                        </button>
                      </form>
                    )}
                    {c.estado === 'lista' && (
                      <form action={handleComanda} style={{ display: 'inline' }}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="estado" value="entregada" />
                        <button type="submit" className="btn btn-primary btn-sm" title="Marcar entregada">
                          <span className="material-icons-round" style={{ fontSize: 16 }}>delivery_dining</span>
                        </button>
                      </form>
                    )}
                    {(c.estado === 'nueva' || c.estado === 'en_preparacion') && (
                      <form action={handleComanda} style={{ display: 'inline' }}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="estado" value="cancelada" />
                        <ConfirmButton mensaje="¿Cancelar?" className="btn btn-danger btn-sm" title="Cancelar">
                          <span className="material-icons-round" style={{ fontSize: 16 }}>cancel</span>
                        </ConfirmButton>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {comandas.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay comandas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <style>{`
        .badge-secondary{background:var(--bg);color:var(--text-muted)}
        .badge-info{background:#dbeafe;color:#2563eb}
        .badge-warning{background:#fef3c7;color:#b45309}
        .btn-warning{background:#f59e0b;color:white}
        .btn-warning:hover{opacity:0.9}
      `}</style>
    </div>
  );
}
