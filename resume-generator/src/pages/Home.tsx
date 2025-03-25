import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  SimpleGrid,
  Icon,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiUser, FiCheckCircle, FiTarget, FiStar } from 'react-icons/fi';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl" py={{ base: 16, md: 20 }}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            align="center"
            spacing={{ base: 8, md: 16 }}
          >
            <Box flex={1}>
              <Heading
                as="h1"
                size="2xl"
                mb={6}
                lineHeight="shorter"
              >
                Create ATS-Optimized Resumes with AI
              </Heading>
              <Text fontSize="xl" mb={8} color="gray.600">
                Generate professional resumes tailored to your target jobs. Increase your interview chances with our AI-powered resume builder.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                <Button
                  size="lg"
                  colorScheme="blue"
                  px={8}
                  onClick={() => navigate('/resume-builder')}
                >
                  Get Started Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="blue"
                  px={8}
                  onClick={() => navigate('/pricing')}
                >
                  See Pricing
                </Button>
              </Stack>
            </Box>
            <Flex flex={1} justify="center">
              <Box
                boxSize={{ base: '300px', md: '400px' }}
                bg="blue.100"
                borderRadius="md"
                p={4}
              >
                <Text textAlign="center" fontStyle="italic" color="gray.700">
                  Resume preview image placeholder
                </Text>
              </Box>
            </Flex>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={16}>
        <VStack spacing={12}>
          <Box textAlign="center" maxW="container.md" mx="auto">
            <Heading as="h2" size="xl" mb={4}>
              Why Choose Our Resume Builder?
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Our AI-powered platform helps you create professionally designed resumes that get through Applicant Tracking Systems and impress hiring managers.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            <Feature
              icon={FiCheckCircle}
              title="ATS-Optimized"
              text="Our AI ensures your resume gets past ATS filters with optimized keywords and formatting."
            />
            <Feature
              icon={FiTarget}
              title="Job-Specific Tailoring"
              text="Customize your resume for specific job positions to increase your chances of landing interviews."
            />
            <Feature
              icon={FiFileText}
              title="Multiple Templates"
              text="Choose from various professional templates designed to impress in your industry."
            />
            <Feature
              icon={FiUser}
              title="Expert Analysis"
              text="Get detailed feedback on how to improve your existing resume from our AI analysts."
            />
            <Feature
              icon={FiStar}
              title="Cover Letters"
              text="Generate matching cover letters that complement your resume and complete your application."
            />
            <Feature
              icon={FiTarget}
              title="Success Tracking"
              text="Monitor your application success rate with our dashboard analytics."
            />
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Call to Action */}
      <Box bg={useColorModeValue('blue.50', 'blue.900')} py={16}>
        <Container maxW="container.xl">
          <VStack spacing={8}>
            <Heading textAlign="center" size="xl">
              Ready to Land Your Dream Job?
            </Heading>
            <Text fontSize="lg" textAlign="center" maxW="container.md">
              Start building your professional resume today. No credit card required for basic features.
            </Text>
            <Button
              size="lg"
              colorScheme="blue"
              onClick={() => navigate('/resume-builder/create')}
              px={10}
            >
              Create Your Resume Now
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

const Feature = ({ icon, title, text }) => {
  return (
    <VStack
      align="start"
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="sm"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: 'md' }}
    >
      <Flex
        align="center"
        justify="center"
        w={12}
        h={12}
        borderRadius="md"
        bg="blue.100"
        color="blue.600"
        mb={4}
      >
        <Icon as={icon} fontSize="24px" />
      </Flex>
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      <Text color="gray.600">{text}</Text>
    </VStack>
  );
};

export default Home;