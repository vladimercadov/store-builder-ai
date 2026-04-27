import React, { useRef, useState } from 'react';
import { useStore, Asset, formatCurrencyCOP } from '../store/useStore';
import { clsx } from 'clsx';
import { RefreshCw, Trash } from 'lucide-react';

export const Workspace = () => {
  const { baseStoreImageUrl, setBaseStoreImageUrl, catalog, placedAssets, placeAsset, updateAssetPosition, removeAsset } = useStore();
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedPlacedAsset = placedAssets.find(a => a.instanceId === selectedAssetId);

  // Función para determinar qué imagen mostrar según la posición X
  const getPerspectiveImage = (asset: any) => {
    if (!asset.views) return asset.imageUrl; // Si no tiene múltiples vistas, usa la normal
    
    const x = asset.position.x;
    if (x < 35) return asset.views.left;
    if (x > 65) return asset.views.right;
    return asset.views.front;
  };

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
            const perspectiveScale = 0.25 + (asset.position.y / 100) * 0.75;
            
            // --- AQUÍ SE ACTIVA LA MAGIA ---
            const currentImage = getPerspectiveImage(asset);
            
            return (
              <div
                key={asset.instanceId}
                draggable
                onDragStart={(e) => handleDragStart(e, asset.instanceId, true)}
                onClick={(e) => { e.stopPropagation(); setSelectedAssetId(asset.instanceId); }}
                className={clsx(
                  "absolute flex items-center justify-center cursor-move transition-all duration-150 ease-out",
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
                    src={currentImage} 
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
        </div>
      </div>

      {/* Sidebar de catálogo (mantenemos igual) */}
      <aside className="w-80 border-l border-outline-variant bg-surface flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-outline-variant bg-surface-bright/50">
          <h3 className="font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-black">Catálogo Regional COL</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
             {catalog.map(asset => (
                <div 
                  key={asset.id}
                  draggable={asset.stock > 0}
                  onDragStart={(e) => asset.stock > 0 && handleDragStart(e, asset)}
                  className={clsx(
                    "aspect-square relative bg-surface-dim border border-outline rounded-lg p-2 flex items-center justify-center group transition-all",
                    asset.stock === 0 ? "opacity-30 cursor-not-allowed" : "cursor-grab active:cursor-grabbing hover:border-primary"
                  )}
                >
                  <img src={asset.imageUrl} className="w-full h-full object-contain pointer-events-none" alt={asset.name} />
                </div>
             ))}
          </div>
        </div>
        {selectedPlacedAsset && (
           <div className="p-6">
              <h4 className="text-[11px] font-black text-primary uppercase">{selectedPlacedAsset.name}</h4>
              <p className="text-sm font-black text-on-surface mt-2">{formatCurrencyCOP(selectedPlacedAsset.priceCOP)}</p>
           </div>
        )}
      </aside>
    </div>
  );
};
