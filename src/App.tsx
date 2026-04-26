/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AssetLibrary } from './screens/AssetLibrary';
import { Workspace } from './screens/Workspace';
import { ARView } from './screens/ARView';
import { Processing } from './screens/Processing';
import { Proposal } from './screens/Proposal';

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
