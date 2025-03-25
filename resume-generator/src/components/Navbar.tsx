import { Box, Button, Container, Flex, Heading, Spacer, Menu, MenuButton, MenuList, MenuItem, IconButton, useDisclosure, Avatar } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMenu } from 'react-icons/fi';
import AuthModal from './Auth/AuthModal';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut, isAuthenticated } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <Box bg="blue.500" color="white" py={4}>
        <Container maxW="container.xl">
          <Flex alignItems="center">
            <Heading size="md" cursor="pointer" onClick={() => navigate('/')}>
              Resume Generator
            </Heading>
            <Spacer />
            <Flex gap={4} display={{ base: 'none', md: 'flex' }}>
              <Button variant="ghost" onClick={() => navigate('/pricing')}>
                Pricing
              </Button>
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" onClick={() => navigate('/resume-builder')}>
                    Resume Builder
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/cover-letter-builder')}>
                    Cover Letter
                  </Button>
                  <Menu>
                    <MenuButton as={Button} variant="ghost">
                      <Avatar size="xs" name={user?.displayName || 'User'} src={user?.photoURL || undefined} />
                    </MenuButton>
                    <MenuList color="gray.800">
                      <MenuItem onClick={() => navigate('/dashboard')}>Dashboard</MenuItem>
                      <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                    </MenuList>
                  </Menu>
                </>
              ) : (
                <Button variant="outline" onClick={onOpen}>
                  Sign In
                </Button>
              )}
            </Flex>
            
            {/* Mobile menu */}
            <Box display={{ base: 'block', md: 'none' }}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<FiMenu />}
                  variant="ghost"
                />
                <MenuList color="gray.800">
                  <MenuItem onClick={() => navigate('/pricing')}>Pricing</MenuItem>
                  {isAuthenticated ? (
                    <>
                      <MenuItem onClick={() => navigate('/resume-builder')}>Resume Builder</MenuItem>
                      <MenuItem onClick={() => navigate('/cover-letter-builder')}>Cover Letter</MenuItem>
                      <MenuItem onClick={() => navigate('/dashboard')}>Dashboard</MenuItem>
                      <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                    </>
                  ) : (
                    <MenuItem onClick={onOpen}>Sign In</MenuItem>
                  )}
                </MenuList>
              </Menu>
            </Box>
          </Flex>
        </Container>
      </Box>
      
      <AuthModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Navbar;