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
  Image,
  Spinner
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiMenu, 
  FiFileText, 
  FiMail, 
  FiUser, 
  FiLogOut, 
  FiHome, 
  FiDollarSign, 
  FiChevronDown,
  FiSettings,
  FiHelpCircle 
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import AuthModal from './Auth/AuthModal';
import { useState, useEffect } from 'react';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, isAuthenticated, loading } = useAuth();
  const { isOpen: isAuthOpen, onOpen: onAuthOpen, onClose: onAuthClose } = useDisclosure();
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Colors
  const bgColor = useColorModeValue('white', 'gray.900');
  const scrolledBgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const activeColor = useColorModeValue('brand.500', 'brand.300');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.800');
  const menuBgColor = useColorModeValue('white', 'gray.800');
  const menuBorderColor = useColorModeValue('gray.100', 'gray.700');

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

  // Check for stored redirect path after login
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      }
    }
  }, [isAuthenticated, navigate]);

  const handleSignOut = async () => {
    try {
      setLoggingOut(true);
      await signOut();
      // Force navigate to homepage after successful logout
      navigate('/', { replace: true });
      // Show success toast if needed
    } catch (error) {
      console.error('Error signing out:', error);
      // Show error toast to user
    } finally {
      setLoggingOut(false);
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
        boxShadow={scrolled ? "md" : "none"}
        borderBottom={!scrolled ? `1px solid ${borderColor}` : "none"}
        transition="all 0.3s ease"
        backdropFilter={scrolled ? "blur(8px)" : "none"}
      >
        <Container maxW="container.xl" py={3}>
          <Flex alignItems="center" justify="space-between">
            {/* Logo */}
            <HStack spacing={2} onClick={() => navigate('/')} cursor="pointer">
              <MotionBox
                whileHover={{ scale: 1.05 }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="brand.500" 
                color="white" 
                p={2} 
                borderRadius="md"
                boxShadow="sm"
                transition={{ duration: 0.3 }}
              >
                <FiFileText />
              </MotionBox>
              <Heading size="md">Dr.Resume <Text as="span" color="brand.500" fontWeight="bold">AI</Text></Heading>
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
              {loading ? (
                <Spinner size="sm" color="brand.500" />
              ) : isAuthenticated ? (
                <Menu>
                  <MenuButton 
                    as={Button} 
                    rightIcon={<FiChevronDown />}
                    variant="ghost"
                    _hover={{ bg: hoverBgColor }}
                    display={{ base: "none", md: "flex" }}
                  >
                    <HStack>
                      <Avatar 
                        size="sm" 
                        name={user?.displayName || 'User'} 
                        src={user?.photoURL || undefined} 
                        bg="brand.500"
                      />
                      <Text display={{ base: 'none', lg: 'block' }}>{user?.displayName?.split(' ')[0] || 'User'}</Text>
                    </HStack>
                  </MenuButton>
                  <MenuList 
                    shadow="lg" 
                    border="1px solid" 
                    borderColor={menuBorderColor} 
                    bg={menuBgColor}
                    borderRadius="md"
                    py={2}
                    overflow="hidden"
                  >
                    <Box px={4} py={2}>
                      <Text fontWeight="medium" color="gray.500" fontSize="sm">
                        {user?.email}
                      </Text>
                    </Box>
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
                    <MenuItem 
                      icon={<FiSettings />} 
                      onClick={() => navigate('/account-settings')}
                      _hover={{ bg: hoverBgColor, color: activeColor }}
                    >
                      Account Settings
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem 
                      icon={loggingOut ? <Spinner size="sm" /> : <FiLogOut />} 
                      onClick={handleSignOut}
                      isDisabled={loggingOut}
                      _hover={{ bg: hoverBgColor, color: "red.500" }}
                    >
                      {loggingOut ? 'Signing Out...' : 'Sign Out'}
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
                    colorScheme="brand" 
                    onClick={onAuthOpen}
                    boxShadow="sm"
                    _hover={{ boxShadow: "md" }}
                    transition="all 0.3s"
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
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent bg={bgColor} boxShadow="xl">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
            {isAuthenticated ? 'Menu' : 'Navigation'}
          </DrawerHeader>
          <DrawerBody px={2} py={4}>
            <VStack spacing={1} align="stretch">
              {isAuthenticated && (
                <>
                  <Flex align="center" px={3} py={3} mb={2} bg={hoverBgColor} borderRadius="md">
                    <Avatar 
                      size="sm" 
                      name={user?.displayName || 'User'} 
                      src={user?.photoURL || undefined} 
                      mr={3}
                      bg="brand.500"
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
                borderRadius="md"
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
                borderRadius="md"
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
                borderRadius="md"
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
                borderRadius="md"
              >
                Pricing
              </Button>
              
              <Button 
                leftIcon={<FiHelpCircle />} 
                justifyContent="flex-start" 
                variant="ghost"
                isActive={isActive('/help')}
                onClick={() => { navigate('/help'); onMenuClose(); }}
                mb={1}
                borderRadius="md"
              >
                Help & Support
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
                    borderRadius="md"
                  >
                    Dashboard
                  </Button>
                  
                  <Button 
                    leftIcon={loggingOut ? <Spinner size="xs" /> : <FiLogOut />} 
                    justifyContent="flex-start" 
                    variant="ghost"
                    colorScheme="red"
                    onClick={async () => { 
                      await handleSignOut(); 
                      onMenuClose(); 
                    }}
                    isDisabled={loggingOut}
                    mt={4}
                    borderRadius="md"
                  >
                    {loggingOut ? 'Signing Out...' : 'Sign Out'}
                  </Button>
                </>
              )}
              
              {!isAuthenticated && (
                <>
                  <Divider my={2} />
                  <Button 
                    colorScheme="brand" 
                    width="full"
                    onClick={() => { onAuthOpen(); onMenuClose(); }}
                    mt={2}
                    boxShadow="sm"
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