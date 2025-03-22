import { Box, Flex, Button, Link, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, signInWithGoogle, logout } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bgColor} px={4} shadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Link as={RouterLink} to="/" fontWeight="bold" fontSize="xl">
            Resume Generator
          </Link>
        </Flex>

        <Flex alignItems="center" gap={4}>
          <Link as={RouterLink} to="/pricing" color="gray.600">
            Pricing
          </Link>
          {user ? (
            <>
              <Link as={RouterLink} to="/dashboard" color="gray.600">
                Dashboard
              </Link>
              <Link as={RouterLink} to="/resume-builder" color="gray.600">
                Resume Builder
              </Link>
              <Link as={RouterLink} to="/cover-letter-builder" color="gray.600">
                Cover Letter
              </Link>
              <Button onClick={logout} colorScheme="red" variant="outline">
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={signInWithGoogle} colorScheme="blue">
              Sign in with Google
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar; 