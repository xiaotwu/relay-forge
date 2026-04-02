import { Routes, Route, Navigate } from 'react-router-dom';
import DocLayout from './components/DocLayout';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import ArchitecturePage from './pages/ArchitecturePage';
import QuickStartPage from './pages/QuickStartPage';
import LocalDevPage from './pages/LocalDevPage';
import DeploymentPage from './pages/DeploymentPage';
import MultiCloudPage from './pages/MultiCloudPage';
import ConfigReferencePage from './pages/ConfigReferencePage';
import PermissionsPage from './pages/PermissionsPage';
import E2EEPage from './pages/E2EEPage';
import LiveKitPage from './pages/LiveKitPage';
import StoragePage from './pages/StoragePage';
import AdminGuidePage from './pages/AdminGuidePage';
import MonitoringPage from './pages/MonitoringPage';
import FAQPage from './pages/FAQPage';
import RoadmapPage from './pages/RoadmapPage';
import ContributingPage from './pages/ContributingPage';
import SecurityPage from './pages/SecurityPage';
import ChangelogPage from './pages/ChangelogPage';
import LicensePage from './pages/LicensePage';

export default function App() {
  return (
    <Routes>
      <Route element={<DocLayout />}>
        <Route index element={<HomePage />} />
        <Route path="features" element={<FeaturesPage />} />
        <Route path="architecture" element={<ArchitecturePage />} />
        <Route path="quick-start" element={<QuickStartPage />} />
        <Route path="local-dev" element={<LocalDevPage />} />
        <Route path="deployment" element={<DeploymentPage />} />
        <Route path="multi-cloud" element={<MultiCloudPage />} />
        <Route path="config" element={<ConfigReferencePage />} />
        <Route path="permissions" element={<PermissionsPage />} />
        <Route path="e2ee" element={<E2EEPage />} />
        <Route path="livekit" element={<LiveKitPage />} />
        <Route path="storage" element={<StoragePage />} />
        <Route path="admin" element={<AdminGuidePage />} />
        <Route path="monitoring" element={<MonitoringPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="roadmap" element={<RoadmapPage />} />
        <Route path="contributing" element={<ContributingPage />} />
        <Route path="security" element={<SecurityPage />} />
        <Route path="changelog" element={<ChangelogPage />} />
        <Route path="license" element={<LicensePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
