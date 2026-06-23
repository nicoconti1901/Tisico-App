import { statSync } from 'fs';
import path from 'path';

/** Evita caché cuando se reemplaza fondo.jpeg con el mismo nombre */
function getFondoUrl() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'fondo1.jpg');
    const mtime = statSync(filePath).mtimeMs;
    return `/fondo1.jpg?v=${mtime}`;
  } catch {
    return '/fondo1.jpg';
  }
}

export function DashboardHomeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const fondoUrl = getFondoUrl();

  return (
    <>
      {/* Fondo fijo — cubre toda la pantalla (incluye detrás del nav) */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${fondoUrl}")` }}
        />
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="absolute inset-0 bg-linear-to-b from-blue-950/60 via-slate-950/45 to-slate-950/75" />
      </div>

      <div className="relative z-10">{children}</div>
    </>
  );
}
