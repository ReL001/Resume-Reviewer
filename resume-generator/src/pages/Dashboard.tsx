import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  SimpleGrid, 
  Button, 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Stack,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  useToast,
  Flex,
  Icon,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Divider
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserDocuments, UserDocument } from '../services/firebaseService';
import { FiFileText, FiMail, FiCalendar, FiClock, FiPlusCircle } from 'react-icons/fi';

const Dashboard = () => {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      if (user) {
        try {
          const docs = await getUserDocuments(user.uid);
          setDocuments(docs);
        } catch (error) {
          console.error('Error fetching documents:', error);
          toast({
            title: 'Error fetching documents',
            description: 'Could not load your documents. Please try again later.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDocuments();
  }, [user, toast]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const resumeDocs = documents.filter(doc => doc.type === 'resume');
  const coverLetterDocs = documents.filter(doc => doc.type === 'cover-letter');

  return (
    <Container maxW="container.xl" py={10}>
      <Heading mb={2}>Dashboard</Heading>
      <Text mb={8}>Manage your resumes and cover letters</Text>
      
      <StatGroup mb={8}>
        <Stat>
          <StatLabel>Resumes</StatLabel>
          <StatNumber>{resumeDocs.length}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Cover Letters</StatLabel>
          <StatNumber>{coverLetterDocs.length}</StatNumber>
        </Stat>
      </StatGroup>
      
      <Divider mb={8} />

      <Tabs variant="enclosed" colorScheme="blue">
        <TabList mb={4}>
          <Tab>Resumes</Tab>
          <Tab>Cover Letters</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Box mb={6}>
              <Button 
                leftIcon={<FiPlusCircle />} 
                colorScheme="blue" 
                onClick={() => navigate('/resume-builder')}
              >
                Create New Resume
              </Button>
            </Box>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {loading ? (
                <Text>Loading your resumes...</Text>
              ) : resumeDocs.length > 0 ? (
                resumeDocs.map(doc => (
                  <Card key={doc.id} variant="outline" height="100%">
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Heading size="md" noOfLines={1}>{doc.title}</Heading>
                        <Icon as={FiFileText} color="blue.500" boxSize={5} />
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Stack spacing={2}>
                        <Flex align="center">
                          <Icon as={FiCalendar} mr={2} color="gray.500" />
                          <Text fontSize="sm">Created: {formatDate(doc.createdAt)}</Text>
                        </Flex>
                        <Flex align="center">
                          <Icon as={FiClock} mr={2} color="gray.500" />
                          <Text fontSize="sm">Modified: {formatDate(doc.lastModified)}</Text>
                        </Flex>
                        <Badge colorScheme="blue" alignSelf="flex-start" mt={2}>
                          {doc.template}
                        </Badge>
                      </Stack>
                    </CardBody>
                    <CardFooter>
                      <Button 
                        colorScheme="blue" 
                        variant="outline" 
                        size="sm" 
                        width="full"
                        onClick={() => navigate(`/resume-builder?id=${doc.id}`)}
                      >
                        Edit Resume
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Box p={4} borderWidth="1px" borderRadius="md">
                  <Text>You haven't created any resumes yet. Get started by creating one!</Text>
                </Box>
              )}
            </SimpleGrid>
          </TabPanel>
          
          <TabPanel p={0}>
            <Box mb={6}>
              <Button 
                leftIcon={<FiPlusCircle />} 
                colorScheme="blue" 
                onClick={() => navigate('/cover-letter-builder')}
              >
                Create New Cover Letter
              </Button>
            </Box>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {loading ? (
                <Text>Loading your cover letters...</Text>
              ) : coverLetterDocs.length > 0 ? (
                coverLetterDocs.map(doc => (
                  <Card key={doc.id} variant="outline" height="100%">
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Heading size="md" noOfLines={1}>{doc.title}</Heading>
                        <Icon as={FiMail} color="teal.500" boxSize={5} />
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Stack spacing={2}>
                        <Flex align="center">
                          <Icon as={FiCalendar} mr={2} color="gray.500" />
                          <Text fontSize="sm">Created: {formatDate(doc.createdAt)}</Text>
                        </Flex>
                        <Flex align="center">
                          <Icon as={FiClock} mr={2} color="gray.500" />
                          <Text fontSize="sm">Modified: {formatDate(doc.lastModified)}</Text>
                        </Flex>
                        <Badge colorScheme="teal" alignSelf="flex-start" mt={2}>
                          {doc.template}
                        </Badge>
                      </Stack>
                    </CardBody>
                    <CardFooter>
                      <Button 
                        colorScheme="teal" 
                        variant="outline" 
                        size="sm" 
                        width="full"
                        onClick={() => navigate(`/cover-letter-builder?id=${doc.id}`)}
                      >
                        Edit Cover Letter
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Box p={4} borderWidth="1px" borderRadius="md">
                  <Text>You haven't created any cover letters yet. Get started by creating one!</Text>
                </Box>
              )}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Dashboard;