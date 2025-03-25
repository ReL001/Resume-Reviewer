import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { useState } from 'react';
import ResumeUploader from '../components/ResumeUploader';

const ResumeBuilder = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const toast = useToast();

  const handleUploadComplete = (file: File, text: string) => {
    setResumeFile(file);
    setExtractedText(text);
    console.log('Extracted text length:', text.length);
  };

  const analyzeResume = async () => {
    if (!extractedText) {
      toast({
        title: 'No text found',
        description: 'Please upload a resume with extractable text',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // This is where you would send the extractedText to your LLM API
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = {
        score: 78,
        feedback: {
          strengths: [
            'Clear professional experience section',
            'Good use of action verbs',
            'Appropriate length'
          ],
          improvements: [
            'Add more quantifiable achievements',
            'Include keywords from job descriptions',
            'Improve formatting consistency'
          ]
        }
      };
      
      setAnalysisResults(mockResults);
      
      toast({
        title: 'Analysis complete',
        description: 'Your resume has been analyzed successfully',
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
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Resume Builder & Analyzer</Heading>
          <Text>Upload your resume to get AI-powered feedback and suggestions for improvement.</Text>
        </Box>

        <Tabs variant="enclosed">
          <TabList>
            <Tab>Upload Resume</Tab>
            {extractedText && <Tab>Extracted Text</Tab>}
            {analysisResults && <Tab>Analysis Results</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <ResumeUploader onUploadComplete={handleUploadComplete} />
                
                {resumeFile && (
                  <Box mt={4} textAlign="center">
                    <Button 
                      colorScheme="blue" 
                      onClick={analyzeResume} 
                      isLoading={isAnalyzing}
                      loadingText="Analyzing Resume"
                      size="lg"
                    >
                      Analyze Resume
                    </Button>
                  </Box>
                )}
              </VStack>
            </TabPanel>
            
            {extractedText && (
              <TabPanel>
                <Box 
                  p={4} 
                  borderWidth="1px" 
                  borderRadius="md" 
                  bg="gray.50" 
                  maxHeight="500px" 
                  overflowY="auto"
                  fontFamily="mono"
                >
                  <Text whiteSpace="pre-wrap">{extractedText}</Text>
                </Box>
              </TabPanel>
            )}
            
            {analysisResults && (
              <TabPanel>
                <Box p={4} borderWidth="1px" borderRadius="md">
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      <Heading size="md">Resume Score</Heading>
                      <Text fontSize="3xl" fontWeight="bold" color={analysisResults.score > 70 ? "green.500" : "orange.500"}>
                        {analysisResults.score}/100
                      </Text>
                    </Box>
                    
                    <Box>
                      <Heading size="md" mb={2}>Strengths</Heading>
                      {analysisResults.feedback.strengths.map((strength: string, i: number) => (
                        <Text key={i} color="green.600">✓ {strength}</Text>
                      ))}
                    </Box>
                    
                    <Box>
                      <Heading size="md" mb={2}>Areas for Improvement</Heading>
                      {analysisResults.feedback.improvements.map((improvement: string, i: number) => (
                        <Text key={i} color="orange.600">• {improvement}</Text>
                      ))}
                    </Box>
                  </VStack>
                </Box>
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default ResumeBuilder;