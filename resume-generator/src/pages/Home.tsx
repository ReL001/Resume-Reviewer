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
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaFileAlt, FaEnvelope, FaMagic, FaDownload, FaSearch, FaChartLine } from 'react-icons/fa';

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

  return (
    <Box>
      {/* Hero Section */}
      <Box bg={bgColor} py={20}>
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading size="2xl">AI-Powered Resume Optimization</Heading>
            <Text fontSize="xl" maxW="container.md">
              Improve your resume's ATS score and stand out to employers. 
              Upload your resume and get instant feedback with our AI-powered tools.
            </Text>
            <Box>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={() => navigate('/resume-builder')}
                mr={4}
              >
                Upload Resume
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/pricing')}
              >
                View Plans
              </Button>
            </Box>
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
            icon={FaChartLine}
            title="Detailed Resume Report"
            text="Comprehensive analysis with specific suggestions to improve your resume's effectiveness."
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
      
      {/* Call to Action */}
      <Box bg={bgColor} py={16}>
        <Container maxW="container.xl" textAlign="center">
          <Heading size="lg" mb={6}>Ready to improve your resume?</Heading>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => navigate('/resume-builder')}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;