import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import CoverLetterBuilder from './pages/CoverLetterBuilder';
import Pricing from './pages/Pricing';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
      <AuthProvider>
          <Navbar />
          <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/resume-builder"
          element={
            <PrivateRoute>
              <ResumeBuilder />
            </PrivateRoute>
          }
        />
        <Route
          path="/cover-letter-builder"
          element={
            <PrivateRoute>
              <CoverLetterBuilder />
            </PrivateRoute>
          }
        />
      </Routes>
      </AuthProvider>
  );
}

export default App;