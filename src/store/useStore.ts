import { create } from 'zustand';

export type AssetCategory = 'maniquies' | 'racks' | 'estanteria' | 'accesorios';
export type AnchorLogic = 'floor' | 'wall';

// Definimos la estructura para las 3 perspectivas
export interface AssetViews {
  left: string;
  front: string;
  right: string;
}

export interface Asset {
  id: string;
  sku: string;
  name: string;
  category: AssetCategory;
  priceCOP: number;
  dimensions: string;
  anchorType: AnchorLogic;
  stock: number;
  imageUrl: string;
  // Añadimos las vistas opcionales aquí
  views?: AssetViews; 
}

export interface PlacedAsset extends Asset {
  instanceId: string;
  position: { x: number; y: number };
  rotation: number;
}

interface StoreState {
  catalog: Asset[];
  placedAssets: PlacedAsset[];
  baseStoreImageUrl: string | null;
  setBaseStoreImageUrl: (url: string) => void;
  placeAsset: (asset: Asset, position: { x: number; y: number }) => void;
  updateAssetPosition: (instanceId: string, position: { x: number; y: number }) => void;
  removeAsset: (instanceId: string) => void;
  clearWorkspace: () => void;
}

const mockCatalog: Asset[] = [
  {
    id: 'mnqn-01',
    sku: 'ST-882',
    name: 'Maniquí Femenino Abstracto A',
    category: 'maniquies',
    priceCOP: 650000,
    dimensions: '180cm x 60cm',
    anchorType: 'floor',
    stock: 15,
    imageUrl: 'assets/catalog/maniqui_front.png', // Imagen por defecto
    // IMPORTANTE: Aquí vinculamos tus 3 nuevas fotos de GitHub
    views: {
      left: 'assets/catalog/maniqui_left.png',
      front: 'assets/catalog/maniqui_front.png',
      right: 'assets/catalog/maniqui_right.png'
    }
  },
  {
    id: 'wl-sys-v',
    sku: 'RS-402',
    name: 'Sistema de Riel Modular X',
    category: 'estanteria',
    priceCOP: 1200000,
    dimensions: '240cm x 120cm',
    anchorType: 'wall',
    stock: 5,
    imageUrl: 'assets/catalog/rail_system.png'
  }
  // ... puedes mantener los otros o actualizarlos igual
];

export const useStore = create<StoreState>((set) => ({
  catalog: mockCatalog,
  placedAssets: [],
  baseStoreImageUrl: null, // Lo ideal es que empiece en null hasta cargar la foto del cliente
  
  setBaseStoreImageUrl: (url) => set({ baseStoreImageUrl: url }),
  
  placeAsset: (asset, position) => set((state) => ({
    placedAssets: [
      ...state.placedAssets,
      { ...asset, instanceId: Math.random().toString(36).substr(2, 9), position, rotation: 0 }
    ]
  })),

  updateAssetPosition: (instanceId, position) => set((state) => ({
    placedAssets: state.placedAssets.map(a => 
      a.instanceId === instanceId ? { ...a, position } : a
    )
  })),

  removeAsset: (instanceId) => set((state) => ({
    placedAssets: state.placedAssets.filter(a => a.instanceId !== instanceId)
  })),

  clearWorkspace: () => set({ placedAssets: [] })
}));

export const formatCurrencyCOP = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
