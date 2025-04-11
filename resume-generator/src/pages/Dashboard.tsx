import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Icon,
  Progress,
  useColorModeValue,
  Flex,
  Grid,
  GridItem,
  Image,
  Tag,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiMail, FiDownload, FiEdit, FiPlus, FiCheck, FiAward, FiClock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.100', 'gray.700');
  const statsBgGradient = useColorModeValue(
    'linear(to-r, blue.50, purple.50)',
    'linear(to-r, blue.900, purple.900)'
  );
  const welcomeGradient = useColorModeValue(
    'linear(to-r, brand.400, purple.500)',
    'linear(to-r, brand.500, purple.600)'
  );

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Welcome Card */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          w="full"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="lg"
          position="relative"
        >
          <Box 
            bgGradient={welcomeGradient} 
            py={6} 
            px={8} 
            color="white"
            position="relative"
            overflow="hidden"
          >
            {/* Decorative elements */}
            <Box
              position="absolute"
              top="20%"
              right="5%"
              width="200px"
              height="200px"
              borderRadius="full"
              bg="rgba(255, 255, 255, 0.1)"
              filter="blur(40px)"
            />
            
            <Box
              position="absolute"
              bottom="-20%"
              left="20%"
              width="150px"
              height="150px"
              borderRadius="full"
              bg="rgba(255, 255, 255, 0.12)"
              filter="blur(25px)"
            />
            
            <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6} position="relative">
              <GridItem>
                <Heading size="lg" fontWeight="bold" mb={1}>Welcome back, {user?.displayName || 'User'}!</Heading>
                <Text fontSize="md" opacity={0.9}>
                  Your resume dashboard awaits. Track applications, update your documents, and land your dream job.
                </Text>
                <HStack mt={4} spacing={4}>
                  <Button 
                    leftIcon={<FiPlus />}
                    bg="white"
                    color="brand.500"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                    transition="all 0.3s"
                    size="md"
                    onClick={() => navigate('/resume-builder/create')}
                  >
                    Create New Resume
                  </Button>
                  <Button 
                    variant="outline" 
                    borderColor="white"
                    color="white"
                    _hover={{ bg: 'rgba(255, 255, 255, 0.1)', transform: 'translateY(-2px)' }}
                    transition="all 0.3s"
                    onClick={() => navigate('/cover-letter-builder')}
                  >
                    Cover Letter
                  </Button>
                </HStack>
              </GridItem>
              <GridItem display={{ base: 'none', md: 'block' }}>
                <Flex justify="center" align="center" h="full">
                  <Icon as={FiFileText} boxSize={24} opacity={0.2} />
                </Flex>
              </GridItem>
            </Grid>
          </Box>
        </MotionBox>

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 4, md: 6 }}>
          <MotionFlex
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            direction="column"
            p={6}
            bgGradient={statsBgGradient}
            borderRadius="xl"
            boxShadow="md"
            overflow="hidden"
            position="relative"
          >
            <Icon 
              as={FiFileText} 
              position="absolute" 
              right="10px" 
              top="10px" 
              opacity={0.2} 
              boxSize={10} 
              color="brand.500" 
            />
            <StatLabel fontSize="sm" fontWeight="medium" mb={1}>Resumes Created</StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold" mb={0}>3</StatNumber>
            <StatHelpText fontSize="sm" opacity={0.7} m={0}>
              <HStack>
                <Icon as={FiClock} />
                <Text>Last created 2 days ago</Text>
              </HStack>
            </StatHelpText>
          </MotionFlex>
          
          <MotionFlex
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            direction="column"
            p={6}
            bgGradient={statsBgGradient}
            borderRadius="xl"
            boxShadow="md"
            overflow="hidden"
            position="relative"
          >
            <Icon 
              as={FiMail} 
              position="absolute" 
              right="10px" 
              top="10px" 
              opacity={0.2} 
              boxSize={10} 
              color="brand.500" 
            />
            <StatLabel fontSize="sm" fontWeight="medium" mb={1}>Cover Letters</StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold" mb={0}>1</StatNumber>
            <StatHelpText fontSize="sm" opacity={0.7} m={0}>
              <HStack>
                <Icon as={FiClock} />
                <Text>Last created 5 days ago</Text>
              </HStack>
            </StatHelpText>
          </MotionFlex>
          
          <MotionFlex
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            direction="column"
            p={6}
            bgGradient={statsBgGradient}
            borderRadius="xl"
            boxShadow="md"
            overflow="hidden"
            position="relative"
          >
            <Icon 
              as={FiCheck} 
              position="absolute" 
              right="10px" 
              top="10px" 
              opacity={0.2} 
              boxSize={10} 
              color="brand.500" 
            />
            <StatLabel fontSize="sm" fontWeight="medium" mb={1}>Applications</StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold" mb={0}>12</StatNumber>
            <StatHelpText fontSize="sm" opacity={0.7} m={0}>
              <HStack>
                <Badge colorScheme="green" variant="subtle">4 in progress</Badge>
              </HStack>
            </StatHelpText>
          </MotionFlex>
          
          <MotionFlex
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            direction="column"
            p={6}
            bgGradient={statsBgGradient}
            borderRadius="xl"
            boxShadow="md"
            overflow="hidden"
            position="relative"
          >
            <Icon 
              as={FiAward} 
              position="absolute" 
              right="10px" 
              top="10px" 
              opacity={0.2} 
              boxSize={10} 
              color="brand.500" 
            />
            <StatLabel fontSize="sm" fontWeight="medium" mb={1}>Account Type</StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold" mb={0}>Free</StatNumber>
            <StatHelpText fontSize="sm" opacity={0.7} m={0}>
              <Button size="xs" colorScheme="brand" onClick={() => navigate('/pricing')}>
                Upgrade
              </Button>
            </StatHelpText>
          </MotionFlex>
        </SimpleGrid>

        {/* My Resumes Section */}
        <Box mt={6}>
          <HStack justify="space-between" mb={4}>
            <Heading size="md">Your Resumes</Heading>
            <Button 
              variant="ghost" 
              size="sm"
              colorScheme="brand"
              rightIcon={<FiPlus />}
              onClick={() => navigate('/resume-builder')}
            >
              See All
            </Button>
          </HStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            <Card 
              bg={cardBg} 
              borderRadius="lg" 
              borderWidth="1px"
              borderColor={cardBorder}
              overflow="hidden"
              boxShadow="sm"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'md' }}
              position="relative"
            >
              <Box 
                position="absolute" 
                top={0} 
                right={0} 
                bg="green.500" 
                color="white" 
                fontSize="xs" 
                fontWeight="bold" 
                px={2} 
                py={1}
                borderBottomLeftRadius="md"
              >
                ATS SCORE: 85%
              </Box>
              <CardHeader pb={2}>
                <HStack justify="space-between">
                  <Heading size="sm" fontWeight="bold">Software Developer Resume</Heading>
                </HStack>
              </CardHeader>
              <CardBody py={3}>
                <Text fontSize="sm" color="gray.600">Last updated: June 15, 2023</Text>
                <Progress value={85} colorScheme="green" size="sm" mt={2} borderRadius="full" />
                <Flex mt={3} wrap="wrap" gap={2}>
                  <Tag size="sm" colorScheme="blue" borderRadius="full">React</Tag>
                  <Tag size="sm" colorScheme="purple" borderRadius="full">TypeScript</Tag>
                  <Tag size="sm" colorScheme="gray" borderRadius="full">Node.js</Tag>
                </Flex>
              </CardBody>
              <CardFooter pt={2} pb={3}>
                <HStack spacing={3}>
                  <Button size="sm" leftIcon={<Icon as={FiDownload} />} variant="ghost" colorScheme="brand">
                    Download
                  </Button>
                  <Button 
                    size="sm" 
                    leftIcon={<Icon as={FiEdit} />} 
                    variant="solid"
                    colorScheme="brand"
                    onClick={() => navigate('/resume-builder')}
                  >
                    Edit
                  </Button>
                </HStack>
              </CardFooter>
            </Card>
            
            <Card 
              bg={cardBg} 
              borderRadius="lg" 
              borderWidth="1px"
              borderColor={cardBorder}
              overflow="hidden"
              boxShadow="sm"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'md' }}
              position="relative"
            >
              <Box 
                position="absolute" 
                top={0} 
                right={0} 
                bg="yellow.500" 
                color="white" 
                fontSize="xs" 
                fontWeight="bold" 
                px={2} 
                py={1}
                borderBottomLeftRadius="md"
              >
                ATS SCORE: 72%
              </Box>
              <CardHeader pb={2}>
                <HStack justify="space-between">
                  <Heading size="sm" fontWeight="bold">Product Manager Resume</Heading>
                </HStack>
              </CardHeader>
              <CardBody py={3}>
                <Text fontSize="sm" color="gray.600">Last updated: May 22, 2023</Text>
                <Progress value={72} colorScheme="yellow" size="sm" mt={2} borderRadius="full" />
                <Flex mt={3} wrap="wrap" gap={2}>
                  <Tag size="sm" colorScheme="green" borderRadius="full">Agile</Tag>
                  <Tag size="sm" colorScheme="orange" borderRadius="full">Marketing</Tag>
                  <Tag size="sm" colorScheme="teal" borderRadius="full">Leadership</Tag>
                </Flex>
              </CardBody>
              <CardFooter pt={2} pb={3}>
                <HStack spacing={3}>
                  <Button size="sm" leftIcon={<Icon as={FiDownload} />} variant="ghost" colorScheme="brand">
                    Download
                  </Button>
                  <Button 
                    size="sm" 
                    leftIcon={<Icon as={FiEdit} />} 
                    variant="solid"
                    colorScheme="brand"
                    onClick={() => navigate('/resume-builder')}
                  >
                    Edit
                  </Button>
                </HStack>
              </CardFooter>
            </Card>
            
            <Card 
              bg={cardBg} 
              borderRadius="lg" 
              border="1px dashed"
              borderColor={cardBorder}
              overflow="hidden"
              boxShadow="sm"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'md', borderColor: 'brand.300' }}
              h="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              py={10}
              onClick={() => navigate('/resume-builder/create')}
              cursor="pointer"
            >
              <VStack spacing={4}>
                <Flex
                  align="center"
                  justify="center"
                  bg="brand.50"
                  color="brand.500"
                  borderRadius="full"
                  w="60px"
                  h="60px"
                >
                  <Icon as={FiPlus} boxSize={6} />
                </Flex>
                <Text fontWeight="medium">Create New Resume</Text>
                <Text fontSize="sm" color="gray.500" textAlign="center" px={4}>
                  Start from scratch or upload an existing resume
                </Text>
              </VStack>
            </Card>
          </SimpleGrid>
        </Box>

        <Divider my={4} />

        {/* Quick Actions */}
        <Box>
          <Heading size="md" mb={4}>Quick Actions</Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
            <Button 
              leftIcon={<Icon as={FiFileText} />} 
              colorScheme="brand" 
              variant="outline"
              height="16"
              onClick={() => navigate('/resume-builder/create')}
              justifyContent="flex-start"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }}
              transition="all 0.3s"
            >
              Create New Resume
            </Button>
            <Button 
              leftIcon={<Icon as={FiMail} />} 
              colorScheme="teal" 
              variant="outline"
              height="16"
              onClick={() => navigate('/cover-letter-builder')}
              justifyContent="flex-start"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }}
              transition="all 0.3s"
            >
              Create Cover Letter
            </Button>
            <Button 
              leftIcon={<Icon as={FiEdit} />} 
              colorScheme="purple" 
              variant="outline"
              height="16"
              onClick={() => navigate('/resume-builder')}
              justifyContent="flex-start"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }}
              transition="all 0.3s"
            >
              Resume Analysis
            </Button>
            <Button 
              leftIcon={<Icon as={FiFileText} />} 
              colorScheme="orange" 
              variant="outline"
              height="16"
              justifyContent="flex-start"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }}
              transition="all 0.3s"
            >
              View Templates
            </Button>
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  );
};

export default Dashboard;