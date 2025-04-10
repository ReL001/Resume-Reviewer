import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDisclosure, Center, Spinner, Box, Text, VStack, Button, useToast } from '@chakra-ui/react';
import AuthModal from './Auth/AuthModal';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface PrivateRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children,
  redirectTo = '/',
  requiredRoles = []
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const toast = useToast();

  // Open auth modal when user is not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Store the intended destination to redirect after login
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
      onOpen();
    }
  }, [loading, isAuthenticated, onOpen, location.pathname]);

  // Check if user has required roles
  const hasRequiredRoles = () => {
    if (requiredRoles.length === 0) return true;
    
    // If we implemented roles in user.customClaims, we would check here
    // For now, we'll assume all authenticated users have access
    return true;
  };

  if (loading) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Spinner 
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="brand.500"
            size="xl"
          />
          <Text color="gray.500">Loading...</Text>
        </VStack>
      </Center>
    );
  }

  if (!isAuthenticated) {
    // Show auth modal and placeholder content when not authenticated
    return (
      <>
        <AuthModal 
          isOpen={isOpen} 
          onClose={() => {
            onClose();
            // Keep the redirect path in session storage even if they close modal
          }}
          redirectPath={location.pathname}
        />
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Center h="70vh" flexDirection="column" px={4} textAlign="center">
            <VStack spacing={6} maxW="md">
              <Text fontSize="xl" fontWeight="medium">
                Please sign in to access this page
              </Text>
              <Text color="gray.500">
                You need to be signed in to view and manage your resumes and cover letters.
              </Text>
              <Button 
                colorScheme="brand" 
                size="lg"
                onClick={onOpen}
              >
                Sign In or Register
              </Button>
            </VStack>
          </Center>
        </MotionBox>
      </>
    );
  }

  // Check for required roles
  if (!hasRequiredRoles()) {
    toast({
      title: "Access denied",
      description: "You don't have permission to access this page",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return <Navigate to={redirectTo} />;
  }

  // User is authenticated and has required roles
  return <>{children}</>;
};

export default PrivateRoute;