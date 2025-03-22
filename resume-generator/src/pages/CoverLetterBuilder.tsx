import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  Text,
  useToast,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface CoverLetterData {
  companyName: string;
  position: string;
  jobDescription: string;
  experience: string;
  skills: string;
  additionalNotes: string;
}

const CoverLetterBuilder = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>({
    companyName: '',
    position: '',
    jobDescription: '',
    experience: '',
    skills: '',
    additionalNotes: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCoverLetterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to generate a cover letter',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement AI generation logic here
      // For now, we'll just show a success message
      toast({
        title: 'Cover letter generated successfully',
        description: 'Your cover letter has been generated and is ready for download',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error generating cover letter',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Cover Letter Builder</Heading>
        <Text textAlign="center" color="gray.600">
          Create a professional cover letter tailored to your target position
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {/* Form Section */}
          <Card>
            <CardHeader>
              <Heading size="md">Job Details</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Company Name</FormLabel>
                  <Input
                    name="companyName"
                    value={coverLetterData.companyName}
                    onChange={handleInputChange}
                    placeholder="e.g., Tech Corp"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Position</FormLabel>
                  <Input
                    name="position"
                    value={coverLetterData.position}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Job Description</FormLabel>
                  <Textarea
                    name="jobDescription"
                    value={coverLetterData.jobDescription}
                    onChange={handleInputChange}
                    placeholder="Paste the job description here..."
                    rows={4}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Your Experience</FormLabel>
                  <Textarea
                    name="experience"
                    value={coverLetterData.experience}
                    onChange={handleInputChange}
                    placeholder="Describe your relevant experience..."
                    rows={4}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Your Skills</FormLabel>
                  <Textarea
                    name="skills"
                    value={coverLetterData.skills}
                    onChange={handleInputChange}
                    placeholder="List your relevant skills..."
                    rows={3}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Additional Notes</FormLabel>
                  <Textarea
                    name="additionalNotes"
                    value={coverLetterData.additionalNotes}
                    onChange={handleInputChange}
                    placeholder="Any additional information you'd like to include..."
                    rows={3}
                  />
                </FormControl>
              </VStack>
            </CardBody>
            <CardFooter>
              <Button
                colorScheme="blue"
                width="full"
                onClick={handleGenerate}
                isLoading={loading}
              >
                Generate Cover Letter
              </Button>
            </CardFooter>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <Heading size="md">Preview</Heading>
            </CardHeader>
            <CardBody>
              <Box
                p={4}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                minH="400px"
              >
                <Text color="gray.500" textAlign="center">
                  Your cover letter preview will appear here
                </Text>
              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default CoverLetterBuilder; 