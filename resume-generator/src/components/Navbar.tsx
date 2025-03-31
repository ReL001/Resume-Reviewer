import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  Heading, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem,
  IconButton, 
  useDisclosure, 
  Avatar,
  HStack,
  Text,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Badge,
  Divider,
  MenuDivider,
  Tooltip,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMenu, FiFileText, FiMail, FiUser, FiLogOut, FiHome, FiDollarSign } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './Auth/AuthModal';
import { useState, useEffect } from 'react';

const MotionBox = motion(Box);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, isAuthenticated } = useAuth();
  const { isOpen: isAuthOpen, onOpen: onAuthOpen, onClose: onAuthClose } = useDisclosure();
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);

  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const scrolledBgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const activeColor = useColorModeValue('blue.500', 'blue.300');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const NavLink = ({ to, children, icon }: { to: string; children: React.ReactNode; icon?: React.ReactElement }) => {
    const active = isActive(to);
    
    return (
      <Button
        as={MotionBox}
        variant="ghost"
        display="flex"
        alignItems="center"
        justifyContent="center"
        whileHover={{ y: -2 }}
        // transition={{ duration: 0.2 }}
        position="relative"
        onClick={() => navigate(to)}
        color={active ? activeColor : textColor}
        fontWeight={active ? "600" : "500"}
        _hover={{ bg: hoverBgColor }}
        px={4}
        py={2}
        leftIcon={icon}
      >
        {children}
        {active && (
          <Box
            position="absolute"
            bottom="-1px"
            left="10%"
            width="80%"
            height="2px"
            bg={activeColor}
            borderRadius="full"
          />
        )}
      </Button>
    );
  };

  return (
    <>
      <Box 
        as="nav"
        position="sticky"
        top="0"
        zIndex="1000" 
        bg={scrolled ? scrolledBgColor : bgColor}
        boxShadow={scrolled ? "sm" : "none"}
        borderBottom={!scrolled ? `1px solid ${borderColor}` : "none"}
        transition="all 0.3s ease"
      >
        <Container maxW="container.xl" py={3}>
          <Flex alignItems="center" justify="space-between">
            {/* Logo */}
            <HStack spacing={2} onClick={() => navigate('/')} cursor="pointer">
              <Box 
                as={MotionBox}
                whileHover={{ scale: 1.05 }}
                bg="blue.500" 
                color="white" 
                p={2} 
                borderRadius="md"
                boxShadow="sm"
              >
                <FiFileText />
              </Box>
              <Heading size="md">ResumeGenius</Heading>
              {process.env.NODE_ENV === 'development' && (
                <Badge colorScheme="green" variant="solid" fontSize="xs">Dev</Badge>
              )}
            </HStack>

            {/* Desktop Navigation */}
            <HStack spacing={1} display={{ base: "none", md: "flex" }}>
              <NavLink to="/" icon={<FiHome />}>Home</NavLink>
              <NavLink to="/resume-builder" icon={<FiFileText />}>Resumes</NavLink>
              <NavLink to="/cover-letter-builder" icon={<FiMail />}>Cover Letters</NavLink>
              <NavLink to="/pricing" icon={<FiDollarSign />}>Pricing</NavLink>
            </HStack>

            {/* Right side - auth buttons or user menu */}
            <HStack>
              {isAuthenticated ? (
                <Menu>
                  <Tooltip label={user?.displayName || 'Account'}>
                    <MenuButton 
                      as={MotionBox} 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Avatar 
                        size="sm" 
                        name={user?.displayName || 'User'} 
                        src={user?.photoURL || undefined} 
                        cursor="pointer"
                        bg="blue.500"
                        icon={<FiUser fontSize="1.2rem" />}
                        border="2px solid"
                        borderColor={borderColor}
                      />
                    </MenuButton>
                  </Tooltip>
                  <MenuList shadow="lg" border="1px solid" borderColor={borderColor} py={2}>
                    <Text px={4} py={2} fontWeight="medium" color="gray.500">
                      {user?.email}
                    </Text>
                    <MenuDivider />
                    <MenuItem 
                      icon={<FiUser />} 
                      onClick={() => navigate('/dashboard')}
                      _hover={{ bg: hoverBgColor, color: activeColor }}
                    >
                      Dashboard
                    </MenuItem>
                    <MenuItem 
                      icon={<FiFileText />} 
                      onClick={() => navigate('/resume-builder')}
                      _hover={{ bg: hoverBgColor, color: activeColor }}
                    >
                      My Resumes
                    </MenuItem>
                    <MenuItem 
                      icon={<FiMail />} 
                      onClick={() => navigate('/cover-letter-builder')}
                      _hover={{ bg: hoverBgColor, color: activeColor }}
                    >
                      My Cover Letters
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem 
                      icon={<FiLogOut />} 
                      onClick={handleSignOut}
                      _hover={{ bg: hoverBgColor, color: "red.500" }}
                    >
                      Sign Out
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
                  <Button 
                    variant="ghost" 
                    onClick={onAuthOpen}
                    _hover={{ bg: hoverBgColor }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    as={MotionBox}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    colorScheme="blue" 
                    onClick={onAuthOpen}
                  >
                    Get Started
                  </Button>
                </HStack>
              )}

              {/* Mobile menu button */}
              <IconButton
                aria-label="Open menu"
                icon={<FiMenu />}
                variant="ghost"
                display={{ base: 'flex', md: 'none' }}
                onClick={onMenuOpen}
              />
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Mobile drawer */}
      <Drawer isOpen={isMenuOpen} placement="right" onClose={onMenuClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            {isAuthenticated ? 'Menu' : 'Navigation'}
          </DrawerHeader>
          <DrawerBody px={2} py={4}>
            <VStack spacing={1} align="stretch">
              {isAuthenticated && (
                <>
                  <Flex align="center" px={3} py={2} mb={2}>
                    <Avatar 
                      size="sm" 
                      name={user?.displayName || 'User'} 
                      src={user?.photoURL || undefined} 
                      mr={3}
                    />
                    <Box>
                      <Text fontWeight="bold" fontSize="sm">{user?.displayName || 'User'}</Text>
                      <Text fontSize="xs" color="gray.500">{user?.email}</Text>
                    </Box>
                  </Flex>
                  <Divider mb={2} />
                </>
              )}

              <Button 
                leftIcon={<FiHome />} 
                justifyContent="flex-start" 
                variant="ghost"
                isActive={isActive('/')}
                onClick={() => { navigate('/'); onMenuClose(); }}
                mb={1}
              >
                Home
              </Button>
              
              <Button 
                leftIcon={<FiFileText />} 
                justifyContent="flex-start" 
                variant="ghost"
                isActive={isActive('/resume-builder')}
                onClick={() => { navigate('/resume-builder'); onMenuClose(); }}
                mb={1}
              >
                Resume Builder
              </Button>
              
              <Button 
                leftIcon={<FiMail />} 
                justifyContent="flex-start" 
                variant="ghost"
                isActive={isActive('/cover-letter-builder')}
                onClick={() => { navigate('/cover-letter-builder'); onMenuClose(); }}
                mb={1}
              >
                Cover Letter Builder
              </Button>
              
              <Button 
                leftIcon={<FiDollarSign />} 
                justifyContent="flex-start" 
                variant="ghost"
                isActive={isActive('/pricing')}
                onClick={() => { navigate('/pricing'); onMenuClose(); }}
                mb={1}
              >
                Pricing
              </Button>
              
              {isAuthenticated && (
                <>
                  <Divider my={2} />
                  <Button 
                    leftIcon={<FiUser />} 
                    justifyContent="flex-start" 
                    variant="ghost"
                    isActive={isActive('/dashboard')}
                    onClick={() => { navigate('/dashboard'); onMenuClose(); }}
                    mb={1}
                  >
                    Dashboard
                  </Button>
                  
                  <Button 
                    leftIcon={<FiLogOut />} 
                    justifyContent="flex-start" 
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => { handleSignOut(); onMenuClose(); }}
                    mt={4}
                  >
                    Sign Out
                  </Button>
                </>
              )}
              
              {!isAuthenticated && (
                <>
                  <Divider my={2} />
                  <Button 
                    colorScheme="blue" 
                    width="full"
                    onClick={() => { onAuthOpen(); onMenuClose(); }}
                    mt={2}
                  >
                    Sign In / Register
                  </Button>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      
      <AuthModal isOpen={isAuthOpen} onClose={onAuthClose} />
    </>
  );
};

export default Navbar;