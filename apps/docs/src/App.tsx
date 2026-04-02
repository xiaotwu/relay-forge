import { Navigate, Route, Routes } from 'react-router-dom';
import DocLayout from './components/DocLayout';
import HomePage from './pages/HomePage';
import ArchitecturePage from './pages/ArchitecturePage';
import QuickStartPage from './pages/QuickStartPage';
import LocalDevPage from './pages/LocalDevPage';
import ConfigReferencePage from './pages/ConfigReferencePage';
import DeploymentPage from './pages/DeploymentPage';
import ContributingPage from './pages/ContributingPage';
import FAQPage from './pages/FAQPage';
import SecurityPage from './pages/SecurityPage';
import ServerHomePage from './pages/ServerHomePage';
import ServerArchitecturePage from './pages/ServerArchitecturePage';
import ServerOperationsPage from './pages/ServerOperationsPage';
import ServerSecurityPage from './pages/ServerSecurityPage';

export default function App() {
  return (
    <Routes>
      <Route element={<DocLayout />}>
        <Route index element={<HomePage />} />
        <Route path="architecture" element={<ArchitecturePage />} />
        <Route path="quick-start" element={<QuickStartPage />} />
        <Route path="local-dev" element={<LocalDevPage />} />
        <Route path="config" element={<ConfigReferencePage />} />
        <Route path="deployment" element={<DeploymentPage />} />
        <Route path="contributing" element={<ContributingPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="security" element={<SecurityPage />} />
        <Route path="server" element={<ServerHomePage />} />
        <Route path="server/architecture" element={<ServerArchitecturePage />} />
        <Route path="server/operations" element={<ServerOperationsPage />} />
        <Route path="server/security" element={<ServerSecurityPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
