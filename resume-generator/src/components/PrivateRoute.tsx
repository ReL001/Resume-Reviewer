import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDisclosure, Center, Spinner } from '@chakra-ui/react';
import AuthModal from './Auth/AuthModal';

interface PrivateRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children,
  redirectTo = '/'
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      onOpen();
    }
  }, [loading, isAuthenticated, onOpen]);

  if (loading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Center>
    );
  }

  if (!isAuthenticated && isOpen) {
    // Show auth modal first before redirecting
    return (
      <>
        <AuthModal 
          isOpen={isOpen} 
          onClose={() => {
            onClose();
            // After closing, redirect if still not authenticated
            if (!isAuthenticated) {
              window.location.href = redirectTo;
            }
          }}
          redirectPath={location.pathname}
        />
        <Center h="50vh">
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Center>
      </>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};

export default PrivateRoute;