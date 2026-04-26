import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, formatCurrencyCOP } from '../store/useStore';
import { Crosshair, Navigation2, Camera, RefreshCcw } from 'lucide-react';
import { clsx } from 'clsx';

export const ARView = () => {
  const navigate = useNavigate();
  const { placedAssets, catalog } = useStore();
  const [phase, setPhase] = useState<'scanning' | 'ready'>('scanning');

  // Estimate total investment from placed assets
  const investment = placedAssets.reduce((acc, p) => acc + p.priceCOP, 0);

  useEffect(() => {
    // Simulate floor scan taking 3 seconds
    const t = setTimeout(() => {
      setPhase('ready');
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  const handleCapture = () => {
    // Go to Processing
    navigate('/processing');
  };

  return (
    <div className="relative h-screen w-full flex flex-col justify-end items-center overflow-hidden bg-black text-white">
      {/* Top Header */}
      <header className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-black/80 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/workspace')} className="text-primary hover:bg-surface-bright transition-colors p-2 rounded">
            <RefreshCcw size={20} />
          </button>
          <span className="font-black text-white tracking-tighter text-xl uppercase">ARCHITECT_AR_V.01</span>
        </div>
        <div className="bg-primary/10 border border-primary/50 px-3 py-1 shadow-[0_0_8px_rgba(14,165,233,0.4)]">
          <span className="font-mono text-[10px] tracking-widest uppercase text-primary">
            INV. ESTIMADA: {formatCurrencyCOP(investment)}
          </span>
        </div>
      </header>

      {/* Live Camera Feed Simulation */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHr4bPEQ0tadKvus0yXaTYKiYqZiLE1u6l9FbSNrDTyiZffUXBhYGZjVLI9TMx1wEHmPtAkDiLGp-cOFkzkK2DDSG-hN_3H2_4dtRy_IKW6Ph9uvz8O4daZr7r4uVXsrCIi_u7ovCWaDbINHYtJId7auIz3qJe53FMGzQVwNX0WM50BSRH3qGRmxyXm6eeA6IvKn6PD-HK3psf8hdl4BsU9cnJ_nDLQbDYNhKV0lS69vrftHEFW412CUrUUCkJjJ_P_Dvz3ohGHMg" 
          alt="Vista de local vacío" 
          className="w-full h-full object-cover brightness-75" 
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 perspective-grid opacity-60 pointer-events-none"></div>

        {phase === 'scanning' && (
          <div className="absolute w-full h-[100px] bg-gradient-to-b from-transparent via-primary/50 to-transparent animate-[scan_3s_linear_infinite] z-10 pointer-events-none"></div>
        )}
      </div>

      {/* AR Objects Placement */}
      {phase === 'ready' && (
        <div className="absolute inset-0 flex items-center justify-center z-20" style={{ perspective: '1000px' }}>
          <div className="relative transform rotate-x-[5deg] -rotate-y-[10deg] animate-[fadeIn_0.5s_ease-out]">
            {/* Hologram Representation */}
            <div className="w-64 h-96 border-2 border-primary/40 bg-primary/5 flex flex-col justify-between p-4 shadow-[0_0_30px_rgba(14,165,233,0.15)] relative">
              <div className="h-1 bg-primary/60 w-full mb-8"></div>
              <div className="h-1 bg-primary/60 w-full mb-8"></div>
              <div className="h-1 bg-primary/60 w-full mb-8"></div>
              <div className="flex-grow flex items-center justify-center">
                <Crosshair size={48} className="text-primary/30" />
              </div>
              <div className="h-2 bg-surface w-full mt-auto"></div>

              {/* Floor shadow */}
              <div className="absolute -bottom-10 -left-4 -z-10 w-[300px] h-20" style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%)' }}></div>
            </div>

            {/* Measurement */}
            <div className="absolute -left-40 top-1/2 -translate-y-1/2 flex items-center gap-4">
              <div className="flex flex-col items-end">
                <div className="bg-black/80 border border-outline-variant px-2 py-1 flex items-center gap-2">
                  <span className="font-mono text-xs text-primary font-bold">ESCALA REAL 1:1</span>
                  <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_4px_#0ea5e9]"></span>
                </div>
                <div className="mt-2 text-on-surface-variant font-mono text-[10px]">PRECISIÓN_VERIFICADA_99.8%</div>
              </div>
              <div className="h-64 w-[2px] bg-primary relative py-1">
                <div className="absolute -left-1 w-2 h-[1px] bg-primary top-0"></div>
                <div className="absolute -left-1 w-2 h-[1px] bg-primary top-1/2"></div>
                <div className="absolute -left-1 w-2 h-[1px] bg-primary bottom-0"></div>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-primary text-[11px]">2.45m ALTURA</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HUD Info */}
      <div className="absolute top-20 left-4 z-20 flex flex-col gap-2">
        <div className="bg-black/60 border border-outline-variant p-2 backdrop-blur-sm">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase block mb-1">ESTADO</span>
          <div className="flex items-center gap-2">
            <div className={clsx("w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]", phase === 'scanning' ? "bg-amber-400 text-amber-400 animate-pulse" : "bg-primary text-primary")}></div>
            <span className="font-mono text-[11px] text-white">
              {phase === 'scanning' ? 'ESCANEO_DE_PLANTA' : 'LISTO_PARA_MAPEAR'}
            </span>
          </div>
        </div>
      </div>

      {/* Shutter Area */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4">
        {phase === 'scanning' ? (
           <div className="text-white font-mono text-sm tracking-[0.2em] animate-pulse">DETECTANDO SUPERFICIES...</div>
        ) : (
          <div className="flex flex-col items-center">
            <button onClick={handleCapture} className="group relative w-20 h-20 rounded-full border-4 border-white/30 p-1 flex items-center justify-center hover:border-white/50 transition-all">
              <div className="w-full h-full rounded-full bg-white group-active:scale-95 transition-transform"></div>
            </button>
            <span className="mt-4 font-mono font-bold text-white tracking-[0.2em] uppercase text-xs">Capturar Render</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { top: -100px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: rotateX(0deg) rotateY(0deg) scale(0.9); }
          to { opacity: 1; transform: rotateX(5deg) rotateY(-10deg) scale(1); }
        }
      `}</style>
    </div>
  );
};
