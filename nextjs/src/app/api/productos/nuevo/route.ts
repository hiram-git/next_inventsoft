import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const tipoProducto = (formData.get('tipoProducto')?.toString() ?? 'simple') as 'simple' | 'compuesto' | 'kit';
  const producto = await store.createProducto({
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
    tipoProducto,
    activo:       formData.get('activo') !== 'false',
  });
  return NextResponse.json({ id: producto.id, tipoProducto: producto.tipoProducto });
}
