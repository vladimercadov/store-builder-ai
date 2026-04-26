import React, { useState } from 'react';
import { useStore, formatCurrencyCOP, AssetCategory } from '../store/useStore';
import { Search, Filter, Plus } from 'lucide-react';
import { clsx } from 'clsx';

export const AssetLibrary = () => {
  const { catalog } = useStore();
  const [filter, setFilter] = useState<AssetCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredCatalog = catalog.filter((asset) => {
    if (filter !== 'all' && asset.category !== filter) return false;
    if (search && !asset.name.toLowerCase().includes(search.toLowerCase()) && !asset.sku.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Calculate totals
  const totalValue = catalog.reduce((acc, a) => acc + (a.priceCOP * a.stock), 0);
  
  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <header className="h-16 border-b border-outline-variant bg-surface-dim/90 backdrop-blur-sm flex items-center justify-between px-8 shrink-0 z-10">
        <div className="flex items-center gap-8">
          <span className="text-lg font-black text-on-surface tracking-tighter uppercase">Biblioteca_De_Activos</span>
          <nav className="hidden lg:flex gap-6">
            {(['all', 'maniquies', 'estanteria', 'racks', 'accesorios'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={clsx(
                  "font-sans text-xs tracking-tight font-bold uppercase transition-colors",
                  filter === cat ? "text-primary" : "text-on-surface-variant hover:text-primary"
                )}
              >
                {cat === 'all' ? 'Todo' : cat}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
            <input 
              type="text" 
              placeholder="QUERY_SERIAL..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-bright border-none border-b border-outline-variant text-[10px] tracking-widest uppercase font-semibold py-2 pl-10 pr-4 w-64 focus:ring-0 focus:border-primary transition-all text-on-surface placeholder:text-outline"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8 grid-blueprint">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">INVENTARIO_VIRTUAL</h2>
            <p className="font-mono text-[10px] text-on-surface-variant mt-1 uppercase tracking-widest">{filteredCatalog.length} ARTÍCULOS SINCRONIZADOS / REGIÓN_COL</p>
          </div>
          <div className="flex gap-8">
            <div className="border-l border-outline-variant pl-4">
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">VALOR_ACTIVO</p>
              <p className="text-lg font-black text-primary">{formatCurrencyCOP(totalValue)}</p>
            </div>
            <div className="border-l border-outline-variant pl-4">
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">SALUD_INVENTARIO</p>
              <p className="text-lg font-black text-success">94.2%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCatalog.map(asset => (
            <div key={asset.id} className="group bg-surface-bright border border-outline-variant hover:border-primary/50 transition-all duration-300 flex flex-col relative overflow-hidden">
              <div className="h-64 bg-surface-dim overflow-hidden flex items-center justify-center p-8 relative">
                <div className="absolute top-3 left-3 bg-surface-dim/80 backdrop-blur-md px-2 py-1 z-10 border border-outline-variant">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-on-surface-variant uppercase">{asset.sku}</span>
                </div>
                <img 
                  src={asset.imageUrl} 
                  alt={asset.name} 
                  className={clsx(
                    "max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 scale-95 group-hover:scale-100",
                    asset.stock === 0 && "opacity-50"
                  )} 
                />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-on-surface leading-tight pr-2">{asset.name}</h3>
                  {asset.stock > 0 ? (
                    <div className="bg-success/10 text-success text-[9px] px-1.5 py-0.5 font-black tracking-widest uppercase rounded-sm whitespace-nowrap">EN STOCK</div>
                  ) : (
                    <div className="bg-red-500/10 text-red-500 text-[9px] px-1.5 py-0.5 font-black tracking-widest uppercase rounded-sm whitespace-nowrap">AGOTADO</div>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  <span className="text-[10px] font-mono text-on-surface-variant">PRECIO: <span className="text-on-surface">{formatCurrencyCOP(asset.priceCOP)}</span></span>
                  <span className="text-[10px] font-mono text-on-surface-variant">DIM: <span className="text-on-surface">{asset.dimensions}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
