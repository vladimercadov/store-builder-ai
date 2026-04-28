import React, { useRef } from 'react';
import { useStore, GeometryType } from '../store/useStore';
import { Box, User, Ruler, Layout, Camera, Trash2, Download } from 'lucide-react';

export const Workspace = () => {
  const { 
    sceneImage, setSceneImage, 
    placedObjects, addObject, 
    updateObject, removeObject 
  } = useStore();
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Función para manejar la carga de la foto del local
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSceneImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Lógica de "Falsa Perspectiva" para los estilos CSS
  const getObjectStyle = (obj: any): React.CSSProperties => {
    // Calculamos la escala basada en la altura (Y) para dar profundidad
    const perspectiveScale = 0.5 + (obj.position.y / 100) * 0.5;
    
    return {
      left: `${obj.position.x}%`,
      top: `${obj.position.y}%`,
      width: `${obj.size.width * perspectiveScale}%`,
      height: `${obj.size.height * perspectiveScale}%`,
      backgroundColor: obj.color,
      zIndex: Math.round(obj.position.y),
      transform: `translate(-50%, -100%) skewY(${obj.rotation}deg)`,
      opacity: 0.85,
      boxShadow: `0 ${10 * perspectiveScale}px ${20 * perspectiveScale}px rgba(0,0,0,0.3)`,
      position: 'absolute',
      cursor: 'move',
      border: '1px solid rgba(255,255,255,0.2)'
    };
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
      
      {/* 1. ÁREA DE TRABAJO (CENTRO) */}
      <div className="flex-1 relative bg-zinc-900 flex items-center justify-center p-4">
        <div 
          ref={canvasRef}
          className="relative w-full h-full max-w-4xl aspect-[9/16] md:aspect-video bg-zinc-800 rounded-xl overflow-hidden shadow-2xl border border-zinc-700"
        >
          {/* Foto del Local */}
          {sceneImage ? (
            <img src={sceneImage} className="absolute inset-0 w-full h-full object-cover" alt="Local" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
              <Camera size={48} className="mb-2" />
              <p className="text-sm">CARGAR FOTO DEL LOCAL</p>
            </div>
          )}

          {/* Renderizado de Objetos Geométricos */}
          {placedObjects.map((obj) => (
            <div
              key={obj.instanceId}
              style={getObjectStyle(obj)}
              onClick={() => {/* Seleccionar para editar */}}
              className="transition-all duration-200"
            >
              {/* Etiqueta de tipo (opcional para debug) */}
              <span className="absolute -top-6 left-0 text-[10px] font-bold uppercase tracking-tighter opacity-50">
                {obj.type}
              </span>
              
              {/* Botón de eliminar rápido */}
              <button 
                onClick={(e) => { e.stopPropagation(); removeObject(obj.instanceId); }}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. BARRA DE ACCIÓN INFERIOR (ESTILO INSTAGRAM) */}
      <div className="bg-zinc-950 border-t border-zinc-800 pb-8 pt-4 px-6">
        <div className="flex justify-between items-center max-w-md mx-auto">
          
          <ToolButton 
            icon={<Ruler />} 
            label="Riel" 
            onClick={() => addObject('rail')} 
          />
          <ToolButton 
            icon={<Layout />} 
            label="Repisa" 
            onClick={() => addObject('shelf')} 
          />
          <ToolButton 
            icon={<Box />} 
            label="Mueble" 
            onClick={() => addObject('box')} 
          />
          <ToolButton 
            icon={<User />} 
            label="Maniquí" 
            onClick={() => addObject('human-shape')} 
          />
          
          {/* Botón de Foto separado */}
          <label className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="bg-blue-600 p-3 rounded-full shadow-lg shadow-blue-900/20">
              <Camera size={20} />
            </div>
            <span className="text-[10px] font-medium opacity-70 uppercase">Foto</span>
            <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
          </label>

        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para los botones de la barra
const ToolButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
  >
    <div className="bg-zinc-800 p-3 rounded-2xl border border-zinc-700">
      {icon}
    </div>
    <span className="text-[10px] font-medium opacity-70 uppercase tracking-wider">{label}</span>
  </button>
);
