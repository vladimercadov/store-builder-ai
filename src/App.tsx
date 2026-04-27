/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 1. Cambiamos BrowserRouter por HashRouter
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AssetLibrary } from './screens/AssetLibrary';
import { Workspace } from './screens/Workspace';
import { ARView } from './screens/ARView';
import { Processing } from './screens/Processing';
import { Proposal } from './screens/Proposal';

export default function App() {
  return (
    // 2. Implementamos HashRouter para compatibilidad total con móviles y GitHub Pages
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AssetLibrary />} />
          <Route path="workspace" element={<Workspace />} />
          <Route path="ar" element={<ARView />} />
          <Route path="processing" element={<Processing />} />
          <Route path="proposal" element={<Proposal />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
