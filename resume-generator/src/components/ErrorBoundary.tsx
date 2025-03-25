import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  Container,
  Code,
  Collapse,
  useDisclosure
} from '@chakra-ui/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return <ErrorFallback error={this.state.error} resetError={() => this.setState({ hasError: false, error: null })} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="start" bg="red.50" p={6} borderRadius="md" borderLeft="4px solid" borderColor="red.500">
        <Box>
          <Heading size="lg" color="red.500">
            Something went wrong
          </Heading>
          <Text mt={2} fontSize="md" color="gray.700">
            The application encountered an unexpected error. Please try refreshing the page.
          </Text>
        </Box>

        {error && (
          <>
            <Box w="100%">
              <Text fontWeight="bold" mb={2}>
                Error message:
              </Text>
              <Box bg="gray.900" color="white" p={3} borderRadius="md" fontSize="sm">
                {error.message || 'Unknown error'}
              </Box>
            </Box>

            <Button size="sm" variant="link" colorScheme="blue" onClick={onToggle}>
              {isOpen ? 'Hide Details' : 'Show Technical Details'}
            </Button>
            
            <Collapse in={isOpen} animateOpacity>
              <Box w="100%" bg="gray.100" p={4} borderRadius="md" overflowX="auto">
                <Text fontWeight="bold" mb={2}>
                  Stack trace:
                </Text>
                <Code display="block" whiteSpace="pre" p={2} fontSize="xs">
                  {error.stack || 'No stack trace available'}
                </Code>
              </Box>
            </Collapse>
          </>
        )}
        
        <Button colorScheme="blue" onClick={resetError}>
          Try Again
        </Button>
      </VStack>
    </Container>
  );
};

export default ErrorBoundary;
