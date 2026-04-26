import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const Processing = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate generation progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate('/proposal'), 500); // go to final proposal
          return 100;
        }
        return p + Math.floor(Math.random() * 15);
      });
    }, 500);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex h-screen bg-surface items-center justify-center relative overflow-hidden">
      {/* Background with blur */}
      <img 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUhzn8emapubsHMCWgX5W9Sl-5dno-2r5MX6zC3hjQxcuBzT-aE0yEgUKRcncIF0IxeRsSHHBuJBrLZ_D8zHl1yQesm0kqbnS8meAREFeOYczDr6d2ODrtZ-4cpn0NVBTlHS2krRnde3KFsLoM--bA91zkN0VdOm_ZO2eCUnzQmLCqg7J69wPoL0MUKIOVaf3L8V9YSa8III6XRCEYCMmgAc-I_Y330Pr1xWnc10fiFspPqn2utti_gNboJnZu2HvQFz7MMwfyFlg" 
        alt="Processing Base"
        className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 blur-sm"
      />
      <div className="absolute inset-0 grid-blueprint opacity-30"></div>

      {/* Main Box */}
      <div className="relative z-10 w-full max-w-2xl bg-surface-dim/80 backdrop-blur-xl border border-outline-variant p-10 rounded-2xl shadow-2xl flex flex-col items-center">
        
        <div className="w-40 h-40 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center relative mb-8 animate-[spin_3s_linear_infinite]">
          <div className="absolute inset-0 flex items-center justify-center animate-[spin_3s_linear_reverse_infinite]">
            <Sparkles size={48} className="text-primary" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Procesando Mapa Neuronal...</h2>
        <p className="font-mono text-primary opacity-80 uppercase tracking-widest text-sm mb-10">
          DETECCIÓN DE OBJETOS ACTIVA // {Math.min(progress, 100)}% COMPLETADO
        </p>

        {/* Technical Progress Bars */}
        <div className="w-full space-y-4">
          <div className="p-3 bg-surface border border-outline-variant rounded hover:border-primary/50 transition-colors">
            <p className="font-mono text-[10px] text-primary mb-2">REGISTRO_ESCANEO_ESTRUCTURAL</p>
            <div className="h-1 w-full bg-outline-variant rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${Math.min(progress * 1.2, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="p-3 bg-surface border border-outline-variant rounded hover:border-primary/50 transition-colors">
            <p className="font-mono text-[10px] text-primary mb-2">SONDA_ILUMINACION.IA</p>
            <div className="h-1 w-full bg-outline-variant rounded-full overflow-hidden">
               <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min(progress * 0.8, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 px-5 py-2.5 bg-surface border border-primary/30 rounded-full">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          <span className="font-mono text-[10px] uppercase font-bold text-primary tracking-widest">Generando renderización volumétrica...</span>
        </div>
      </div>
    </div>
  );
};
