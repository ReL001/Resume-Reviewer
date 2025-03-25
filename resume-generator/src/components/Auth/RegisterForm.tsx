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
  Flex,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface RegisterFormProps {
  onToggleForm?: () => void;
  redirectPath?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onToggleForm, 
  redirectPath = '/dashboard' 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password || !confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password should be at least 6 characters',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      toast({
        title: 'Account created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate(redirectPath);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error.message || 'Failed to create account',
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
      <form onSubmit={handleRegister}>
        <Stack spacing={4}>
          <FormControl id="register-email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </FormControl>
          <FormControl id="register-password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </FormControl>
          <FormControl id="confirm-password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
            />
          </FormControl>
          <Button
            colorScheme="blue"
            type="submit"
            isLoading={loading}
            width="full"
          >
            Create Account
          </Button>
        </Stack>
      </form>

      {onToggleForm && (
        <Flex mt={4} justify="center">
          <Text>Already have an account?</Text>
          <Text
            color="blue.500"
            fontWeight="bold"
            ml={2}
            cursor="pointer"
            onClick={onToggleForm}
            _hover={{ textDecoration: 'underline' }}
          >
            Sign in
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default RegisterForm;
