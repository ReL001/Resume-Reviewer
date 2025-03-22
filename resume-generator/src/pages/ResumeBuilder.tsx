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
  Select,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ResumeData {
  jobTitle: string;
  experience: string;
  skills: string;
  education: string;
  additionalDetails: string;
  template: string;
}

const ResumeBuilder = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    jobTitle: '',
    experience: '',
    skills: '',
    education: '',
    additionalDetails: '',
    template: 'modern',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to generate a resume',
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
        title: 'Resume generated successfully',
        description: 'Your resume has been generated and is ready for download',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error generating resume',
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
        <Heading textAlign="center">Resume Builder</Heading>
        <Text textAlign="center" color="gray.600">
          Fill in your details below to generate a professional resume
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {/* Form Section */}
          <Card>
            <CardHeader>
              <Heading size="md">Your Information</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Job Title</FormLabel>
                  <Input
                    name="jobTitle"
                    value={resumeData.jobTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Engineer"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Experience</FormLabel>
                  <Textarea
                    name="experience"
                    value={resumeData.experience}
                    onChange={handleInputChange}
                    placeholder="Describe your work experience..."
                    rows={4}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Skills</FormLabel>
                  <Textarea
                    name="skills"
                    value={resumeData.skills}
                    onChange={handleInputChange}
                    placeholder="List your skills..."
                    rows={3}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Education</FormLabel>
                  <Textarea
                    name="education"
                    value={resumeData.education}
                    onChange={handleInputChange}
                    placeholder="Describe your education..."
                    rows={3}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Additional Details</FormLabel>
                  <Textarea
                    name="additionalDetails"
                    value={resumeData.additionalDetails}
                    onChange={handleInputChange}
                    placeholder="Any additional information..."
                    rows={3}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Template Style</FormLabel>
                  <Select
                    name="template"
                    value={resumeData.template}
                    onChange={handleInputChange}
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                  </Select>
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
                Generate Resume
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
                  Your resume preview will appear here
                </Text>
              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default ResumeBuilder; 