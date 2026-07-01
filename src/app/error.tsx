"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-margin-mobile gap-stack-lg">
      <div className="bg-error-container text-on-error-container p-6 rounded-2xl flex flex-col items-center gap-4 max-w-sm text-center">
        <span className="material-symbols-outlined text-[48px]">cloud_off</span>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile">Problema con la Base de Datos</h2>
        <p className="font-body-md text-body-md">No se puede conectar con la base de datos. Verifica que MongoDB esté corriendo e intenta de nuevo.</p>
        <button
          onClick={reset}
          className="mt-2 px-6 h-touch-target bg-secondary text-on-secondary rounded-lg font-title-md text-title-md active:scale-95 transition-transform"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
