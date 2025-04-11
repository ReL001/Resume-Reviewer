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
  Image,
  Badge,
  HStack,
  Divider,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiUser, FiCheckCircle, FiTarget, FiStar, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';
const MotionBox = motion(Box);

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Home = () => {
  const navigate = useNavigate();
  
  // Colors
  const bgGradient = useColorModeValue(
    'linear(to-b, white, gray.50)',
    'linear(to-b, gray.900, gray.800)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  const ctaGradient = 'linear(to-r, brand.500, purple.500)';
  const featureBg = useColorModeValue('gray.50', 'gray.700');

  // Responsive heading size
  const headingSize = useBreakpointValue({ base: 'xl', md: '2xl', lg: '3xl' });

  return (
    <Box>
      {/* Hero Section with subtle background */}
      <Box 
        bgGradient={bgGradient} 
        position="relative"
        overflow="hidden"
      >
        {/* Decorative elements */}
        <MotionBox
          position="absolute"
          top="5%"
          left="5%"
          width="40%"
          height="40%"
          bg="brand.50"
          opacity="0.4"
          borderRadius="full"
          filter="blur(80px)"
          animate={{ 
            y: [0, 15, 0], 
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <MotionBox
          position="absolute"
          bottom="10%"
          right="5%"
          width="30%"
          height="30%"
          bg="purple.50"
          opacity="0.4"
          borderRadius="full"
          filter="blur(80px)"
          animate={{ 
            y: [0, -20, 0], 
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
      
        <Container maxW="container.xl" py={{ base: 20, md: 28 }} position="relative">
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            align="center"
            spacing={{ base: 12, md: 16 }}
          >
            {/* Hero text */}
            <Box 
              flex={1} 
              as={MotionBox}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 } as any}
            >
              <Badge 
                colorScheme="brand" 
                px={3} 
                py={1} 
                mb={6} 
                borderRadius="full" 
                fontWeight="bold"
              >
                AI-Powered Resume Builder
              </Badge>
              <Heading
                as="h1"
                size={headingSize}
                mb={6}
                lineHeight="shorter"
                fontWeight="bold"
              >
                Create ATS-Optimized Resumes with AI
              </Heading>
              <Text 
                fontSize={{ base: "lg", md: "xl" }} 
                mb={8} 
                color={textColorSecondary}
                maxW="600px"
              >
                Generate professional resumes tailored to your target jobs. Increase your interview chances with our AI-powered resume builder.
              </Text>
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={4}>
                <Button
                  size="lg"
                  bgGradient={ctaGradient}
                  color="white"
                  px={8}
                  onClick={() => navigate('/resume-builder')}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  rightIcon={<FiArrowRight />}
                  fontWeight="medium"
                  transition="all 0.3s"
                >
                  Get Started Now
                </Button>
                {/* Commenting out pricing button for MVP
                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="brand"
                  px={8}
                  onClick={() => navigate('/pricing')}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'sm',
                  }}
                  transition="all 0.3s"
                >
                  See Pricing
                </Button>
                */}
              </Stack>
            </Box>

            {/* Hero image/mockup */}
            <Flex 
              flex={1} 
              justify="center"
              as={MotionBox}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 } as any}
            >
              <Box
                boxSize={{ base: '300px', md: '450px' }}
                bg="gray.100"
                borderRadius="xl"
                p={1}
                boxShadow="xl"
                position="relative"
                overflow="hidden"
              >
                {/* You can replace this with an actual image of your resume builder UI */}
                <Image 
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070" 
                  alt="Resume builder preview" 
                  objectFit="cover"
                  width="100%"
                  height="100%"
                  borderRadius="lg"
                />

                {/* Floating elements */}
                <HStack
                  position="absolute"
                  top="10%"
                  right="5%"
                  bg="white"
                  px={3}
                  py={2}
                  borderRadius="md"
                  boxShadow="md"
                  animation={`${fadeIn} 1s ease-out 1s forwards`}
                  opacity="0"
                >
                  <Icon as={FiCheckCircle} color="green.500" />
                  <Text fontWeight="medium">ATS Optimized</Text>
                </HStack>

                <HStack
                  position="absolute"
                  bottom="10%"
                  left="5%"
                  bg="white"
                  px={3}
                  py={2}
                  borderRadius="md"
                  boxShadow="md"
                  animation={`${fadeIn} 1s ease-out 1.5s forwards`}
                  opacity="0"
                >
                  <Icon as={FiStar} color="yellow.500" />
                  <Text fontWeight="medium">Templates</Text> {/* Changed from "Premium Templates" */}
                </HStack>
              </Box>
            </Flex>
          </Stack>
        </Container>
      </Box>

      {/* Features Section with cards */}
      <Container maxW="container.xl" py={20}>
        <VStack spacing={16}>
          <Box textAlign="center" maxW="container.md" mx="auto">
            <Heading as="h2" size="xl" mb={4} fontWeight="bold">
              Why Choose Our Resume Builder?
            </Heading>
            <Text fontSize="lg" color={textColorSecondary} maxW="2xl" mx="auto">
              Our AI-powered platform helps you create professionally designed resumes that get through Applicant Tracking Systems and impress hiring managers.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} width="full">
            <Feature
              icon={FiCheckCircle}
              title="ATS-Optimized"
              text="Our AI ensures your resume gets past ATS filters with optimized keywords and formatting."
              iconColor="green.500"
              delay={0.1}
            />
            <Feature
              icon={FiTarget}
              title="Job-Specific Tailoring"
              text="Customize your resume for specific job positions to increase your chances of landing interviews."
              iconColor="blue.500"
              delay={0.3}
            />
            <Feature
              icon={FiFileText}
              title="Multiple Templates"
              text="Choose from various professional templates designed to impress in your industry."
              iconColor="purple.500"
              delay={0.5}
            />
            <Feature
              icon={FiUser}
              title="Resume Analysis"
              text="Get detailed feedback on how to improve your existing resume from our AI."
              iconColor="red.500"
              delay={0.7}
            />
            <Feature
              icon={FiStar}
              title="Cover Letters"
              text="Generate matching cover letters that complement your resume and complete your application."
              iconColor="yellow.500"
              delay={0.9}
            />
            <Feature
              icon={FiTarget}
              title="Success Tracking"
              text="Monitor your application success rate with our dashboard analytics."
              iconColor="teal.500"
              delay={1.1}
            />
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Call to Action */}
      <Box 
        bgGradient={ctaGradient} 
        py={16} 
        position="relative"
        overflow="hidden"
      >
        {/* Decorative elements */}
        <Box
          position="absolute"
          top="20%"
          left="5%"
          width="40%"
          height="40%"
          bg="white"
          opacity="0.05"
          borderRadius="full"
          filter="blur(80px)"
        />
        
        <Box
          position="absolute"
          bottom="10%"
          right="5%"
          width="30%"
          height="30%"
          bg="white"
          opacity="0.05"
          borderRadius="full"
          filter="blur(60px)"
        />
        
        <Container maxW="container.xl">
          <VStack spacing={8}>
            <Heading textAlign="center" size="xl" color="white" fontWeight="bold">
              Ready to Land Your Dream Job?
            </Heading>
            <Text fontSize="lg" textAlign="center" maxW="container.md" color="whiteAlpha.900">
              Start building your professional resume today.
              {/* Removed: No credit card required for basic features. */}
            </Text>
            <Button
              as={MotionBox}
              whileHover={{ y: -5 }}
              size="lg"
              bg="white"
              color="brand.500"
              onClick={() => navigate('/resume-builder')}
              px={10}
              _hover={{ bg: 'white' }}
              _active={{ bg: 'gray.100' }}
              fontWeight="medium"
              boxShadow="lg"
              rightIcon={<FiArrowRight />}
            >
              Create Your Resume Now
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

interface FeatureProps {
  icon: React.ElementType;
  title: string;
  text: string;
  iconColor: string;
  delay?: number;
}

const Feature = ({ icon, title, text, iconColor, delay = 0 }: FeatureProps) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.100', 'gray.700');
  
  return (
    <VStack
      as={MotionBox}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay } as any}
      align="start"
      p={6}
      borderWidth="1px"
      borderColor={cardBorder}
      borderRadius="xl"
      bg={cardBg}
      boxShadow="md"
      _hover={{ 
        transform: 'translateY(-5px',
        boxShadow: 'lg',
        borderColor: 'brand.200'
      }}
    >
      <Flex
        align="center"
        justify="center"
        w={12}
        h={12}
        borderRadius="lg"
        bg={`${iconColor}10`}
        color={iconColor}
        mb={4}
      >
        <Icon as={icon} fontSize="24px" />
      </Flex>
      <Heading size="md" mb={2} fontWeight="bold">
        {title}
      </Heading>
      <Text color="gray.600">{text}</Text>
    </VStack>
  );
};

export default Home;