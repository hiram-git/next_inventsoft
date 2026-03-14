'use client';

interface Props {
  action: (formData: FormData) => Promise<void>;
  id: string | number;
  mensaje?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function DeleteButton({
  action,
  id,
  mensaje = '¿Eliminar?',
  className = 'btn btn-danger btn-sm',
  children,
}: Props) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className={className}
        onClick={(e) => { if (!confirm(mensaje)) e.preventDefault(); }}
      >
        {children ?? <span className="material-icons-round" style={{ fontSize: 16 }}>delete</span>}
      </button>
    </form>
  );
}
