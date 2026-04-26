import React, { useRef, useState } from 'react';
import { useStore, Asset, formatCurrencyCOP } from '../store/useStore';
import { clsx } from 'clsx';
import { RefreshCw, ZoomIn, ZoomOut, Maximize, Plus, Copy, Trash } from 'lucide-react';

export const Workspace = () => {
  const { baseStoreImageUrl, catalog, placedAssets, placeAsset, updateAssetPosition, removeAsset } = useStore();
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, asset: Asset) => {
    e.dataTransfer.setData('application/json', JSON.stringify(asset));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    
    // Simplistic drop coordinate calculation
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    try {
      const data = e.dataTransfer.getData('application/json');
      const asset = JSON.parse(data) as Asset;
      
      // Simulate intelligent snapping
      let adjustedY = y;
      if (asset.anchorType === 'floor') {
        // Floor elements snap lower down
        adjustedY = Math.max(50, y); 
      } else if (asset.anchorType === 'wall') {
        // Wall elements snap higher up
        adjustedY = Math.min(45, y);
      }

      placeAsset(asset, { x, y: adjustedY });
    } catch(err) {
      // ignore
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const selectedPlacedAsset = placedAssets.find(a => a.instanceId === selectedAssetId);

  return (
    <div className="flex h-full bg-surface">
      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8 bg-surface-dim">
        <div 
          ref={canvasRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full max-w-6xl aspect-video rounded-xl shadow-2xl relative border border-outline-variant overflow-hidden"
        >
          {baseStoreImageUrl ? (
            <img 
              src={baseStoreImageUrl} 
              alt="Store Base" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-surface-bright flex items-center justify-center text-on-surface-variant font-mono">
              NO_BASE_IMAGE_LOADED
            </div>
          )}
          
          <div className="absolute inset-0 perspective-grid pointer-events-none opacity-40"></div>

          {/* Placed Assets */}
          {placedAssets.map(asset => {
            const isSelected = selectedAssetId === asset.instanceId;
            return (
              <div
                key={asset.instanceId}
                onClick={() => setSelectedAssetId(asset.instanceId)}
                className={clsx(
                  "absolute -translate-x-1/2 -translate-y-1/2 w-32 h-32 flex items-center justify-center cursor-move transistion-all",
                  isSelected ? "border-2 border-primary bg-primary/10 backdrop-blur-sm z-20" : "hover:border-2 hover:border-primary/50 group z-10"
                )}
                style={{
                  left: `${asset.position.x}%`,
                  top: `${asset.position.y}%`
                }}
              >
                <img 
                  src={asset.imageUrl} 
                  className={clsx(
                    "w-full h-full object-contain drop-shadow-2xl transition-all",
                    !isSelected && "grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100"
                  )} 
                  alt={asset.name} 
                />
                
                {isSelected && (
                  <>
                    {/* Handles */}
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-primary rounded-sm"></div>
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-primary rounded-sm"></div>
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-primary rounded-sm"></div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-primary rounded-sm cursor-nwse-resize"></div>
                    
                    {/* Ghost Labels */}
                    <div className="absolute -bottom-6 font-mono text-[9px] text-primary whitespace-nowrap bg-surface/80 px-1 border border-primary/30">
                      {asset.sku} [{Math.round(asset.position.x)}, {Math.round(asset.position.y)}]
                    </div>

                    <div className="absolute -right-8 -top-8 bg-surface-bright/90 border border-outline-variant p-1 flex flex-col gap-1 rounded">
                      <button onClick={(e) => { e.stopPropagation(); removeAsset(asset.instanceId); }} className="p-1 text-on-surface-variant hover:text-red-400">
                        <Trash size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-surface/90 border border-outline p-2 px-4 rounded-full backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#0ea5e9]"></div>
            <span className="text-xs font-mono font-medium text-on-surface">AI Procesando Iluminación Global...</span>
          </div>
        </div>
      </div>

      {/* Inspector Panel */}
      <aside className="w-80 border-l border-outline-variant bg-surface flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-outline-variant">
          <h3 className="font-mono text-[10px] text-on-surface uppercase tracking-widest font-bold">Catálogo de Entidades</h3>
          <p className="text-xs text-on-surface-variant mt-1">Arrastra al canvas (Escala 1:1)</p>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
             {catalog.map(asset => {
               const isOutOfStock = asset.stock === 0;
               return (
                <div 
                  key={asset.id}
                  draggable={!isOutOfStock}
                  onDragStart={(e) => !isOutOfStock && handleDragStart(e, asset)}
                  className={clsx(
                    "aspect-square relative bg-surface-bright border border-outline rounded-md p-2 flex flex-col items-center justify-center group overflow-hidden",
                    isOutOfStock ? "opacity-50 cursor-not-allowed" : "cursor-grab active:cursor-grabbing hover:border-primary"
                  )}
                >
                  <img src={asset.imageUrl} alt={asset.name} className={clsx(
                    "w-full h-full object-contain transition-all pointer-events-none",
                    !isOutOfStock && "grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"
                  )} />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-surface/50 flex items-center justify-center backdrop-blur-[1px]">
                       <span className="bg-red-500/80 text-white text-[9px] font-black tracking-widest px-2 py-0.5 uppercase border border-red-500 rounded-sm shadow-md">Agotado</span>
                    </div>
                  )}
                  {!isOutOfStock && (
                    <div className="absolute bottom-0 inset-x-0 p-1 bg-surface-dim/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                      <span className="text-[9px] text-primary font-mono tracking-widest font-bold">CARGAR</span>
                    </div>
                  )}
                </div>
               );
             })}
          </div>
        </div>

        {selectedPlacedAsset ? (
           <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-mono text-[10px] font-bold text-on-surface uppercase tracking-widest">Propiedades</h3>
                <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/30 uppercase">{selectedPlacedAsset.anchorType}</span>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block font-mono text-[9px] font-bold text-on-surface-variant mb-2 uppercase">Transformación Espacial</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[9px] text-on-surface-variant block mb-1">X Pos</span>
                      <input type="text" readOnly value={`${selectedPlacedAsset.position.x.toFixed(2)}`} className="w-full bg-surface-bright border-outline-variant rounded text-xs text-on-surface focus:ring-primary font-mono px-2 py-1" />
                    </div>
                    <div>
                      <span className="text-[9px] text-on-surface-variant block mb-1">Y Pos</span>
                      <input type="text" readOnly value={`${selectedPlacedAsset.position.y.toFixed(2)}`} className="w-full bg-surface-bright border-outline-variant rounded text-xs text-on-surface focus:ring-primary font-mono px-2 py-1" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-outline-variant">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest min-w-16">Referencia SKU:</span>
                    <span className="text-xs font-mono text-on-surface font-bold">{selectedPlacedAsset.sku}</span>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest min-w-16">Dimensiones:</span>
                    <span className="text-xs font-mono text-on-surface">{selectedPlacedAsset.dimensions}</span>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest min-w-16">Inversión Unit.:</span>
                    <span className="text-xs font-mono text-primary font-bold">{formatCurrencyCOP(selectedPlacedAsset.priceCOP)}</span>
                  </div>
                </div>

              </div>
           </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-center text-on-surface-variant font-mono text-xs opacity-60">
            Selecciona un objeto en el canvas para editar sus propiedades.
          </div>
        )}
      </aside>
    </div>
  );
};
