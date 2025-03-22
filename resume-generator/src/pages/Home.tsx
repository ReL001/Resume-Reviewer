import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaFileAlt, FaEnvelope, FaMagic, FaDownload } from 'react-icons/fa';

const Feature = ({ icon, title, text }: { icon: any; title: string; text: string }) => {
  return (
    <VStack spacing={4} align="start">
      <Icon as={icon} w={10} h={10} color="blue.500" />
      <Heading size="md">{title}</Heading>
      <Text color="gray.600">{text}</Text>
    </VStack>
  );
};

const Home = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box bg={bgColor} py={20}>
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading size="2xl">AI-Powered Resume Generator</Heading>
            <Text fontSize="xl">
              Create professional resumes and cover letters with the power of AI
            </Text>
            <Box>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={() => navigate('/resume-builder')}
              >
                Get Started
              </Button>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={20}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Feature
            icon={FaFileAlt}
            title="AI-Powered Resume Generation"
            text="Create professional resumes in minutes using our advanced AI technology."
          />
          <Feature
            icon={FaEnvelope}
            title="Smart Cover Letters"
            text="Generate tailored cover letters that match your resume and job requirements."
          />
          <Feature
            icon={FaMagic}
            title="Resume Optimization"
            text="Get AI-powered suggestions to improve your resume's effectiveness."
          />
          <Feature
            icon={FaDownload}
            title="Multiple Formats"
            text="Download your documents in various formats including PDF."
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Home; 