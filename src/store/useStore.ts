import { create } from 'zustand';

// 1. Definición de Categorías según tu modelo de negocio
export type AssetCategory = 
  | '1-maniquies' 
  | '2-accesorios' 
  | '3-muebles-pago' 
  | '4-exhibidores';

export type AnchorLogic = 'floor' | 'wall';

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

// 2. Catálogo organizado por tus categorías de negocio
const mockCatalog: Asset[] = [
  {
    id: 'mnqn-dama-01',
    sku: 'MQ-D01',
    name: 'Maniquí Dama Abstracto',
    category: '1-maniquies',
    priceCOP: 650000,
    dimensions: '180cm x 60cm',
    anchorType: 'floor',
    stock: 12,
    imageUrl: 'assets/catalog/1-maniquies/dama/frontal.png',
    views: {
      left: 'assets/catalog/1-maniquies/dama/izq.png',
      front: 'assets/catalog/1-maniquies/dama/frontal.png',
      right: 'assets/catalog/1-maniquies/dama/der.png'
    }
  },
  {
    id: 'flauta-01',
    sku: 'AC-F01',
    name: 'Flauta 7 Pernos para Riel',
    category: '2-accesorios',
    priceCOP: 35000,
    dimensions: '30cm',
    anchorType: 'wall',
    stock: 50,
    imageUrl: 'assets/catalog/2-accesorios/flauta_frontal.png'
  },
  {
    id: 'pago-01',
    sku: 'MB-P01',
    name: 'Punto de Pago Minimalista L',
    category: '3-muebles-pago',
    priceCOP: 1800000,
    dimensions: '120cm x 60cm x 90cm',
    anchorType: 'floor',
    stock: 3,
    imageUrl: 'assets/catalog/3-muebles-pago/frontal.png'
  }
];

export const useStore = create<StoreState>((set) => ({
  catalog: mockCatalog,
  placedAssets: [],
  baseStoreImageUrl: null,
  
  setBaseStoreImageUrl: (url) => set({ baseStoreImageUrl: url }),
  
  placeAsset: (asset, position) => set((state) => ({
    placedAssets: [
      ...state.placedAssets,
      { ...asset, instanceId: Math.random().toString(36).substring(2, 9), position, rotation: 0 }
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
