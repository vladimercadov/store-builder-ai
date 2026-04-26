import React, { useRef, useState } from 'react';
import { useStore, Asset, formatCurrencyCOP } from '../store/useStore';
import { clsx } from 'clsx';
import { RefreshCw, ZoomIn, ZoomOut, Maximize, Plus, Copy, Trash, Image as ImageIcon, Camera } from 'lucide-react';

export const Workspace = () => {
  // 1. Extraemos setBaseStoreImageUrl del store
  const { baseStoreImageUrl, setBaseStoreImageUrl, catalog, placedAssets, placeAsset, updateAssetPosition, removeAsset } = useStore();
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // 2. Función para procesar la imagen del local (PC o Dispositivo)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBaseStoreImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (e: React.DragEvent, asset: Asset) => {
    e.dataTransfer.setData('application/json', JSON.stringify(asset));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    try {
      const data = e.dataTransfer.getData('application/json');
      const asset = JSON.parse(data) as Asset;
      
      let adjustedY = y;
      if (asset.anchorType === 'floor') {
        adjustedY = Math.max(50, y); 
      } else if (asset.anchorType === 'wall') {
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
        
        {/* PANEL DE CONTROL DE CARGA (NUEVO) */}
        <div className="absolute top-6 left-6 z-50 flex gap-3">
          <label className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg cursor-pointer shadow-xl transition-all text-xs font-bold uppercase tracking-widest border border-primary/20">
            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
            <ImageIcon size={16} /> Cargar Local
          </label>
          <label className="flex items-center gap-2 bg-surface-bright border border-outline hover:bg-surface text-on-surface px-4 py-2 rounded-lg cursor-pointer shadow-xl transition-all text-xs font-bold uppercase tracking-widest">
            <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} hidden />
            <Camera size={16} /> Cámara
          </label>
        </div>

        <div 
          ref={canvasRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full max-w-6xl aspect-video rounded-xl shadow-2xl relative border border-outline-variant overflow-hidden bg-black/20"
        >
          {baseStoreImageUrl ? (
            <img 
              src={baseStoreImageUrl} 
              alt="Store Base" 
              className="absolute inset-0 w-full h-full object-contain" // Cambiado a contain para ver toda la foto del cliente
            />
          ) : (
            <div className="absolute inset-0 bg-surface-bright flex items-center justify-center text-on-surface-variant font-mono text-sm">
              ESPERANDO FOTO DEL LOCAL...
            </div>
          )}
          
          <div className="absolute inset-0 perspective-grid pointer-events-none opacity-20"></div>

          {/* Placed Assets (Renderizado de los objetos) */}
          {placedAssets.map(asset => {
            const isSelected = selectedAssetId === asset.instanceId;
            return (
              <div
                key={asset.instanceId}
                onClick={(e) => { e.stopPropagation(); setSelectedAssetId(asset.instanceId); }}
                className={clsx(
                  "absolute -translate-x-1/2 -translate-y-1/2 w-40 h-40 flex items-center justify-center cursor-move transition-all",
                  isSelected ? "z-30" : "z-10"
                )}
                style={{
                  left: `${asset.position.x}%`,
                  top: `${asset.position.y}%`
                }}
              >
                <div className={clsx(
                  "relative w-full h-full flex items-center justify-center transition-transform",
                  isSelected && "scale-110"
                )}>
                  <img 
                    src={asset.imageUrl} 
                    className={clsx(
                      "w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transition-all",
                      !isSelected && "opacity-90 hover:opacity-100"
                    )} 
                    alt={asset.name} 
                  />
                  {isSelected && (
                    <div className="absolute inset-0 border-2 border-primary rounded-lg shadow-[0_0_15px_rgba(14,165,233,0.4)]">
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer hover:bg-red-600 shadow-lg"
                           onClick={(e) => { e.stopPropagation(); removeAsset(asset.instanceId); setSelectedAssetId(null); }}>
                        <Trash size={12} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-surface/90 border border-outline p-2 px-4 rounded-full backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#0ea5e9]"></div>
            <span className="text-[10px] font-mono font-bold text-on-surface uppercase tracking-tighter">
              {baseStoreImageUrl ? 'Motor Técnico: Calibrando Espacio Real' : 'Esperando Entrada de Imagen...'}
            </span>
          </div>
        </div>
      </div>

      {/* Inspector Panel (Derecha) */}
      <aside className="w-80 border-l border-outline-variant bg-surface flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-outline-variant bg-surface-bright/50">
          <h3 className="font-mono text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-black">Catálogo Regional COL</h3>
          <p className="text-[10px] text-primary mt-1 font-bold">PRECIOS SINCRONIZADOS</p>
          
          <div className="mt-4 grid grid-cols-2 gap-3">
             {catalog.map(asset => {
               const isOutOfStock = asset.stock === 0;
               return (
                <div 
                  key={asset.id}
                  draggable={!isOutOfStock}
                  onDragStart={(e) => !isOutOfStock && handleDragStart(e, asset)}
                  className={clsx(
                    "aspect-square relative bg-surface-dim border border-outline rounded-lg p-2 flex flex-col items-center justify-center group transition-all",
                    isOutOfStock ? "opacity-40 cursor-not-allowed" : "cursor-grab active:cursor-grabbing hover:border-primary hover:shadow-lg hover:shadow-primary/10"
                  )}
                >
                  <img src={asset.imageUrl} alt={asset.name} className="w-full h-full object-contain pointer-events-none" />
                  <div className="absolute bottom-0 inset-x-0 p-1 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center rounded-b-lg">
                    <span className="text-[8px] text-white font-black uppercase">Arrastrar</span>
                  </div>
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm">AGOTADO</span>
                    </div>
                  )}
                </div>
               );
             })}
          </div>
        </div>

        {/* Detalles del objeto seleccionado */}
        {selectedPlacedAsset ? (
           <div className="p-6 space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <h4 className="text-[11px] font-black text-primary uppercase tracking-widest mb-1">{selectedPlacedAsset.name}</h4>
                <p className="text-[10px] text-on-surface-variant font-mono">{selectedPlacedAsset.sku}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase font-bold text-on-surface-variant">Inversión:</span>
                    <span className="text-sm font-black text-primary">{formatCurrencyCOP(selectedPlacedAsset.priceCOP)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase font-bold text-on-surface-variant">Dimensión:</span>
                    <span className="text-[10px] font-mono text-on-surface">{selectedPlacedAsset.dimensions}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAssetId(null)}
                className="w-full py-2 bg-surface-bright border border-outline-variant rounded-lg text-[10px] font-bold uppercase hover:bg-surface transition-colors"
              >
                Cerrar Inspector
              </button>
           </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
            <RefreshCw size={32} className="mb-4 animate-spin-slow text-primary" />
            <p className="font-mono text-[10px] uppercase tracking-widest">Workspace Activo</p>
            <p className="text-[9px] mt-2">Arrastra un elemento para iniciar la propuesta técnica.</p>
          </div>
        )}
      </aside>
    </div>
  );
};
