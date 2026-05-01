// src/screens/Workspace.tsx (Fragmento de UI)
import { useStore } from '../store/useStore';
import { GRADIENTES } from '../constants/standards';

export const Workspace = () => {
  const { elementos, selectedId, setSelect, updateMaterial, undo } = useStore();
  const elementoSeleccionado = elementos.find(el => el.id === selectedId);

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* 1. Botones de Control Superior */}
      <div className="absolute top-5 left-5 flex gap-4 z-50">
        <button onClick={undo} className="p-2 bg-white rounded-full">↩️</button>
        <button className="p-2 bg-white rounded-full">👁️</button>
      </div>

      {/* 2. Lienzo de Diseño (Plano IA) */}
      <div className="w-full h-full" onClick={() => setSelect(null)}>
        {elementos.map(el => (
          <div 
            key={el.id}
            onClick={(e) => { e.stopPropagation(); setSelect(el.id); }}
            style={{ 
              transform: `translate(${el.posicion[0]}px, ${el.posicion[1]}px)`,
              background: GRADIENTES[el.material as keyof typeof GRADIENTES],
              zIndex: el.tipo === 'ACCESORIO' ? 5 : 2 // Z-Order automático
            }}
            className={`absolute border ${selectedId === el.id ? 'border-blue-500' : 'border-transparent'}`}
          >
            {el.tipo}
          </div>
        ))}
      </div>

      {/* 3. BARRA CONTEXTUAL (Solo aparece si hay selección) */}
      {elementoSeleccionado && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/90 p-4 rounded-2xl shadow-xl flex gap-6 items-center z-50 animate-in slide-in-from-bottom-5">
          {/* Selectores de Material (Círculos con Gradiente) */}
          <div className="flex gap-2 border-r pr-4">
            {Object.keys(GRADIENTES).map(mat => (
              <button
                key={mat}
                onClick={() => updateMaterial(selectedId!, mat)}
                style={{ background: GRADIENTES[mat as keyof typeof GRADIENTES] }}
                className="w-8 h-8 rounded-full border border-gray-300"
              />
            ))}
          </div>
          
          {/* Herramientas Rápidas */}
          <button className="text-2xl">🧩</button> {/* Accesorios */}
          <button className="text-2xl">📏</button> {/* Dimensionar */}
          <button className="text-2xl">➕</button> {/* Duplicar */}
          <button className="text-2xl text-red-500">🗑️</button>
        </div>
      )}

      {/* Botón Flotante para Añadir (Si no hay nada seleccionado) */}
      {!selectedId && (
        <button className="absolute bottom-10 right-10 bg-blue-600 text-white p-4 rounded-full shadow-2xl">
          + Añadir Herraje
        </button>
      )}
    </div>
  );
};
