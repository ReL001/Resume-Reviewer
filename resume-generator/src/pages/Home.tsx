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
  HStack,
  Badge,
  ButtonGroup,
  Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaEnvelope, FaMagic, FaDownload, FaSearch, FaChartLine, FaUpload, FaFileSignature } from 'react-icons/fa';
import { useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Feature = ({ icon, title, text, isFree = false }: { icon: any; title: string; text: string; isFree?: boolean }) => {
  return (
    <VStack spacing={4} align="start" p={5} borderRadius="md" borderWidth="1px" height="100%">
      <HStack>
        <Icon as={icon} w={10} h={10} color="blue.500" />
        {isFree && <Badge colorScheme="green">Free</Badge>}
      </HStack>
      <Heading size="md">{title}</Heading>
      <Text color={useColorModeValue('gray.600', 'gray.400')}>{text}</Text>
    </VStack>
  );
};

const Home = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated } = useAuth();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      navigate('/resume-builder', { state: { file } });
    }
  }, [navigate]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleStartFromScratch = () => {
    // Make sure to use the correct path and log for debugging
    console.log('Navigating to resume builder create form');
    
    // Use plain URL navigation instead of state-based to avoid issues
    navigate('/resume-builder/create');
  };

  return (
    <Box>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf"
        style={{ display: 'none' }}
      />

      {/* Hero Section */}
      <Box bg={bgColor} py={20}>
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading size="2xl">AI-Powered Resume Optimization</Heading>
            <Text fontSize="xl" maxW="container.md">
              Improve your resume's ATS score and stand out to employers. 
              Get instant feedback with our AI-powered tools.
            </Text>
            <VStack spacing={6} width="100%" maxW="600px">
              <Flex 
                direction={{ base: "column", md: "row" }}
                gap={4}
                width="100%"
                justify="center"
              >
                <Button
                  colorScheme="blue"
                  size="lg"
                  leftIcon={<FaUpload />}
                  onClick={triggerFileInput}
                  flex={{ base: "1", md: "initial" }}
                  data-testid="upload-resume-button"
                >
                  Upload Your Resume
                </Button>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  size="lg"
                  leftIcon={<FaFileSignature />}
                  onClick={handleStartFromScratch}
                  flex={{ base: "1", md: "initial" }}
                  data-testid="create-from-scratch"
                >
                  Create From Scratch
                </Button>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
                <Box p={3} bg="blue.50" borderRadius="md" borderWidth="1px" borderColor="blue.200">
                  <Text fontSize="sm" textAlign="center">
                    <strong>Upload</strong>: Analyze your existing resume and get feedback to improve it
                  </Text>
                </Box>
                <Box p={3} bg="blue.50" borderRadius="md" borderWidth="1px" borderColor="blue.200">
                  <Text fontSize="sm" textAlign="center">
                    <strong>Create</strong>: Build a new ATS-optimized resume with our guided form
                  </Text>
                </Box>
              </SimpleGrid>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={20}>
        <VStack mb={10}>
          <Heading size="xl" mb={4}>Our Services</Heading>
          <Text fontSize="lg" textAlign="center" maxW="container.md">
            Optimize your job application materials with our powerful AI tools
          </Text>
        </VStack>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          <Feature
            icon={FaFileAlt}
            title="AI Resume Check"
            text="Get instant AI feedback on your resume format, content, and structure."
            isFree={true}
          />
          <Feature
            icon={FaFileSignature}
            title="ATS Resume Builder"
            text="Create a professional resume from scratch with our guided form builder."
            isFree={true}
          />
          <Feature
            icon={FaSearch}
            title="ATS Check"
            text="See how well your resume performs against Applicant Tracking Systems."
            isFree={true}
          />
          <Feature
            icon={FaMagic}
            title="ATS Score Improvement"
            text="Get specific recommendations to improve your ATS score and pass resume screenings."
          />
          <Feature
            icon={FaDownload}
            title="Job Description Match"
            text="Customize your resume to match specific job descriptions and increase your chances of getting interviews."
          />
          <Feature
            icon={FaEnvelope}
            title="Cover Letter Generation"
            text="Generate tailored cover letters that complement your resume and highlight your qualifications."
          />
        </SimpleGrid>
      </Container>
      
      {/* Call to Action Section */}
      <Box bg={bgColor} py={16}>
        <Container maxW="container.xl" textAlign="center">
          <Heading size="lg" mb={6}>Ready to optimize your resume for better results?</Heading>
          <ButtonGroup spacing={{ base: 2, md: 4 }}>
            <Button
              colorScheme="blue"
              size="lg"
              leftIcon={<FaFileSignature />}
              onClick={handleStartFromScratch}
            >
              Create New Resume
            </Button>
            <Button
              colorScheme="blue"
              size="lg"
              variant="outline"
              leftIcon={<FaUpload />}
              onClick={triggerFileInput}
            >
              Analyze Existing Resume
            </Button>
          </ButtonGroup>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;