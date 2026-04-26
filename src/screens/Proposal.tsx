import React from 'react';
import { useStore, formatCurrencyCOP } from '../store/useStore';
import { Share2, Download, Eye, Layers, Palette, Database, Sparkles } from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

export const Proposal = () => {
  const { placedAssets, baseStoreImageUrl } = useStore();
  const navigate = useNavigate();

  const totalInvestment = placedAssets.reduce((acc, a) => acc + a.priceCOP, 0);

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Hola! Aquí tienes la propuesta de diseño para tu tienda generada con Store Builder AI.\n\nInversión Estimada: ${formatCurrencyCOP(totalInvestment)}\nActivos: ${placedAssets.length}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="flex h-full bg-surface">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <header className="flex justify-between items-end border-b border-outline-variant pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="font-mono text-[10px] text-primary uppercase tracking-widest font-bold">Generación Completada</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-on-surface">¡Propuesta Lista!</h1>
              <p className="text-on-surface-variant mt-2 max-w-2xl text-sm">Tu concepto de tienda de alta fidelidad ha sido finalizado y está listo para revisión ejecutiva.</p>
            </div>
          </header>

          {/* Interactive Rendering Box */}
          <div className="w-full aspect-[21/9] bg-surface-dim border border-outline-variant rounded-xl overflow-hidden shadow-2xl relative group">
             <BeforeAfterSlider 
               beforeImage={baseStoreImageUrl || ''}
               afterImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAv5hdoqSVNrmRGBvTcB4F2bRtwEGSNs7oWfk1zZdNeRpfs8xJVCaU0btaD0eTi8eIDn6p7tqOsoEnEfdfTRg6lEYSmDUWG0ntJw5mtRaVnBxOOMx_OeF-libkBFSBz3lY1hOEkcxsG-QO0-sGz-ggOXTNO0gyfs9tq42wOB5A0ZRDkCpN2dPYzdOFCcnWa7goJrDN93Y7opP3wr1jJAAUvfeLXoMm2u2rQQ2OiwRDWEzWD_zPt-y0TCCKgQEF_zitJwtHZTcu73FY"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
               <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-on-surface border-b border-outline-variant pb-2">Desglose de Concepto</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-bright border border-outline-variant/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Layers className="text-primary w-4 h-4" />
                      <span className="font-bold text-sm text-on-surface">Plano</span>
                    </div>
                    <p className="text-xs text-on-surface-variant font-mono">Motor de Diseño de 4 Etapas</p>
                  </div>
                  <div className="bg-surface-bright border border-outline-variant/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Palette className="text-primary w-4 h-4" />
                      <span className="font-bold text-sm text-on-surface">Estilo</span>
                    </div>
                    <p className="text-xs text-on-surface-variant font-mono">Tema Obsidiana v2.1</p>
                  </div>
                  <div className="bg-surface-bright border border-outline-variant/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Database className="text-primary w-4 h-4" />
                      <span className="font-bold text-sm text-on-surface">Activos</span>
                    </div>
                    <p className="text-xs text-on-surface-variant font-mono">{placedAssets.length} Elementos Importados</p>
                  </div>
                  <div className="bg-surface-bright border border-outline-variant/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="text-primary w-4 h-4" />
                      <span className="font-bold text-sm text-on-surface">Modelo IA</span>
                    </div>
                    <p className="text-xs text-on-surface-variant font-mono">Render Neuronal v4</p>
                  </div>
               </div>
               
               <div className="pt-4">
                  <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-on-surface border-b border-outline-variant pb-2 mb-4">Lista de Activos Utilizados</h3>
                  <div className="space-y-2">
                    {placedAssets.length > 0 ? placedAssets.map((asset) => (
                      <div key={asset.instanceId} className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                        <span className="text-sm">{asset.name} <span className="text-on-surface-variant font-mono text-[10px] ml-2">[{asset.sku}]</span></span>
                        <span className="font-mono text-xs font-bold text-primary">{formatCurrencyCOP(asset.priceCOP)}</span>
                      </div>
                    )) : (
                      <p className="text-sm text-on-surface-variant font-mono">No se agregaron activos al espacio.</p>
                    )}
                  </div>
               </div>
            </div>

            <div className="col-span-1 bg-surface-dim border border-outline-variant rounded-xl p-6 flex flex-col">
              <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-6">Resumen de Inversión</h3>
              
              <div className="text-3xl font-black text-primary mb-8 border-b border-outline-variant pb-6">
                {formatCurrencyCOP(totalInvestment)}
              </div>

              <div className="mt-auto space-y-4">
                <button 
                  onClick={handleShareWhatsApp}
                  className="w-full bg-primary text-surface font-black uppercase tracking-widest font-mono text-xs py-4 rounded hover:bg-primary-dim transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.3)] active:scale-95"
                >
                  <Share2 size={16} />
                  Compartir WhatsApp
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 bg-surface-bright text-on-surface text-[10px] font-mono uppercase tracking-widest font-bold py-3 rounded flex items-center justify-center gap-2 hover:bg-outline-variant transition-colors border border-outline-variant">
                    <Download size={14} />
                    ZIP
                  </button>
                  <button onClick={() => navigate('/workspace')} className="flex-1 bg-surface-bright text-on-surface text-[10px] font-mono uppercase tracking-widest font-bold py-3 rounded flex items-center justify-center gap-2 hover:bg-outline-variant transition-colors border border-outline-variant">
                    <Eye size={14} />
                    Editar
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
