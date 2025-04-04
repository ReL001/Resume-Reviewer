import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormErrorMessage,
  useToast,
  VStack,
  Heading,
  Divider,
  Box,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup' | 'reset';
  redirectPath?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  redirectPath = '/'
}) => {
  const [tabIndex, setTabIndex] = useState(initialTab === 'login' ? 0 : initialTab === 'signup' ? 1 : 2);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, signUp, resetPassword, signInWithGoogle } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const inputBgColor = useColorModeValue('gray.50', 'gray.700');

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn(email, password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
        variant: 'subtle',
      });
      onClose();
      navigate(redirectPath);
    } catch (error: any) {
      setError(error.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      await signInWithGoogle();
      toast({
        title: 'Welcome!',
        description: 'You have successfully signed in with Google.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
        variant: 'subtle',
      });
      onClose();
      navigate(redirectPath);
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password || !displayName) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp(email, password, displayName);
      toast({
        title: 'Account created successfully!',
        description: 'Welcome to ResumeGenius.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
        variant: 'subtle',
      });
      onClose();
      navigate(redirectPath);
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPassword(email);
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for instructions to reset your password.',
        status: 'info',
        duration: 5000,
        isClosable: true,
        position: 'top',
        variant: 'subtle',
      });
      setTabIndex(0); // Switch back to login tab
    } catch (error: any) {
      setError(error.message || 'Failed to send password reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="md" 
      motionPreset="slideInBottom"
      isCentered
    >
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent 
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="xl"
        overflow="hidden"
        boxShadow="xl"
        mx={4}
      >
        <ModalHeader pb={0}>
          <Heading size="lg" textAlign="center" fontWeight="bold" pb={2}>
            {tabIndex === 0 ? 'Welcome Back' : tabIndex === 1 ? 'Create Account' : 'Reset Password'}
          </Heading>
          <Text fontSize="sm" textAlign="center" color="gray.500" px={8} mt={1}>
            {tabIndex === 0 ? 'Sign in to continue to ResumeGenius' : 
             tabIndex === 1 ? 'Join and start creating professional resumes' : 
             'Enter your email to receive a reset link'}
          </Text>
        </ModalHeader>
        <ModalCloseButton size="lg" />
        <ModalBody pb={8} px={{ base: 4, md: 8 }} pt={6}>
          <Tabs 
            index={tabIndex} 
            onChange={handleTabsChange} 
            isFitted 
            variant="soft-rounded"
            colorScheme="brand"
            mb={6}
          >
            <TabList mb={5}>
              <Tab 
                fontWeight="medium"
                _selected={{ color: 'brand.500', bg: 'brand.50' }}
              >
                Sign In
              </Tab>
              <Tab 
                fontWeight="medium"
                _selected={{ color: 'brand.500', bg: 'brand.50' }}
              >
                Sign Up
              </Tab>
              <Tab 
                fontWeight="medium"
                _selected={{ color: 'brand.500', bg: 'brand.50' }}
              >
                Reset
              </Tab>
            </TabList>
            <TabPanels>
              {/* Login Panel */}
              <TabPanel px={0}>
                <VStack as="form" onSubmit={handleLogin} spacing={5}>
                  <Button
                    type="button"
                    width="full"
                    variant="outline"
                    leftIcon={<FcGoogle size="20px" />}
                    onClick={handleGoogleLogin}
                    isLoading={isSubmitting}
                    fontWeight="medium"
                    height="44px"
                    border="1px solid"
                    borderColor={borderColor}
                    _hover={{
                      transform: 'translateY(-1px)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.3s"
                  >
                    Continue with Google
                  </Button>

                  <Flex align="center" width="full">
                    <Divider />
                    <Text px={3} color="gray.500" fontSize="sm">or sign in with email</Text>
                    <Divider />
                  </Flex>
                  
                  <FormControl isInvalid={!!error} isRequired>
                    <FormLabel fontWeight="medium">Email</FormLabel>
                    <Input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      size="lg"
                      bg={inputBgColor}
                    />
                  </FormControl>
                  <FormControl isInvalid={!!error} isRequired>
                    <FormLabel fontWeight="medium">Password</FormLabel>
                    <InputGroup>
                      <Input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        size="lg"
                        bg={inputBgColor}
                      />
                      <InputRightElement width="3.5rem" h="full">
                        <IconButton
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          h="1.75rem"
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowPassword(!showPassword)}
                          icon={showPassword ? <FiEyeOff /> : <FiEye />}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  {error && (
                    <Text color="red.500" fontSize="sm" fontWeight="medium">
                      {error}
                    </Text>
                  )}
                  <Button 
                    colorScheme="brand" 
                    width="100%" 
                    type="submit" 
                    isLoading={isSubmitting}
                    mt={3}
                    height="44px"
                    boxShadow="sm"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.2s"
                  >
                    Sign In
                  </Button>
                </VStack>
              </TabPanel>
              
              {/* Sign Up Panel */}
              <TabPanel px={0}>
                <VStack as="form" onSubmit={handleSignup} spacing={5}>
                  <Button
                    type="button"
                    width="full"
                    variant="outline"
                    leftIcon={<FcGoogle size="20px" />}
                    onClick={handleGoogleLogin}
                    isLoading={isSubmitting}
                    fontWeight="medium"
                    height="44px"
                    border="1px solid"
                    borderColor={borderColor}
                    _hover={{
                      transform: 'translateY(-1px)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.3s"
                  >
                    Continue with Google
                  </Button>

                  <Flex align="center" width="full">
                    <Divider />
                    <Text px={3} color="gray.500" fontSize="sm">or create account with email</Text>
                    <Divider />
                  </Flex>
                  
                  <FormControl isInvalid={!!error} isRequired>
                    <FormLabel fontWeight="medium">Name</FormLabel>
                    <Input 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="John Doe"
                      size="lg"
                      bg={inputBgColor}
                    />
                  </FormControl>
                  <FormControl isInvalid={!!error} isRequired>
                    <FormLabel fontWeight="medium">Email</FormLabel>
                    <Input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      size="lg"
                      bg={inputBgColor}
                    />
                  </FormControl>
                  <FormControl isInvalid={!!error} isRequired>
                    <FormLabel fontWeight="medium">Password</FormLabel>
                    <InputGroup>
                      <Input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        size="lg"
                        bg={inputBgColor}
                      />
                      <InputRightElement width="3.5rem" h="full">
                        <IconButton
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          h="1.75rem"
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowPassword(!showPassword)}
                          icon={showPassword ? <FiEyeOff /> : <FiEye />}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Password must be at least 6 characters
                    </Text>
                  </FormControl>
                  {error && (
                    <Text color="red.500" fontSize="sm" fontWeight="medium">
                      {error}
                    </Text>
                  )}
                  <Button 
                    colorScheme="brand" 
                    width="100%" 
                    type="submit" 
                    isLoading={isSubmitting}
                    mt={2}
                    height="44px"
                    boxShadow="sm"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.2s"
                  >
                    Create Account
                  </Button>
                </VStack>
              </TabPanel>
              
              {/* Reset Password Panel */}
              <TabPanel px={0}>
                <VStack as="form" onSubmit={handleResetPassword} spacing={5}>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    Enter your email address and we'll send you a link to reset your password.
                  </Text>
                  <FormControl isInvalid={!!error} isRequired mt={2}>
                    <FormLabel fontWeight="medium">Email</FormLabel>
                    <Input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      size="lg"
                      bg={inputBgColor}
                    />
                  </FormControl>
                  {error && (
                    <Text color="red.500" fontSize="sm" fontWeight="medium">
                      {error}
                    </Text>
                  )}
                  <Button 
                    colorScheme="brand" 
                    width="100%" 
                    type="submit" 
                    isLoading={isSubmitting}
                    mt={2}
                    height="44px"
                    boxShadow="sm"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                    }}
                    transition="all 0.2s"
                  >
                    Send Reset Link
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
          
          <Box textAlign="center" mt={6}>
            <Text fontSize="sm" color="gray.500" lineHeight="1.6">
              By signing up or logging in, you agree to our{' '}
              <Text as="span" color="brand.500" fontWeight="medium" cursor="pointer">
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text as="span" color="brand.500" fontWeight="medium" cursor="pointer">
                Privacy Policy
              </Text>
              .
            </Text>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
