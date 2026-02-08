import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './LandingPage';
import Dashboard from './pages/Dashboard';
import ModuleDetails from './pages/ModuleDetails';
import LearnerView from './pages/LearnerView';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/module/:id" element={<ModuleDetails />} />
              <Route path="/learn/:id" element={<LearnerView />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
