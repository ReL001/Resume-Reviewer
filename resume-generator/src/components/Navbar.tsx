import { Box, Button, Container, Flex, Heading, Spacer } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box bg="blue.500" color="white" py={4}>
      <Container maxW="container.xl">
        <Flex alignItems="center">
          <Heading size="md" cursor="pointer" onClick={() => navigate('/')}>
            Resume Generator
          </Heading>
          <Spacer />
          <Flex gap={4}>
            <Button variant="ghost" onClick={() => navigate('/pricing')}>
              Pricing
            </Button>
            {user ? (
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate('/')}>
                Sign In
              </Button>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar; 