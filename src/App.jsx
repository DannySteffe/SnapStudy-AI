import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Dashboard from './pages/Dashboard';
import ModuleDetails from './pages/ModuleDetails';
import LearnerView from './pages/LearnerView';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Settings from './pages/Settings';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/module/:id" element={<ModuleDetails />} />
          <Route path="/learn/:id" element={<LearnerView />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
