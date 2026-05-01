// src/store/useStore.ts
import { create } from 'zustand';
import { STANDARDS } from '../constants/standards';

interface Elemento {
  id: string;
  tipo: string;
  posicion: [number, number, number];
  dimensiones: any;
  material: string;
}

interface StoreState {
  elementos: Elemento[];
  selectedId: string | null;
  historial: Elemento[][];
  setSelect: (id: string | null) => void;
  addElemento: (tipo: string) => void;
  updateMaterial: (id: string, material: string) => void;
  undo: () => void;
}

export const useStore = create<StoreState>((set) => ({
  elementos: [],
  selectedId: null,
  historial: [],

  setSelect: (id) => set({ selectedId: id }),

  addElemento: (tipo) => set((state) => {
    const nuevo = {
      id: Math.random().toString(),
      tipo,
      posicion: [0, 0, 0],
      material: 'CROMO',
      dimensiones: tipo === 'RIEL' ? STANDARDS.RIEL : STANDARDS.REPISA
    };
    const nuevosElementos = [...state.elementos, nuevo];
    // Mantener solo 5 pasos de historial
    const nuevoHistorial = [...state.historial, state.elementos].slice(-5);
    return { elementos: nuevosElementos, historial: nuevoHistorial, selectedId: nuevo.id };
  }),

  updateMaterial: (id, material) => set((state) => ({
    elementos: state.elementos.map(el => el.id === id ? { ...el, material } : el)
  })),

  undo: () => set((state) => {
    if (state.historial.length === 0) return state;
    const anterior = state.historial[state.historial.length - 1];
    return { elementos: anterior, historial: state.historial.slice(0, -1) };
  })
}));
 
