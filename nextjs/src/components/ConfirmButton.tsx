'use client';

import { CSSProperties } from 'react';

interface Props {
  mensaje?: string;
  className?: string;
  title?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}

export default function ConfirmButton({ mensaje = '¿Confirmar?', className, title, style, children }: Props) {
  return (
    <button
      type="submit"
      className={className}
      title={title}
      style={style}
      onClick={(e) => { if (!confirm(mensaje)) e.preventDefault(); }}
    >
      {children}
    </button>
  );
}
