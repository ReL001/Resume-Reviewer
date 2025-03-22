import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaFileAlt, FaEnvelope, FaDownload, FaTrash } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

interface Document {
  id: string;
  title: string;
  type: 'resume' | 'cover-letter';
  createdAt: string;
  lastModified: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');

  // Mock data - replace with actual data from Firebase
  const documents: Document[] = [
    {
      id: '1',
      title: 'Software Engineer Resume',
      type: 'resume',
      createdAt: '2024-03-15',
      lastModified: '2024-03-16',
    },
    {
      id: '2',
      title: 'Cover Letter - Tech Corp',
      type: 'cover-letter',
      createdAt: '2024-03-16',
      lastModified: '2024-03-16',
    },
  ];

  const handleDownload = (document: Document) => {
    // TODO: Implement download functionality
    console.log(`Downloading ${document.title}`);
  };

  const handleDelete = (document: Document) => {
    // TODO: Implement delete functionality
    console.log(`Deleting ${document.title}`);
  };

  const handleCreateNew = (type: 'resume' | 'cover-letter') => {
    // TODO: Implement create new functionality
    console.log(`Creating new ${type}`);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading>Dashboard</Heading>
        <Text color="gray.600">
          Welcome back, {user?.displayName}! Manage your resumes and cover letters here.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {/* Resumes Section */}
          <Card bg={bgColor}>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">Resumes</Heading>
                <Button
                  leftIcon={<FaFileAlt />}
                  colorScheme="blue"
                  onClick={() => handleCreateNew('resume')}
                >
                  Create New
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {documents
                  .filter((doc) => doc.type === 'resume')
                  .map((doc) => (
                    <Box
                      key={doc.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor="gray.200"
                    >
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold">{doc.title}</Text>
                          <Text fontSize="sm" color="gray.500">
                            Last modified: {doc.lastModified}
                          </Text>
                        </VStack>
                        <HStack>
                          <Button
                            size="sm"
                            leftIcon={<FaDownload />}
                            onClick={() => handleDownload(doc)}
                          >
                            Download
                          </Button>
                          <Button
                            size="sm"
                            leftIcon={<FaTrash />}
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDelete(doc)}
                          >
                            Delete
                          </Button>
                        </HStack>
                      </HStack>
                    </Box>
                  ))}
              </VStack>
            </CardBody>
          </Card>

          {/* Cover Letters Section */}
          <Card bg={bgColor}>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">Cover Letters</Heading>
                <Button
                  leftIcon={<FaEnvelope />}
                  colorScheme="blue"
                  onClick={() => handleCreateNew('cover-letter')}
                >
                  Create New
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {documents
                  .filter((doc) => doc.type === 'cover-letter')
                  .map((doc) => (
                    <Box
                      key={doc.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor="gray.200"
                    >
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold">{doc.title}</Text>
                          <Text fontSize="sm" color="gray.500">
                            Last modified: {doc.lastModified}
                          </Text>
                        </VStack>
                        <HStack>
                          <Button
                            size="sm"
                            leftIcon={<FaDownload />}
                            onClick={() => handleDownload(doc)}
                          >
                            Download
                          </Button>
                          <Button
                            size="sm"
                            leftIcon={<FaTrash />}
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDelete(doc)}
                          >
                            Delete
                          </Button>
                        </HStack>
                      </HStack>
                    </Box>
                  ))}
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default Dashboard; 