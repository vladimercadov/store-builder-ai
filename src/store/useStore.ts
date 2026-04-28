import { create } from 'zustand';

// Definimos los tipos de figuras geométricas que hablamos
export type GeometryType = 'rail' | 'shelf' | 'box' | 'human-shape';

export interface DesignObject {
  instanceId: string;
  type: GeometryType;
  position: { x: number; y: number };
  size: { width: number; height: number; depth: number };
  rotation: number; // Para la perspectiva de la pared
  color: string;
  texture?: 'wood' | 'metal' | 'plastic';
}

interface DesignStore {
  sceneImage: string | null;
  placedObjects: DesignObject[];
  setSceneImage: (url: string) => void;
  addObject: (type: GeometryType) => void;
  updateObject: (id: string, updates: Partial<DesignObject>) => void;
  removeObject: (id: string) => void;
  clearScene: () => void;
}

export const useStore = create<DesignStore>((set) => ({
  sceneImage: null,
  placedObjects: [],

  setSceneImage: (url) => set({ sceneImage: url }),

  addObject: (type) => set((state) => ({
    placedObjects: [
      ...state.placedObjects,
      {
        instanceId: Math.random().toString(36).substring(7),
        type,
        position: { x: 50, y: 50 }, // Aparece en el centro
        size: { 
            width: type === 'rail' ? 2 : 20, 
            height: type === 'rail' ? 80 : 5, 
            depth: 10 
        },
        rotation: 0,
        color: type === 'rail' ? '#333' : '#ddd',
      }
    ]
  })),

  updateObject: (id, updates) => set((state) => ({
    placedObjects: state.placedObjects.map(obj => 
      obj.instanceId === id ? { ...obj, ...updates } : obj
    )
  })),

  removeObject: (id) => set((state) => ({
    placedObjects: state.placedObjects.filter(obj => obj.instanceId !== id)
  })),

  clearScene: () => set({ placedObjects: [] })
}));
