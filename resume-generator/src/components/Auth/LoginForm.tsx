import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  Divider,
  Flex,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onToggleForm?: () => void;
  redirectPath?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onToggleForm, 
  redirectPath = '/dashboard'
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 2000,
      });
      navigate(redirectPath);
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'Failed to sign in',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 2000,
      });
      navigate(redirectPath);
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        title: 'Google login failed',
        description: error.message || 'Failed to sign in with Google',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box py={4}>
      <form onSubmit={handleEmailLogin}>
        <Stack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </FormControl>
          <Button
            colorScheme="blue"
            type="submit"
            isLoading={loading}
            width="full"
          >
            Sign In
          </Button>
        </Stack>
      </form>

      <Divider my={6} />
      
      <Button
        width="full"
        variant="outline"
        leftIcon={<FcGoogle />}
        onClick={handleGoogleLogin}
        isLoading={loading}
      >
        Sign in with Google
      </Button>
      
      {onToggleForm && (
        <Flex mt={4} justify="center">
          <Text>Don't have an account?</Text>
          <Text
            color="blue.500"
            fontWeight="bold"
            ml={2}
            cursor="pointer"
            onClick={onToggleForm}
            _hover={{ textDecoration: 'underline' }}
          >
            Sign up
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default LoginForm;
