import { store } from '@/lib/store';
import { redirect } from 'next/navigation';

async function createCobro(formData: FormData) {
  'use server';
  const facturaId  = formData.get('facturaId')?.toString() ?? '';
  const monto      = parseFloat(formData.get('monto')?.toString() ?? '0');
  const metodoPago = formData.get('metodoPago')?.toString() ?? 'efectivo';
  const referencia = formData.get('referencia')?.toString() ?? '';
  const notas      = formData.get('notas')?.toString() ?? '';
  const fecha      = formData.get('fecha')?.toString() ?? new Date().toISOString().split('T')[0];

  const result = await store.createCobro({ facturaId, monto, metodoPago, referencia, notas, fecha });
  if (result.ok && result.cobro) {
    redirect(`/cobros/${result.cobro.id}`);
  }
  redirect('/cobros');
}

export default async function NuevaCobroPage({
  searchParams,
}: {
  searchParams: Promise<{ facturaId?: string }>;
}) {
  const { facturaId: preSelectedId } = await searchParams;
  const cxc      = await store.getCuentasPorCobrar();
  const pendients = cxc.filter(f => f.saldo > 0);
  const today    = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Registrar Cobro</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>Aplica un pago a una factura pendiente</p>
        </div>
        <a href="/cobros" className="btn btn-secondary">
          <span className="material-icons-round">arrow_back</span> Volver
        </a>
      </div>

      {pendients.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
          <span className="material-icons-round" style={{ fontSize: 48, display: 'block', marginBottom: 12, color: 'var(--success)' }}>check_circle</span>
          <p>No hay facturas pendientes de cobro.</p>
          <a href="/facturas" className="btn btn-primary" style={{ marginTop: 12 }}>Ver Facturas</a>
        </div>
      ) : (
        <div className="card">
          <form action={createCobro}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Factura *</label>
                <select name="facturaId" className="form-control" required defaultValue={preSelectedId ?? ''}>
                  <option value="">— Selecciona una factura —</option>
                  {pendients.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.numero} — {f.clienteNombre} — Saldo: ${f.saldo.toFixed(2)}
                      {f.diasVencido > 0 ? ` ⚠ Vencida ${f.diasVencido}d` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Monto a cobrar *</label>
                <input type="number" name="monto" className="form-control" min="0.01" step="0.01" required placeholder="0.00" />
              </div>
              <div className="form-group">
                <label>Fecha *</label>
                <input type="date" name="fecha" className="form-control" required defaultValue={today} />
              </div>
              <div className="form-group">
                <label>Método de Pago *</label>
                <select name="metodoPago" className="form-control" required>
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia bancaria</option>
                  <option value="cheque">Cheque</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </div>
              <div className="form-group">
                <label>Referencia / Nro. documento</label>
                <input type="text" name="referencia" className="form-control" placeholder="Nro. cheque, transferencia…" />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Notas</label>
                <textarea name="notas" className="form-control" rows={2} placeholder="Observaciones adicionales…" />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
              <a href="/cobros" className="btn btn-secondary">Cancelar</a>
              <button type="submit" className="btn btn-primary">
                <span className="material-icons-round" style={{ fontSize: 18 }}>save</span> Registrar Cobro
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
