'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string | number;
  nombre: string;
  email: string;
  rol: string;
}

interface Props {
  user: User;
  children: React.ReactNode;
}

const menuItems = [
  { href: '/dashboard',     label: 'Dashboard',        icon: 'dashboard' },
  { href: '/clientes',      label: 'Clientes',         icon: 'people' },
  { href: '/productos',     label: 'Productos',        icon: 'inventory' },
  { href: '/servicios',     label: 'Servicios',        icon: 'build' },
  { href: '/vendedores',    label: 'Vendedores',       icon: 'badge' },
  { href: '/catalogos',     label: 'Catálogos',        icon: 'category' },
  { href: '/cotizaciones',  label: 'Cotizaciones',     icon: 'request_quote' },
  { href: '/facturas',      label: 'Facturas',         icon: 'receipt' },
  { href: '/notas-credito', label: 'Notas de Crédito', icon: 'undo' },
  { href: '/pedidos',       label: 'Pedidos',          icon: 'shopping_cart' },
];

const cobrosItems = [
  { href: '/cuentas-por-cobrar', label: 'Cuentas por Cobrar', icon: 'account_balance_wallet' },
  { href: '/cobros',             label: 'Cobros',              icon: 'payments' },
];

const inventarioItems = [
  { href: '/almacenes', label: 'Almacenes',      icon: 'warehouse' },
  { href: '/inventario', label: 'Inventario',    icon: 'view_list' },
  { href: '/compras',   label: 'Compras',        icon: 'local_shipping' },
  { href: '/kardex',    label: 'Kardex',         icon: 'swap_vert' },
];

const cocinaItems = [
  { href: '/comandas',       label: 'Comandas (Cocina)', icon: 'restaurant' },
  { href: '/comandas/nueva', label: 'Nueva Comanda',     icon: 'add_circle_outline' },
];

const reportesItems = [
  { href: '/reportes/ventas', label: 'Ventas Mensuales', icon: 'bar_chart' },
];

const configItems = [
  { href: '/configuracion/empresa',   label: 'Empresa',   icon: 'business' },
  { href: '/configuracion/impresora', label: 'Impresora', icon: 'print' },
  { href: '/configuracion/usuarios',  label: 'Usuarios',  icon: 'manage_accounts' },
  { href: '/configuracion/roles',     label: 'Roles',     icon: 'admin_panel_settings' },
  { href: '/configuracion/permisos',  label: 'Permisos',  icon: 'lock' },
];

const sections = [
  { id: 'principal',    label: 'Principal',              items: menuItems },
  { id: 'cobros',       label: 'Gestión de Cobros',      items: cobrosItems },
  { id: 'inventario',   label: 'Control de Inventario',  items: inventarioItems },
  { id: 'cocina',       label: 'Cocina',                 items: cocinaItems },
  { id: 'reportes',     label: 'Reportes',               items: reportesItems },
  { id: 'configuracion', label: 'Configuración',         items: configItems },
];

const allNavHrefs = sections.flatMap(s => s.items.map(i => i.href));

function NavItem({ href, icon, label, currentPath }: {
  href: string; icon: string; label: string; currentPath: string;
}) {
  // Active if exact match, OR path starts with href+'/' but no more-specific nav item also matches
  const isActive = currentPath === href ||
    (currentPath.startsWith(href + '/') &&
      !allNavHrefs.some(h => h !== href && h.startsWith(href + '/') && currentPath.startsWith(h)));
  return (
    <Link href={href} className={`nav-link${isActive ? ' active' : ''}`} title={label}>
      <span className="material-icons-round">{icon}</span>
      <span className="nav-link-label">{label}</span>
    </Link>
  );
}

export default function AdminLayout({ user, children }: Props) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const backdrop = backdropRef.current;
    if (!sidebar || !backdrop) return;

    const isMobile = () => window.innerWidth <= 768;

    // Restore collapsed state
    if (!isMobile() && localStorage.getItem('sidebarCollapsed') === 'true') {
      sidebar.classList.add('collapsed');
    }

    // Restore section accordion state
    const collapsedSections: Set<string> = new Set(
      JSON.parse(localStorage.getItem('collapsedSections') ?? '[]')
    );

    sidebar.querySelectorAll<HTMLElement>('.nav-section[data-section]').forEach(section => {
      const id = section.dataset.section!;
      if (collapsedSections.has(id)) section.classList.add('collapsed');

      section.querySelector('.nav-section-title')!.addEventListener('click', () => {
        if (sidebar.classList.contains('collapsed')) return;
        section.classList.toggle('collapsed');
        if (section.classList.contains('collapsed')) {
          collapsedSections.add(id);
        } else {
          collapsedSections.delete(id);
        }
        localStorage.setItem('collapsedSections', JSON.stringify([...collapsedSections]));
      });
    });

    const handleResize = () => {
      if (!isMobile()) {
        sidebar.classList.remove('open');
        backdrop.classList.remove('visible');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function toggleMenu() {
    const sidebar = sidebarRef.current;
    const backdrop = backdropRef.current;
    if (!sidebar || !backdrop) return;

    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      const isOpen = sidebar.classList.toggle('open');
      backdrop.classList.toggle('visible', isOpen);
    } else {
      const isCollapsed = sidebar.classList.toggle('collapsed');
      localStorage.setItem('sidebarCollapsed', String(isCollapsed));
    }
  }

  function closeBackdrop() {
    sidebarRef.current?.classList.remove('open');
    backdropRef.current?.classList.remove('visible');
  }

  async function handleLogout(formData: FormData) {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  return (
    <>
      {/* Sidebar */}
      <aside className="sidebar" id="sidebar" ref={sidebarRef}>
        <div className="sidebar-header">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <span className="sidebar-brand">Admin Portal</span>
        </div>

        <nav className="sidebar-nav">
          {sections.map(section => (
            <div key={section.id} className="nav-section" data-section={section.id}>
              <button className="nav-section-title" type="button">
                <span>{section.label}</span>
                <span className="material-icons-round section-chevron">expand_less</span>
              </button>
              <div className="nav-section-links">
                {section.items.map(item => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    currentPath={pathname}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        {/* Navbar */}
        <header className="navbar">
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu" title="Colapsar menú">
            <span className="material-icons-round">menu</span>
          </button>

          <div className="navbar-right">
            <div className="user-info">
              <div className="user-avatar">
                {user.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <span className="user-name">{user.nombre}</span>
                <span className="user-role">{user.rol}</span>
              </div>
            </div>
            <form action={handleLogout}>
              <button type="submit" className="btn-logout" title="Cerrar sesión">
                <span className="material-icons-round">logout</span>
                <span className="logout-text">Salir</span>
              </button>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <main className="content">
          {children}
        </main>
      </div>

      {/* Toast container */}
      <div id="ui-toasts" aria-live="polite" />

      {/* Mobile backdrop */}
      <div className="sidebar-backdrop" ref={backdropRef} onClick={closeBackdrop} />
    </>
  );
}
