import React, { useRef, useState } from 'react';
import { useStore, GeometryType } from '../store/useStore';
import { Box, User, Ruler, Layout, Camera, Trash2, X } from 'lucide-react';

export const Workspace = () => {
  const { 
    sceneImage, setSceneImage, 
    placedObjects, addObject, 
    updateObject, removeObject 
  } = useStore();
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSceneImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getObjectStyle = (obj: any): React.CSSProperties => {
    const perspectiveScale = 0.5 + (obj.position.y / 100) * 0.5;
    const isSelected = selectedId === obj.instanceId;
    
    return {
      left: `${obj.position.x}%`,
      top: `${obj.position.y}%`,
      width: `${obj.size.width * perspectiveScale}%`,
      height: `${obj.size.height * perspectiveScale}%`,
      backgroundColor: obj.color,
      zIndex: Math.round(obj.position.y),
      transform: `translate(-50%, -100%) skewY(${obj.rotation}deg)`,
      opacity: isSelected ? 1 : 0.85,
      boxShadow: isSelected 
        ? `0 0 0 2px #3b82f6, 0 ${10 * perspectiveScale}px ${20 * perspectiveScale}px rgba(0,0,0,0.5)` 
        : `0 ${10 * perspectiveScale}px ${20 * perspectiveScale}px rgba(0,0,0,0.3)`,
      position: 'absolute',
      cursor: 'pointer',
      border: '1px solid rgba(255,255,255,0.2)',
      transition: 'box-shadow 0.2s, opacity 0.2s'
    };
  };

  const selectedObject = placedObjects.find(obj => obj.instanceId === selectedId);

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      
      {/* 1. ÁREA DE TRABAJO */}
      <div 
        className="flex-1 relative bg-zinc-900 flex items-center justify-center p-2 md:p-4"
        onClick={() => setSelectedId(null)}
      >
        <div 
          ref={canvasRef}
          className="relative w-full h-full max-w-4xl aspect-[9/16] md:aspect-video bg-zinc-800 rounded-xl overflow-hidden shadow-2xl border border-zinc-700"
        >
          {sceneImage ? (
            <img src={sceneImage} className="absolute inset-0 w-full h-full object-cover" alt="Local" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none">
              <Camera size={48} className="mb-2" />
              <p className="text-sm">CARGAR FOTO DEL LOCAL</p>
            </div>
          )}

          {placedObjects.map((obj) => (
            <div
              key={obj.instanceId}
              style={getObjectStyle(obj)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(obj.instanceId);
              }}
            >
              <span className="absolute -top-5 left-0 text-[9px] font-bold uppercase tracking-tighter opacity-70 bg-black/50 px-1 rounded">
                {obj.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. PANEL FLOTANTE DE EDICIÓN */}
      {selectedObject && (
        <div className="bg-zinc-900 border-t border-zinc-700 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] z-50 rounded-t-2xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Ajustar {selectedObject.type}</h3>
            <div className="flex gap-4">
              <button onClick={() => removeObject(selectedId!)} className="text-red-400 p-1"><Trash2 size={16}/></button>
              <button onClick={() => setSelectedId(null)} className="text-zinc-400 p-1"><X size={16}/></button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-[10px] font-medium opacity-80">
            <label className="flex flex-col gap-1">
              ↔️ Posición Horizontal
              <input type="range" min="0" max="100" value={selectedObject.position.x} 
                onChange={(e) => updateObject(selectedId!, { position: { ...selectedObject.position, x: Number(e.target.value) }})} 
                className="accent-blue-500" />
            </label>
            <label className="flex flex-col gap-1">
              ↕️ Profundidad (Piso)
              <input type="range" min="0" max="100" value={selectedObject.position.y} 
                onChange={(e) => updateObject(selectedId!, { position: { ...selectedObject.position, y: Number(e.target.value) }})} 
                className="accent-blue-500" />
            </label>
            <label className="flex flex-col gap-1">
              📐 Ancho
              <input type="range" min="2" max="150" value={selectedObject.size.width} 
                onChange={(e) => updateObject(selectedId!, { size: { ...selectedObject.size, width: Number(e.target.value) }})} 
                className="accent-green-500" />
            </label>
            <label className="flex flex-col gap-1">
              🔄 Inclinación (Pared)
              <input type="range" min="-45" max="45" value={selectedObject.rotation} 
                onChange={(e) => updateObject(selectedId!, { rotation: Number(e.target.value) })} 
                className="accent-purple-500" />
            </label>
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={() => updateObject(selectedId!, { color: '#d2b48c' })} className="flex-1 bg-[#d2b48c] text-black text-[10px] py-1 rounded font-bold">Madera</button>
            <button onClick={() => updateObject(selectedId!, { color: '#222222' })} className="flex-1 bg-[#222222] border border-zinc-600 text-[10px] py-1 rounded font-bold">Metal Negro</button>
            <button onClick={() => updateObject(selectedId!, { color: '#e2e8f0' })} className="flex-1 bg-[#e2e8f0] text-black text-[10px] py-1 rounded font-bold">Blanco/Cromo</button>
          </div>
        </div>
      )}

      {/* 3. BARRA DE ACCIÓN INFERIOR */}
      <div className={`bg-zinc-950 border-t border-zinc-800 pb-8 pt-4 px-6 transition-all ${selectedObject ? 'hidden' : 'block'}`}>
        <div className="flex justify-between items-center max-w-md mx-auto">
          <ToolButton icon={<Ruler />} label="Riel" onClick={() => addObject('rail')} />
          <ToolButton icon={<Layout />} label="Repisa" onClick={() => addObject('shelf')} />
          <ToolButton icon={<Box />} label="Mueble" onClick={() => addObject('box')} />
          <ToolButton icon={<User />} label="Maniquí" onClick={() => addObject('human-shape')} />
          
          <label className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-900/20 active:scale-90 transition-transform">
              <Camera size={20} />
            </div>
            <span className="text-[10px] font-medium opacity-70 uppercase tracking-wider">Local</span>
            <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
          </label>
        </div>
      </div>
    </div>
  );
};

const ToolButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
    <div className="bg-zinc-800 p-3 rounded-2xl border border-zinc-700 hover:bg-zinc-700">{icon}</div>
    <span className="text-[10px] font-medium opacity-70 uppercase tracking-wider">{label}</span>
  </button>
);
