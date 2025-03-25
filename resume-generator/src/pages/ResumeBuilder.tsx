import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import ResumeUploader from '../components/ResumeUploader';
import ResumeAnalysis from '../components/ResumeAnalysis';

const ResumeBuilder = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleUploadComplete = (file: File) => {
    setUploadedFile(file);
    toast({
      title: 'Resume uploaded',
      description: 'Your resume has been uploaded successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAnalysisSelect = async (optionId: string) => {
    setIsAnalyzing(true);
    try {
      // TODO: Implement actual analysis logic based on the selected option
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate analysis
      
      toast({
        title: 'Analysis complete',
        description: `Your resume has been analyzed for ${optionId}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis failed',
        description: 'There was an error analyzing your resume',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, blue.500, purple.500)"
              bgClip="text"
            >
              Improve Your Resume
            </Heading>
            <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.400')} mt={4}>
              Upload your resume and get AI-powered suggestions to make it stand out
            </Text>
          </Box>

          <ResumeUploader onUploadComplete={handleUploadComplete} />

          {uploadedFile && (
            <ResumeAnalysis onAnalysisSelect={handleAnalysisSelect} />
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default ResumeBuilder; 