import { create } from 'zustand';

export type AssetCategory = 'maniquies' | 'racks' | 'estanteria' | 'accesorios';
export type AnchorLogic = 'floor' | 'wall';

export interface Asset {
  id: string;
  sku: string;
  name: string;
  category: AssetCategory;
  priceCOP: number;
  dimensions: string;
  anchorType: AnchorLogic;
  stock: number; // 0 for AGOTADO
  imageUrl: string;
}

export interface PlacedAsset extends Asset {
  instanceId: string;
  position: { x: number; y: number };
  rotation: number;
}

interface StoreState {
  catalog: Asset[];
  placedAssets: PlacedAsset[];
  
  // Base photo for workspace
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
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPDmY-tYcRZ77MFvQoST1vIFMKaqFMHbbcAtl3XL3za0PkHg-TqvRiRtDBdreRizNTy9nrjGpBJS6VduDgROFFcFLB8tCN38CxFDrYNV754Gyx6K9X1fYZMcISrh-rKFWruyzRokXIknoHDohIqr9SsVE6aydC-gjvjp8_4meUaH1apfemBqZPKsdeP46-eQfk8pUftpf_i46Tg3vEJJvFXc8aM1FOyS-wsE1p_afv6K6yxDbP3bqraSspuUvgziYFWw-IKXDYohg'
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
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJqS8UGtHjEM9fopHe3BOFu6rZQkH-gBCpDnL3auVhUTpRUhx26xfj01HzfZyD_4bwaFpYkbe8MVB8FQI00mEdyeDqriqwZQHlNbq9dup3BVvhIu7bog1wzvnE8TKECz_HQKD0F_RDCCwzfXFBNhbSFixVZFDyFN-QB5IXDwbuu-I37pFkVdHZ2ALvKx5wt8PVuECYW62jlV-38zwIz6oLgQgSGvIJOJYQqcxIvFXF6hPDupLw0lvDod9H449Jgrrm4Nr584Jp4oY'
  },
  {
    id: 'flr-rck',
    sku: 'TR-119',
    name: 'Perchero T Cromado 360',
    category: 'racks',
    priceCOP: 480000,
    dimensions: '160cm x 50cm',
    anchorType: 'floor',
    stock: 22,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDImxe7MkJCcqI5sMDCtT9S0v0qf6zNVnwN1cNG1uZlx-r6VKxlxvuGpkE2nwxumUoAirZFiPeal4OJy2uFTjxXrdN1EeXy4PrOr1QkCBWrhoHxpHWzLvv3ftNOonHXOz_5ZsOqO3tNav2o6hR6OPhJZ_kxE1gW1SZTdQAWkBVH6ha-MISTLntdgnANagu9Stg12oF0_hCyw5p8Nw9Xry5qMXjKlePYf1XqMM2QX0okci4dpjtm8Bg2qWyv3_EWc-HtgahDL4TsLP0'
  },
  {
    id: 'wl-lit',
    sku: 'LR-991',
    name: 'Riel LED Integrado',
    category: 'accesorios',
    priceCOP: 350000,
    dimensions: '120cm x 15cm',
    anchorType: 'wall',
    stock: 0,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsym7ABGcaMhzJkhIPP8SOWc2ClMkBlSvmZWe5fSv9VGHEUHrjOzM_4b1-r0_4yk7H7H-mCR4uBqXHNjeS-nlyrPo69d9nShxsn0FW8bMPJRj4cXgUu_hDenrmESmHZa-mIcD7KNfK18F8xn2iafpWRomqSpo8nyd1rAT8A4RlsE878LGSI0wJicVMxs23l-KbO53RGW9kN6RdrYVEog63Hbj3aCPMIdOSvVz8RHqAyqAG81AxpqCbjesfNkzNtKFyCl--IwGRGBg'
  }
];

export const useStore = create<StoreState>((set) => ({
  catalog: mockCatalog,
  placedAssets: [],
  baseStoreImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUhzn8emapubsHMCWgX5W9Sl-5dno-2r5MX6zC3hjQxcuBzT-aE0yEgUKRcncIF0IxeRsSHHBuJBrLZ_D8zHl1yQesm0kqbnS8meAREFeOYczDr6d2ODrtZ-4cpn0NVBTlHS2krRnde3KFsLoM--bA91zkN0VdOm_ZO2eCUnzQmLCqg7J69wPoL0MUKIOVaf3L8V9YSa8III6XRCEYCMmgAc-I_Y330Pr1xWnc10fiFspPqn2utti_gNboJnZu2HvQFz7MMwfyFlg',
  
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
