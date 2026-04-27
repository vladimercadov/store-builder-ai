import React, { useRef, useState } from 'react';
import { useStore, Asset, formatCurrencyCOP } from '../store/useStore';
import { clsx } from 'clsx';
import { RefreshCw, Trash } from 'lucide-react';

export const Workspace = () => {
  const { baseStoreImageUrl, setBaseStoreImageUrl, catalog, placedAssets, placeAsset, updateAssetPosition, removeAsset } = useStore();
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // --- ESTA ES LA LÍNEA QUE FALTABA Y CAUSABA EL ERROR ---
  const selectedPlacedAsset = placedAssets.find(a => a.instanceId === selectedAssetId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setBaseStoreImageUrl(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (e: React.DragEvent, asset: Asset | string, isInternal: boolean = false) => {
    if (isInternal) {
      e.dataTransfer.setData('movingInstanceId', asset as string);
    } else {
      e.dataTransfer.setData('application/json', JSON.stringify(asset));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const movingInstanceId = e.dataTransfer.getData('movingInstanceId');

    if (movingInstanceId) {
      updateAssetPosition(movingInstanceId, { x, y });
    } else {
      try {
        const data = e.dataTransfer.getData('application/json');
        const asset = JSON.parse(data) as Asset;
        placeAsset(asset, { x, y });
      } catch(err) { /* ignore */ }
    }
  };

  return (
    <div className="flex h-full bg-surface">
      <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8 bg-surface-dim">
        
        <div className="absolute top-6 left-6 z-50 flex gap-3">
          <label className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg cursor-pointer shadow-xl transition-all text-xs font-bold uppercase tracking-widest border border-primary/20">
            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
            <span>📂 Cargar Local</span>
          </label>
          <label className="flex items-center gap-2 bg-surface-bright border border-outline hover:bg-surface text-on-surface px-4 py-2 rounded-lg cursor-pointer shadow-xl transition-all text-xs font-bold uppercase tracking-widest">
            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
            <span>📸 Cámara</span>
          </label>
        </div>

        <div 
          ref={canvasRef}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full max-w-6xl aspect-video rounded-xl shadow-2xl relative border border-outline-variant overflow-hidden bg-black/20"
        >
          {baseStoreImageUrl ? (
            <img src={baseStoreImageUrl} className="absolute inset-0 w-full h-full object-contain" alt="Local" />
          ) : (
            <div className="absolute inset-0 bg-surface-bright flex items-center justify-center text-on-surface-variant font-mono text-sm uppercase tracking-tighter text-center px-4">
              Esperando captura de local...<br/>Carga una foto para activar el Technical Engine
            </div>
          )}
          
          <div className="absolute inset-0 perspective-grid pointer-events-none opacity-10"></div>

          {placedAssets.map(asset => {
            const isSelected = selectedAssetId === asset.instanceId;
            // Escala corregida para la profundidad del pasillo
            const perspectiveScale = 0.25 + (asset.position.y / 100) * 0.75;
            
            return (
              <div
                key={asset.instanceId}
                draggable
                onDragStart={(e) => handleDragStart(e, asset.instanceId, true)}
                onClick={(e) => { e.stopPropagation(); setSelectedAssetId(asset.instanceId); }}
                className={clsx(
                  "absolute flex items-center justify-center cursor-move transition-all duration-75",
                  isSelected ? "z-40" : "z-20"
                )}
                style={{
                  left: `${asset.position.x}%`,
                  top: `${asset.position.y}%`,
                  transform: `translate(-50%, -90%) scale(${perspectiveScale})`,
                }}
              >
                <div className="relative group">
                  <img 
                    src={asset.imageUrl} 
                    className={clsx(
                      "w-48 h-48 object-contain transition-all",
                      isSelected ? "drop-shadow-[0_0_20px_#0ea5e9]" : "drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]"
                    )} 
                    alt={asset.name} 
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/40 blur-md rounded-[100%] -z-10 scale-y-50"></div>
                  {isSelected && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2 bg-surface-bright border border-primary p-1 rounded shadow-xl">
                      <button 
                        onClick={() => { removeAsset(asset.instanceId); setSelectedAssetId(null); }}
                        className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-1.5 rounded transition-colors"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-surface/90 border border-outline p-2 px-4 rounded-full backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#0ea5e9]"></div>
            <span className="text-[10px] font-mono font-bold text-on-surface uppercase tracking-widest">
              Engine: {baseStoreImageUrl ? 'Profundidad Activa' : 'Calibrando...'}
            </span>
          </div>
        </div>
      </div>

      <aside className="w-80 border-l border-outline-variant bg-surface flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-outline-variant bg-surface-bright/50">
          <h3 className="font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-black">Catálogo Regional COL</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
             {catalog.map(asset => {
               const isOutOfStock = asset.stock === 0;
               return (
                <div 
                  key={asset.id}
                  draggable={!isOutOfStock}
                  onDragStart={(e) => !isOutOfStock && handleDragStart(e, asset)}
                  className={clsx(
                    "aspect-square relative bg-surface-dim border border-outline rounded-lg p-2 flex items-center justify-center group transition-all",
                    isOutOfStock ? "opacity-30 cursor-not-allowed" : "cursor-grab active:cursor-grabbing hover:border-primary"
                  )}
                >
                  <img src={asset.imageUrl} className="w-full h-full object-contain pointer-events-none" alt={asset.name} />
                  {!isOutOfStock && (
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-[8px] font-black text-primary bg-white px-2 py-1 rounded shadow">INSERTAR</span>
                    </div>
                  )}
                </div>
               );
             })}
          </div>
        </div>

        {selectedPlacedAsset ? (
           <div className="p-6 space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <h4 className="text-[11px] font-black text-primary uppercase tracking-widest">{selectedPlacedAsset.name}</h4>
                <div className="mt-4 pt-4 border-t border-primary/10 space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-on-surface-variant uppercase tracking-tighter">Inversión:</span>
                    <span className="font-black text-primary text-sm">{formatCurrencyCOP(selectedPlacedAsset.priceCOP)}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedAssetId(null)} className="w-full py-2 bg-surface-bright border border-outline-variant rounded-lg text-[10px] font-bold uppercase hover:bg-surface transition-colors">
                Liberar Selección
              </button>
           </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
            <RefreshCw size={24} className="mb-4 animate-spin-slow text-primary" />
            <p className="text-[9px] uppercase font-bold tracking-widest text-on-surface-variant font-mono">Workspace Activo</p>
          </div>
        )}
      </aside>
    </div>
  );
};
