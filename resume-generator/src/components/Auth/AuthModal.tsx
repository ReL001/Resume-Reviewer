import React, { useState, useEffect } from 'react';
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
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
  FormErrorMessage,
  ScaleFade,
  Tooltip,
  InputLeftElement,
  HStack,
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  CircularProgress,
} from '@chakra-ui/react';
import { 
  FcGoogle 
} from 'react-icons/fc';
import { 
  FiEye, 
  FiEyeOff, 
  FiMail, 
  FiLock, 
  FiUser, 
  FiAlertCircle, 
  FiInfo, 
  FiCheckCircle,
  FiFacebook, 
  FiGithub
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  
  const { 
    signIn, 
    signUp, 
    resetPassword, 
    signInWithGoogle, 
    signInWithFacebook,
    signInWithGithub,
    error, 
    clearError 
  } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const inputBgColor = useColorModeValue('gray.50', 'gray.700');
  const socialButtonBg = useColorModeValue('white', 'gray.700');
  const facebookColor = '#1877F2';
  const githubColor = useColorModeValue('#333', '#6e5494');

  // Reset fields when modal opens or tab changes
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setDisplayName('');
      setIsResetSuccessful(false);
      clearError();
    }
  }, [isOpen, clearError, tabIndex]);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
    clearError();
  };

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    // Length check
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 2) return "red.500";
    if (passwordStrength < 4) return "orange.500";
    return "green.500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 2) return "Weak";
    if (passwordStrength < 4) return "Moderate";
    return "Strong";
  };

  // Email/Password Sign In
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!email || !password) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const userCredential = await signIn(email, password);
      
      // Verify if user is actually logged in
      if (userCredential) {
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
      } else {
        throw new Error('Login failed - no user returned');
      }
    } catch (error: any) {
      // Error is already handled in the AuthContext, but we can add additional UI feedback here
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Sign In
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
      // Error is handled in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Facebook Sign In
  const handleFacebookLogin = async () => {
    try {
      setIsSubmitting(true);
      await signInWithFacebook();
      toast({
        title: 'Welcome!',
        description: 'You have successfully signed in with Facebook.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
        variant: 'subtle',
      });
      onClose();
      navigate(redirectPath);
    } catch (error: any) {
      // Error is handled in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // GitHub Sign In
  const handleGithubLogin = async () => {
    try {
      setIsSubmitting(true);
      await signInWithGithub();
      toast({
        title: 'Welcome!',
        description: 'You have successfully signed in with GitHub.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
        variant: 'subtle',
      });
      onClose();
      navigate(redirectPath);
    } catch (error: any) {
      // Error is handled in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  // Email/Password Sign Up
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!email || !password || !displayName || !confirmPassword) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp(email, password, displayName);
      
      // Show verification dialog
      setIsVerificationDialogOpen(true);
    } catch (error: any) {
      // Error is handled in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password Reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!email) {
      toast({
        title: 'Missing information',
        description: 'Please enter your email',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPassword(email);
      setIsResetSuccessful(true);
    } catch (error: any) {
      // Error is handled in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
              {tabIndex === 0 ? 'Sign in to continue to Dr.Resume AI' : 
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
                    {/* Social Login Buttons */}
                    <HStack width="full" spacing={4}>
                      <Button
                        type="button"
                        width="full"
                        bg={socialButtonBg}
                        leftIcon={<FcGoogle size="20px" />}
                        onClick={handleGoogleLogin}
                        isLoading={isSubmitting}
                        fontWeight="medium"
                        h="44px"
                        border="1px solid"
                        borderColor={borderColor}
                        _hover={{
                          transform: 'translateY(-1px)',
                          boxShadow: 'md',
                        }}
                        transition="all 0.3s"
                        aria-label="Sign in with Google"
                      >
                        Google
                      </Button>

                      <Tooltip label="Facebook Login" aria-label="Facebook Login">
                        <Button
                          type="button"
                          bg={socialButtonBg}
                          color={facebookColor}
                          leftIcon={<Icon as={FiFacebook} boxSize={5} />}
                          onClick={handleFacebookLogin}
                          isLoading={isSubmitting}
                          fontWeight="medium"
                          h="44px"
                          borderWidth="1px"
                          borderColor={borderColor}
                          _hover={{
                            transform: 'translateY(-1px)',
                            boxShadow: 'md',
                          }}
                          transition="all 0.3s"
                          flex="1"
                          aria-label="Sign in with Facebook"
                        >
                          <Box as="span" display={{ base: 'none', sm: 'flex' }}>Facebook</Box>
                        </Button>
                      </Tooltip>
                      
                      <Tooltip label="GitHub Login" aria-label="GitHub Login">
                        <Button
                          type="button"
                          bg={socialButtonBg}
                          color={githubColor}
                          leftIcon={<Icon as={FiGithub} boxSize={5} />}
                          onClick={handleGithubLogin}
                          isLoading={isSubmitting}
                          fontWeight="medium"
                          h="44px"
                          borderWidth="1px"
                          borderColor={borderColor}
                          _hover={{
                            transform: 'translateY(-1px)',
                            boxShadow: 'md',
                          }}
                          transition="all 0.3s"
                          flex="1"
                          aria-label="Sign in with GitHub"
                        >
                          <Box as="span" display={{ base: 'none', sm: 'flex' }}>GitHub</Box>
                        </Button>
                      </Tooltip>
                    </HStack>

                    <Flex align="center" width="full">
                      <Divider />
                      <Text px={3} color="gray.500" fontSize="sm">or sign in with email</Text>
                      <Divider />
                    </Flex>
                    
                    <FormControl isInvalid={!!error}>
                      <FormLabel fontWeight="medium">Email</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FiMail color="gray.300" />
                        </InputLeftElement>
                        <Input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          size="lg"
                          bg={inputBgColor}
                        />
                      </InputGroup>
                    </FormControl>
                    
                    <FormControl isInvalid={!!error}>
                      <FormLabel fontWeight="medium">Password</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FiLock color="gray.300" />
                        </InputLeftElement>
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
                      <Flex justifyContent="flex-end" mt={2}>
                        <Text 
                          fontSize="sm" 
                          color="brand.500" 
                          cursor="pointer" 
                          fontWeight="medium"
                          onClick={() => setTabIndex(2)}
                          _hover={{ textDecoration: 'underline' }}
                        >
                          Forgot Password?
                        </Text>
                      </Flex>
                    </FormControl>
                    
                    {error && (
                      <ScaleFade initialScale={0.9} in={!!error}>
                        <Flex 
                          color="red.500" 
                          fontSize="sm" 
                          fontWeight="medium" 
                          bg="red.50" 
                          p={2} 
                          borderRadius="md" 
                          alignItems="center" 
                          width="full"
                        >
                          <Icon as={FiAlertCircle} mr={2} />
                          <Text>{error}</Text>
                        </Flex>
                      </ScaleFade>
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
                    
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      Don't have an account?{' '}
                      <Text 
                        as="span" 
                        color="brand.500" 
                        fontWeight="medium" 
                        cursor="pointer"
                        onClick={() => setTabIndex(1)}
                        _hover={{ textDecoration: 'underline' }}
                      >
                        Sign up
                      </Text>
                    </Text>
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
                    
                    <FormControl isRequired>
                      <FormLabel fontWeight="medium">Full Name</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FiUser color="gray.300" />
                        </InputLeftElement>
                        <Input 
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="John Doe"
                          size="lg"
                          bg={inputBgColor}
                        />
                      </InputGroup>
                    </FormControl>
                    
                    <FormControl isRequired isInvalid={!!error && error.includes('email')}>
                      <FormLabel fontWeight="medium">Email</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FiMail color="gray.300" />
                        </InputLeftElement>
                        <Input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          size="lg"
                          bg={inputBgColor}
                        />
                      </InputGroup>
                    </FormControl>
                    
                    <FormControl isRequired isInvalid={!!error && error.includes('password')}>
                      <FormLabel fontWeight="medium">Password</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FiLock color="gray.300" />
                        </InputLeftElement>
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
                      
                      {password && (
                        <HStack mt={2} alignItems="center">
                          <CircularProgress 
                            value={(passwordStrength / 5) * 100} 
                            color={getPasswordStrengthColor()} 
                            size="24px"
                            thickness="10px"
                          />
                          <Text 
                            fontSize="xs" 
                            color={getPasswordStrengthColor()}
                            fontWeight="medium"
                          >
                            {getPasswordStrengthText()} password
                          </Text>
                        </HStack>
                      )}
                    </FormControl>
                    
                    <FormControl isRequired isInvalid={confirmPassword !== "" && password !== confirmPassword}>
                      <FormLabel fontWeight="medium">Confirm Password</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FiLock color="gray.300" />
                        </InputLeftElement>
                        <Input 
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="********"
                          size="lg"
                          bg={inputBgColor}
                        />
                      </InputGroup>
                      {confirmPassword !== "" && password !== confirmPassword && (
                        <FormErrorMessage>Passwords do not match</FormErrorMessage>
                      )}
                    </FormControl>
                    
                    {error && (
                      <ScaleFade initialScale={0.9} in={!!error}>
                        <Flex 
                          color="red.500" 
                          fontSize="sm" 
                          fontWeight="medium" 
                          bg="red.50" 
                          p={2} 
                          borderRadius="md" 
                          alignItems="center" 
                          width="full"
                        >
                          <Icon as={FiAlertCircle} mr={2} />
                          <Text>{error}</Text>
                        </Flex>
                      </ScaleFade>
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
                    
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      Already have an account?{' '}
                      <Text 
                        as="span" 
                        color="brand.500" 
                        fontWeight="medium" 
                        cursor="pointer"
                        onClick={() => setTabIndex(0)}
                        _hover={{ textDecoration: 'underline' }}
                      >
                        Sign in
                      </Text>
                    </Text>
                  </VStack>
                </TabPanel>
                
                {/* Reset Password Panel */}
                <TabPanel px={0}>
                  {!isResetSuccessful ? (
                    <VStack as="form" onSubmit={handleResetPassword} spacing={5}>
                      <Box 
                        bg="blue.50" 
                        p={4} 
                        borderRadius="md" 
                        width="full"
                      >
                        <Flex>
                          <Icon as={FiInfo} color="blue.500" boxSize={5} mr={2} mt={0.5} />
                          <Text fontSize="sm" color="blue.700" lineHeight="1.5">
                            Enter your email address and we'll send you a link to reset your password.
                          </Text>
                        </Flex>
                      </Box>
                    
                      <FormControl isInvalid={!!error} mt={2}>
                        <FormLabel fontWeight="medium">Email</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FiMail color="gray.300" />
                          </InputLeftElement>
                          <Input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            size="lg"
                            bg={inputBgColor}
                          />
                        </InputGroup>
                      </FormControl>
                      
                      {error && (
                        <ScaleFade initialScale={0.9} in={!!error}>
                          <Flex 
                            color="red.500" 
                            fontSize="sm" 
                            fontWeight="medium" 
                            bg="red.50" 
                            p={2} 
                            borderRadius="md" 
                            alignItems="center" 
                            width="full"
                          >
                            <Icon as={FiAlertCircle} mr={2} />
                            <Text>{error}</Text>
                          </Flex>
                        </ScaleFade>
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
                      
                      <Button 
                        variant="ghost" 
                        width="100%" 
                        onClick={() => setTabIndex(0)}
                        height="44px"
                      >
                        Back to Sign In
                      </Button>
                    </VStack>
                  ) : (
                    <MotionBox 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      textAlign="center" 
                      py={6}
                    >
                      <Icon as={FiCheckCircle} color="green.500" boxSize={12} mb={4} />
                      <Heading size="md" mb={2}>Password Reset Email Sent</Heading>
                      <Text color="gray.600" mb={6}>
                        We've sent a password reset link to {email}. 
                        Please check your inbox and spam folder.
                      </Text>
                      <Button 
                        colorScheme="brand" 
                        onClick={() => setTabIndex(0)}
                        width="full"
                      >
                        Return to Sign In
                      </Button>
                    </MotionBox>
                  )}
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
      
      {/* Email Verification Dialog */}
      <AlertDialog
        isOpen={isVerificationDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          setIsVerificationDialogOpen(false);
          onClose(); // Close the parent modal too
          navigate(redirectPath); // Navigate to the redirect path
        }}
        isCentered
      >
        <AlertDialogOverlay backdropFilter="blur(4px)">
          <AlertDialogContent mx={4} borderRadius="xl" boxShadow="xl">
            <AlertDialogHeader 
              fontSize="lg" 
              fontWeight="bold"
              textAlign="center"
              pb={1}
            >
              <Icon as={FiCheckCircle} color="green.500" boxSize={10} mb={2} />
              <Heading size="md">Account Created!</Heading>
            </AlertDialogHeader>

            <AlertDialogBody textAlign="center">
              <Text mb={3}>
                We've sent a verification email to <b>{email}</b>.
              </Text>
              <Text color="gray.600">
                Please check your inbox and verify your email address to complete the registration process.
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter justifyContent="center">
              <Button 
                colorScheme="brand"
                ref={cancelRef}
                onClick={() => {
                  setIsVerificationDialogOpen(false);
                  onClose(); // Close the parent modal too
                  navigate(redirectPath); // Navigate to the redirect path
                }}
                width="full"
              >
                Continue to Dr.Resume AI
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default AuthModal;
