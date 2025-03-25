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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiMail, FiDownload, FiEdit } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Dashboard</Heading>
          <Text>Welcome back, {user?.displayName || 'User'}! Manage your resumes and applications.</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Stat 
            p={5} 
            shadow="sm" 
            border="1px" 
            borderColor="gray.200" 
            borderRadius="md" 
            bg={cardBg}
          >
            <StatLabel>Resumes Created</StatLabel>
            <StatNumber>3</StatNumber>
            <StatHelpText>Last created 2 days ago</StatHelpText>
          </Stat>
          <Stat 
            p={5} 
            shadow="sm" 
            border="1px" 
            borderColor="gray.200" 
            borderRadius="md" 
            bg={cardBg}
          >
            <StatLabel>Cover Letters</StatLabel>
            <StatNumber>1</StatNumber>
            <StatHelpText>Last created 5 days ago</StatHelpText>
          </Stat>
          <Stat 
            p={5} 
            shadow="sm" 
            border="1px" 
            borderColor="gray.200" 
            borderRadius="md" 
            bg={cardBg}
          >
            <StatLabel>Applications</StatLabel>
            <StatNumber>12</StatNumber>
            <StatHelpText>4 in progress</StatHelpText>
          </Stat>
          <Stat 
            p={5} 
            shadow="sm" 
            border="1px" 
            borderColor="gray.200" 
            borderRadius="md" 
            bg={cardBg}
          >
            <StatLabel>Account Type</StatLabel>
            <StatNumber>Free</StatNumber>
            <StatHelpText>
              <Button size="xs" colorScheme="blue" onClick={() => navigate('/pricing')}>
                Upgrade
              </Button>
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        <Heading size="md" mt={4}>Your Resumes</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Card>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="sm">Software Developer Resume</Heading>
                <Badge colorScheme="green">ATS Score: 85%</Badge>
              </HStack>
            </CardHeader>
            <CardBody py={2}>
              <Text fontSize="sm" color="gray.600">Last updated: June 15, 2023</Text>
              <Progress value={85} colorScheme="green" size="sm" mt={2} />
            </CardBody>
            <CardFooter pt={2}>
              <HStack spacing={2}>
                <Button size="sm" leftIcon={<Icon as={FiDownload} />} variant="ghost">
                  Download
                </Button>
                <Button size="sm" leftIcon={<Icon as={FiEdit} />} variant="ghost" 
                  onClick={() => navigate('/resume-builder')}>
                  Edit
                </Button>
              </HStack>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="sm">Product Manager Resume</Heading>
                <Badge colorScheme="yellow">ATS Score: 72%</Badge>
              </HStack>
            </CardHeader>
            <CardBody py={2}>
              <Text fontSize="sm" color="gray.600">Last updated: May 22, 2023</Text>
              <Progress value={72} colorScheme="yellow" size="sm" mt={2} />
            </CardBody>
            <CardFooter pt={2}>
              <HStack spacing={2}>
                <Button size="sm" leftIcon={<Icon as={FiDownload} />} variant="ghost">
                  Download
                </Button>
                <Button size="sm" leftIcon={<Icon as={FiEdit} />} variant="ghost"
                  onClick={() => navigate('/resume-builder')}>
                  Edit
                </Button>
              </HStack>
            </CardFooter>
          </Card>
        </SimpleGrid>

        <Divider my={4} />

        <Heading size="md">Quick Actions</Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
          <Button 
            leftIcon={<Icon as={FiFileText} />} 
            colorScheme="blue" 
            variant="outline"
            height="16"
            onClick={() => navigate('/resume-builder/create')}
          >
            Create New Resume
          </Button>
          <Button 
            leftIcon={<Icon as={FiMail} />} 
            colorScheme="teal" 
            variant="outline"
            height="16"
            onClick={() => navigate('/cover-letter-builder')}
          >
            Create Cover Letter
          </Button>
          <Button 
            leftIcon={<Icon as={FiEdit} />} 
            colorScheme="purple" 
            variant="outline"
            height="16"
            onClick={() => navigate('/resume-builder')}
          >
            Resume Analysis
          </Button>
          <Button 
            leftIcon={<Icon as={FiFileText} />} 
            colorScheme="orange" 
            variant="outline"
            height="16"
          >
            View Templates
          </Button>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default Dashboard;