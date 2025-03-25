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
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ResumeUploader from '../components/ResumeUploader';
import ResumeAnalysis from '../components/ResumeAnalysis';
import { analyzeResume, formatAnalysisResults } from '../services/resumeService';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/Auth/AuthModal';

const ResumeBuilder = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysisType, setCurrentAnalysisType] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const location = useLocation();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Handle file passed from Home page
  useEffect(() => {
    const state = location.state as { file?: File } | null;
    if (state?.file && !resumeFile) {
      // If we have a file from navigation state, process it
      // We would typically call handleUploadComplete here, but that requires extracting text
      // So in a real implementation, you'd need to process the file here or pass it to the uploader component
      console.log('File from navigation:', state.file);
    }
  }, [location.state, resumeFile]);

  const handleUploadComplete = (file: File, text: string) => {
    setResumeFile(file);
    setExtractedText(text);
  };

  const analyzeResumeWithType = async (analysisType: string) => {
    // Check if a premium feature requires authentication
    if ((analysisType !== 'ai-check' && analysisType !== 'ats-check') && !isAuthenticated) {
      onOpen(); // Open auth modal for premium features
      return;
    }

    if (!resumeFile) {
      toast({
        title: 'No resume found',
        description: 'Please upload a resume first',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsAnalyzing(true);
    setCurrentAnalysisType(analysisType);
    
    try {
      const result = await analyzeResume({
        file: resumeFile,
        analysisType: analysisType as any
      });
      
      const formattedResults = formatAnalysisResults(result.analysis, analysisType);
      setAnalysisResults(formattedResults);
      
      toast({
        title: 'Analysis complete',
        description: 'Your resume has been analyzed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis failed',
        description: error.message || 'There was an error analyzing your resume',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsAnalyzing(false);
      setCurrentAnalysisType(null);
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
                  <>
                    <Box mt={4} textAlign="center">
                      <HStack spacing={4} justify="center">
                        <Button 
                          colorScheme="blue" 
                          onClick={() => analyzeResumeWithType('ai-check')} 
                          isLoading={isAnalyzing && currentAnalysisType === 'ai-check'}
                          loadingText="Analyzing Resume"
                          size="lg"
                        >
                          AI Resume Check
                        </Button>
                        <Button 
                          colorScheme="teal" 
                          onClick={() => analyzeResumeWithType('ats-check')} 
                          isLoading={isAnalyzing && currentAnalysisType === 'ats-check'}
                          loadingText="Analyzing ATS"
                          size="lg"
                        >
                          ATS Check
                        </Button>
                      </HStack>
                    </Box>
                    
                    <ResumeAnalysis 
                      onAnalysisSelect={analyzeResumeWithType} 
                      isAnalyzing={isAnalyzing} 
                    />
                  </>
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
                    
                    <Box mt={4} pt={4} borderTopWidth="1px">
                      <Heading size="sm" mb={2}>Full Analysis</Heading>
                      <Box 
                        p={4} 
                        borderWidth="1px" 
                        borderRadius="md" 
                        bg="gray.50" 
                        maxHeight="300px" 
                        overflowY="auto"
                      >
                        <Text whiteSpace="pre-wrap">{analysisResults.rawAnalysis}</Text>
                      </Box>
                    </Box>
                  </VStack>
                </Box>
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </VStack>
      
      <AuthModal 
        isOpen={isOpen} 
        onClose={onClose} 
        initialTab="login" 
        redirectPath="/resume-builder" 
      />
    </Container>
  );
};

export default ResumeBuilder;