// src/screens/Workspace.tsx
import React from 'react';
import { useStore } from '../store/useStore';
import { GRADIENTES } from '../constants/standards'; // Asegúrate que el archivo se llame standards.ts

export const Workspace = () => {
  // Blindaje: asignamos un array vacío por defecto para evitar errores de .find() o .map()
  const { elementos = [], selectedId, setSelect, updateMaterial, undo, addElemento } = useStore();
  
  // Usamos el operador ?. para seguridad extrema contra el error de "reading properties of undefined"
  const elementoSeleccionado = elementos?.find(el => el.id === selectedId);

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      {/* 1. Botones de Control Superior */}
      <div className="absolute top-5 left-5 flex gap-4 z-50">
        <button 
          onClick={(e) => { e.stopPropagation(); undo(); }} 
          className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-transform active:scale-90"
          title="Deshacer"
        >
          ↩️
        </button>
        <button className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg" title="Ver Propuesta">
          👁️
        </button>
      </div>

      {/* 2. Lienzo de Diseño (Plano IA) */}
      <div 
        className="w-full h-full relative cursor-crosshair" 
        onClick={() => setSelect(null)}
      >
        {elementos?.map(el => (
          <div 
            key={el.id}
            onClick={(e) => { 
              e.stopPropagation(); 
              setSelect(el.id); 
            }}
            style={{ 
              left: `${el.posicion[0]}px`,
              top: `${el.posicion[1]}px`,
              width: el.tipo === 'RIEL' ? '10px' : '100px', // Ejemplo visual
              height: el.tipo === 'RIEL' ? '200px' : '20px',
              background: GRADIENTES[el.material as keyof typeof GRADIENTES] || '#ccc',
              zIndex: el.tipo === 'ACCESORIO' ? 10 : 5 // Z-Order automático según informe
            }}
            className={`absolute border-2 transition-all duration-200 shadow-md ${
              selectedId === el.id ? 'border-blue-400 scale-105 shadow-blue-500/50' : 'border-transparent'
            }`}
          >
            <span className="absolute -top-6 left-0 text-[10px] bg-black/50 text-white px-1 rounded">
              {el.tipo}
            </span>
          </div>
        ))}
      </div>

      {/* 3. BARRA CONTEXTUAL (Solo aparece si hay selección) */}
      {elementoSeleccionado && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/95 p-4 rounded-3xl shadow-2xl flex gap-6 items-center z-[100] animate-in fade-in zoom-in duration-300">
          {/* Selectores de Material (Círculos con Gradiente) */}
          <div className="flex gap-3 border-r border-gray-200 pr-4">
            {Object.keys(GRADIENTES).map(mat => (
              <button
                key={mat}
                onClick={() => updateMaterial(selectedId!, mat)}
                style={{ background: GRADIENTES[mat as keyof typeof GRADIENTES] }}
                className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 active:scale-95 ${
                  elementoSeleccionado.material === mat ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-300'
                }`}
                title={mat}
              />
            ))}
          </div>
          
          {/* Herramientas Rápidas del Informe Técnico */}
          <div className="flex gap-4">
            <button className="text-2xl hover:bg-gray-100 p-2 rounded-xl transition-colors" title="Añadir Accesorios">🧩</button>
            <button className="text-2xl hover:bg-gray-100 p-2 rounded-xl transition-colors" title="Ajustar Medidas (100/120/150)">📏</button>
            <button className="text-2xl hover:bg-gray-100 p-2 rounded-xl transition-colors" title="Duplicar Herraje">➕</button>
            <button className="text-2xl hover:bg-red-50 p-2 rounded-xl transition-colors text-red-500" title="Eliminar">🗑️</button>
          </div>
        </div>
      )}

      {/* Botón Flotante para Añadir (Si no hay nada seleccionado) */}
      {!selectedId && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            addElemento('RIEL'); // Acción por defecto para probar
          }}
          className="absolute bottom-10 right-10 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-full shadow-2xl transition-all active:scale-95 font-bold flex items-center gap-2"
        >
          <span className="text-xl">+</span> Añadir Herraje
        </button>
      )}
    </div>
  );
};
