'use client';

import { useEffect, useRef } from 'react';

interface Props {
  errorType?: string;
  errorMsg?: string;
  errorIcon?: string;
  loginAction: (formData: FormData) => Promise<void>;
}

export default function LoginClient({ errorType, errorMsg, errorIcon, loginAction }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // ── Background particles ──
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    interface Particle { x: number; y: number; r: number; alpha: number; vx: number; vy: number; }
    const particles: Particle[] = Array.from({ length: 38 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 3 + 1,
      alpha: Math.random() * 0.4 + 0.05,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));

    let animId: number;
    function drawParticles() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas!.width;
        if (p.x > canvas!.width) p.x = 0;
        if (p.y < 0) p.y = canvas!.height;
        if (p.y > canvas!.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(drawParticles);
    }
    drawParticles();

    // ── GSAP entrance animations ──
    import('gsap').then(({ gsap }) => {
      const card     = document.getElementById('loginCard')!;
      const logo     = document.querySelector<HTMLElement>('.login-logo')!;
      const inputs   = document.querySelectorAll<HTMLElement>('.form-group');
      const btn      = document.getElementById('loginBtn')!;
      const h1       = document.querySelector<HTMLElement>('.login-header h1')!;
      const subtitle = document.querySelector<HTMLElement>('.login-header p')!;
      const errorEl  = document.getElementById('errorCallout') as HTMLElement | null;

      gsap.set(card,    { opacity: 0, y: 48, scale: 0.94 });
      gsap.set(logo,    { scale: 0, rotation: -180 });
      gsap.set(h1,      { opacity: 0, y: 8 });
      gsap.set(subtitle,{ opacity: 0, y: 6 });
      gsap.set(inputs,  { opacity: 0, x: -18 });
      gsap.set(btn,     { opacity: 0, y: 10 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(card,    { opacity: 1, y: 0, scale: 1, duration: 0.6 })
        .to(logo,    { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.8)' }, '-=0.25')
        .to(h1,      { opacity: 1, y: 0, duration: 0.3 }, '-=0.1')
        .to(subtitle,{ opacity: 1, y: 0, duration: 0.3 }, '-=0.2')
        .to(inputs,  { opacity: 1, x: 0, duration: 0.3, stagger: 0.1 }, '-=0.15')
        .to(btn,     { opacity: 1, y: 0, duration: 0.3 }, '-=0.05');

      if (errorEl) {
        tl.to(errorEl, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0);
        tl.to(errorEl, {
          keyframes: [
            { x: -12, duration: 0.05 }, { x: 12, duration: 0.05 },
            { x: -10, duration: 0.05 }, { x: 10, duration: 0.05 },
            { x: -8,  duration: 0.05 }, { x: 8,  duration: 0.05 },
            { x: -5,  duration: 0.05 }, { x: 5,  duration: 0.05 },
            { x: 0,   duration: 0.10 },
          ],
          ease: 'power2.inOut',
        }, 0.4);
      }

      document.querySelectorAll<HTMLElement>('.form-control').forEach(el => {
        el.addEventListener('focus', () => gsap.to(el, { scale: 1.015, duration: 0.2 }));
        el.addEventListener('blur',  () => gsap.to(el, { scale: 1,     duration: 0.2 }));
      });

      document.querySelector('form')!.addEventListener('submit', () => {
        const b = document.getElementById('loginBtn') as HTMLButtonElement;
        b.innerHTML = '<span class="material-icons-round ui-spinner">refresh</span> Verificando…';
        b.disabled = true;
        gsap.to(b, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });
      });
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
      />

      <div className="login-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="login-card" id="loginCard">
          <div className="login-header">
            <div className="login-logo">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1>Admin Portal</h1>
            <p>Ingrese sus credenciales para acceder</p>
          </div>

          {errorMsg && (
            <div
              id="errorCallout"
              className="error-callout"
              data-error-type={errorType}
              style={{ opacity: 0 }}
            >
              <span className="material-icons-round error-callout-icon">{errorIcon}</span>
              <span className="error-callout-msg">{errorMsg}</span>
            </div>
          )}

          <form action={loginAction}>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email" id="email" name="email"
                className="form-control" placeholder="correo@ejemplo.com" required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password" id="password" name="password"
                className="form-control" placeholder="••••••••" required
              />
            </div>
            <button type="submit" className="btn btn-primary login-btn" id="loginBtn">
              <span className="material-icons-round" style={{ fontSize: '18px' }}>login</span>
              Iniciar Sesión
            </button>
          </form>

          <div className="login-footer">
            <p>Demo: admin@portal.com / admin123</p>
          </div>
        </div>
      </div>
    </>
  );
}
