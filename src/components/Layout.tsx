import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Box, Layers, PlaySquare, Settings, Share2, Camera } from 'lucide-react';
import { clsx } from 'clsx';

export const Layout = () => {
  const location = useLocation();
  const isARView = location.pathname === '/ar' || location.pathname === '/processing';

  // In AR or Processing modes, we often hide the main sidebar to go full-screen.
  if (isARView) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-surface-dim border-r border-outline-variant flex flex-col z-40">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tighter text-primary">RETAIL_OS</h1>
          <p className="font-mono text-[10px] uppercase tracking-wider font-semibold text-on-surface-variant mt-1">Technical Engine</p>
        </div>
        
        <nav className="flex-1 space-y-1 mt-4 px-2">
          <NavLink 
            to="/" 
            className={({isActive}) => clsx(
              "flex items-center gap-3 px-4 py-3 font-mono text-[11px] uppercase tracking-wider font-semibold rounded-md transition-all",
              isActive ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-bright"
            )}
          >
            <Box size={18} />
            Biblioteca
          </NavLink>
          
          <NavLink 
            to="/workspace" 
            className={({isActive}) => clsx(
              "flex items-center gap-3 px-4 py-3 font-mono text-[11px] uppercase tracking-wider font-semibold rounded-md transition-all",
              isActive ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-bright"
            )}
          >
            <Layers size={18} />
            Workspace
          </NavLink>

          <NavLink 
            to="/proposal" 
            className={({isActive}) => clsx(
              "flex items-center gap-3 px-4 py-3 font-mono text-[11px] uppercase tracking-wider font-semibold rounded-md transition-all",
              isActive ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-bright"
            )}
          >
            <Share2 size={18} />
            Propuesta
          </NavLink>
        </nav>

        <div className="p-4 border-t border-outline-variant">
           <NavLink 
            to="/ar"
            className="w-full bg-primary text-on-surface py-3 px-4 rounded-md font-mono text-[11px] uppercase tracking-wider font-bold flex items-center justify-center gap-2 hover:bg-primary-dim transition-colors"
          >
            <Camera size={16} />
            MODO AR EN VIVO
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};
