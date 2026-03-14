import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { handleLogin } from './actions';
import LoginClient from './LoginClient';

const ERROR_MESSAGES: Record<string, { msg: string; icon: string }> = {
  credentials:     { msg: 'Credenciales inválidas. Verifique su correo y contraseña.',      icon: 'lock' },
  inactive:        { msg: 'Su cuenta está desactivada. Contacte al administrador.',         icon: 'person_off' },
  session_expired: { msg: 'Su sesión ha expirado. Por favor inicie sesión nuevamente.',     icon: 'timer_off' },
  unauthorized:    { msg: 'Acceso denegado. No tiene permisos para esa sección.',           icon: 'block' },
  invalid_token:   { msg: 'Token de sesión inválido. Por favor inicie sesión nuevamente.',  icon: 'key' },
  invalid_license: { msg: 'Licencia inválida o expirada. Contacte al administrador.',      icon: 'verified_user' },
  system_error:    { msg: 'Error del sistema. Por favor intente nuevamente más tarde.',     icon: 'error' },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: urlError } = await searchParams;

  // Si ya hay sesión, redirigir
  const session = await getSession();
  if (session) redirect('/dashboard');

  const errorType = urlError && ERROR_MESSAGES[urlError] ? urlError : '';
  const errorMsg  = errorType ? ERROR_MESSAGES[errorType].msg  : '';
  const errorIcon = errorType ? ERROR_MESSAGES[errorType].icon : '';

  return (
    <>
      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
          padding: 20px;
        }
        .login-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .login-header { text-align: center; margin-bottom: 32px; }
        .login-logo {
          width: 64px; height: 64px;
          background: var(--primary-light); color: var(--primary);
          border-radius: 16px; display: flex; align-items: center;
          justify-content: center; margin: 0 auto 16px;
        }
        .login-header h1 { font-size: 1.5rem; margin-bottom: 4px; }
        .login-header p { color: var(--text-muted); font-size: 0.9rem; }
        .error-callout {
          display: flex; align-items: flex-start; gap: 10px;
          background: #fef2f2; border: 1px solid #fca5a5;
          border-left: 4px solid var(--danger); border-radius: 8px;
          padding: 12px 14px; margin-bottom: 20px; color: #991b1b;
          font-size: 0.875rem; line-height: 1.5; opacity: 0;
        }
        .error-callout[data-error-type="session_expired"],
        .error-callout[data-error-type="unauthorized"],
        .error-callout[data-error-type="invalid_token"] {
          background: #fff7ed; border-color: #fdba74;
          border-left-color: #f97316; color: #9a3412;
        }
        .error-callout[data-error-type="system_error"] {
          background: #faf5ff; border-color: #d8b4fe;
          border-left-color: #9333ea; color: #581c87;
        }
        .error-callout-icon { font-size: 18px !important; color: var(--danger); flex-shrink: 0; margin-top: 1px; }
        .login-btn { width: 100%; padding: 12px; font-size: 1rem; justify-content: center; margin-top: 8px; }
        .login-footer { text-align: center; margin-top: 24px; color: var(--text-muted); font-size: 0.8rem; }
      `}</style>
      <LoginClient errorType={errorType} errorMsg={errorMsg} errorIcon={errorIcon} loginAction={handleLogin} />
    </>
  );
}
