'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { store } from '@/lib/store';

export async function deleteCliente(formData: FormData) {
  const id = formData.get('id')?.toString() ?? '';
  await store.deleteCliente(id);
  revalidatePath('/clientes');
}

export async function createCliente(formData: FormData) {
  await store.createCliente({
    nombre:          formData.get('nombre')?.toString() ?? '',
    email:           formData.get('email')?.toString() ?? '',
    telefono:        formData.get('telefono')?.toString() ?? '',
    direccion:       formData.get('direccion')?.toString() ?? '',
    tipoCliente:     formData.get('tipoCliente')?.toString() ?? '',
    contribuyente:   formData.get('contribuyente')?.toString() ?? '',
    ruc:             formData.get('ruc')?.toString() ?? '',
    digitoVerificador: formData.get('digitoVerificador')?.toString() ?? '',
    razonSocial:     formData.get('razonSocial')?.toString() ?? '',
    nombreComercial: formData.get('nombreComercial')?.toString() ?? '',
    permiteCredito:  formData.get('permiteCredito') === 'true',
    limiteCredito:   parseFloat(formData.get('limiteCredito')?.toString() ?? '0'),
    diaVencimiento:  parseInt(formData.get('diaVencimiento')?.toString() ?? '30'),
    descuentoParcial: parseFloat(formData.get('descuentoParcial')?.toString() ?? '0'),
    descuentoGlobal: parseFloat(formData.get('descuentoGlobal')?.toString() ?? '0'),
    vendedorId:      formData.get('vendedorId') ? parseInt(formData.get('vendedorId')!.toString()) : undefined,
    vendedor:        formData.get('vendedor')?.toString() ?? '',
    rfc:             formData.get('rfc')?.toString() ?? '',
  });
  redirect('/clientes');
}

export async function updateCliente(formData: FormData) {
  const id = formData.get('id')?.toString() ?? '';
  await store.updateCliente(id, {
    nombre:          formData.get('nombre')?.toString() ?? '',
    email:           formData.get('email')?.toString() ?? '',
    telefono:        formData.get('telefono')?.toString() ?? '',
    direccion:       formData.get('direccion')?.toString() ?? '',
    tipoCliente:     formData.get('tipoCliente')?.toString() ?? '',
    contribuyente:   formData.get('contribuyente')?.toString() ?? '',
    ruc:             formData.get('ruc')?.toString() ?? '',
    digitoVerificador: formData.get('digitoVerificador')?.toString() ?? '',
    razonSocial:     formData.get('razonSocial')?.toString() ?? '',
    nombreComercial: formData.get('nombreComercial')?.toString() ?? '',
    permiteCredito:  formData.get('permiteCredito') === 'true',
    limiteCredito:   parseFloat(formData.get('limiteCredito')?.toString() ?? '0'),
    diaVencimiento:  parseInt(formData.get('diaVencimiento')?.toString() ?? '30'),
    descuentoParcial: parseFloat(formData.get('descuentoParcial')?.toString() ?? '0'),
    descuentoGlobal: parseFloat(formData.get('descuentoGlobal')?.toString() ?? '0'),
    vendedorId:      formData.get('vendedorId') ? parseInt(formData.get('vendedorId')!.toString()) : undefined,
    vendedor:        formData.get('vendedor')?.toString() ?? '',
  });
  redirect('/clientes');
}
