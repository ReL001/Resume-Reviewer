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
  Box
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup' | 'forgot';
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
  
  const { signIn, signUp, resetPassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

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
        title: 'Login successful',
        description: 'Welcome back!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      navigate(redirectPath);
    } catch (error: any) {
      setError(error.message || 'Failed to log in. Please check your credentials.');
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
        title: 'Account created',
        description: 'Your account has been created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
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
        description: 'Check your email for instructions',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      setTabIndex(0); // Switch back to login tab
    } catch (error: any) {
      setError(error.message || 'Failed to send password reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg" textAlign="center">
            {tabIndex === 0 ? 'Sign In' : tabIndex === 1 ? 'Create Account' : 'Reset Password'}
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs index={tabIndex} onChange={handleTabsChange} isFitted variant="soft-rounded">
            <TabList mb={4}>
              <Tab>Sign In</Tab>
              <Tab>Sign Up</Tab>
              <Tab>Reset</Tab>
            </TabList>
            <TabPanels>
              {/* Login Panel */}
              <TabPanel>
                <VStack as="form" onSubmit={handleLogin} spacing={4}>
                  <FormControl isInvalid={!!error} isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </FormControl>
                  <FormControl isInvalid={!!error} isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                    />
                  </FormControl>
                  {error && <Text color="red.500">{error}</Text>}
                  <Button 
                    colorScheme="blue" 
                    width="100%" 
                    type="submit" 
                    isLoading={isSubmitting}
                    mt={2}
                  >
                    Sign In
                  </Button>
                </VStack>
              </TabPanel>
              
              {/* Sign Up Panel */}
              <TabPanel>
                <VStack as="form" onSubmit={handleSignup} spacing={4}>
                  <FormControl isInvalid={!!error} isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </FormControl>
                  <FormControl isInvalid={!!error} isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </FormControl>
                  <FormControl isInvalid={!!error} isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                    />
                  </FormControl>
                  {error && <Text color="red.500">{error}</Text>}
                  <Button 
                    colorScheme="blue" 
                    width="100%" 
                    type="submit" 
                    isLoading={isSubmitting}
                    mt={2}
                  >
                    Create Account
                  </Button>
                </VStack>
              </TabPanel>
              
              {/* Reset Password Panel */}
              <TabPanel>
                <VStack as="form" onSubmit={handleResetPassword} spacing={4}>
                  <Text fontSize="sm">
                    Enter your email address and we'll send you a link to reset your password.
                  </Text>
                  <FormControl isInvalid={!!error} isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </FormControl>
                  {error && <Text color="red.500">{error}</Text>}
                  <Button 
                    colorScheme="blue" 
                    width="100%" 
                    type="submit" 
                    isLoading={isSubmitting}
                    mt={2}
                  >
                    Send Reset Link
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
          
          <Divider my={6} />
          
          <Box textAlign="center">
            <Text fontSize="sm" color="gray.500">
              By signing up or logging in, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
