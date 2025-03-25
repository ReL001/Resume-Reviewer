import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import CoverLetterBuilder from './pages/CoverLetterBuilder';
import Pricing from './pages/Pricing';
import PrivateRoute from './components/PrivateRoute';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { RouteDebug } from './utils/RouteDebug';

function App() {
  return (
    <AuthProvider>
      <RouteDebug />
      <Box minH="100vh" display="flex" flexDirection="column">
        <Navbar />
        <Box flex="1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Resume Builder routes - with clear tab selection */}
            <Route path="/resume-builder" element={<ResumeBuilder initialTabIndex={0} />} />
            <Route path="/resume-builder/create" element={<ResumeBuilder initialTabIndex={1} />} />
            
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
        <Box as="footer" py={4} textAlign="center" bg="gray.100" fontSize="sm" color="gray.600">
          © {new Date().getFullYear()} Resume Generator. All rights reserved.
        </Box>
      </Box>
    </AuthProvider>
  );
}

export default App;