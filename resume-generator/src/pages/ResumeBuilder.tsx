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
  Center
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ResumeUploader from '../components/ResumeUploader';
import ResumeAnalysis from '../components/ResumeAnalysis';
import ResumeForm from '../components/ResumeForm/ResumeForm';
import { analyzeResume, formatAnalysisResults } from '../services/resumeService';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/Auth/AuthModal';

interface ResumeBuilderProps {
  initialTabIndex?: number;
}

const ResumeBuilder = ({ initialTabIndex = 0 }: ResumeBuilderProps) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysisType, setCurrentAnalysisType] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(initialTabIndex);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  
  const location = useLocation();
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Initialize the correct tab based on route or props
  useEffect(() => {
    console.log('Setting initial tab index:', initialTabIndex);
    console.log('Current pathname:', location.pathname);
    if (location.pathname === '/resume-builder/create') {
      console.log('Setting to tab 1 (create from scratch)');
      setActiveTabIndex(1);
    } else {
      setActiveTabIndex(initialTabIndex);
    }
  }, [initialTabIndex, location.pathname]);

  // Process uploaded file if any
  useEffect(() => {
    if (location.state?.file && !resumeFile) {
      processUploadedFile(location.state.file);
    }
  }, [location.state, resumeFile]);

  const processUploadedFile = async (file: File) => {
    try {
      console.log('Processing uploaded file:', file.name);
      setResumeFile(file);
      setExtractedText('Text would be extracted from your resume here...');
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: 'Error processing file',
        description: 'We could not process the uploaded file. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUploadComplete = (file: File, text: string) => {
    setResumeFile(file);
    setExtractedText(text);
  };

  const analyzeResumeWithType = async (analysisType: string) => {
    if (!resumeFile) {
      toast({
        title: 'Error',
        description: 'Please upload a resume first',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (analysisType === 'ats-check' && !isAuthenticated) {
      onOpen(); // Open auth modal for premium features
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
      
      // Calculate the tab index for analysis results
      // Count how many tabs there are before the analysis tab
      let analysisTabIndex = 2; // Base index
      if (generatedResume) analysisTabIndex++; // Add 1 if generated resume tab exists
      if (extractedText) analysisTabIndex++; // Add 1 if extracted text tab exists
      
      setActiveTabIndex(analysisTabIndex);

      toast({
        title: 'Analysis Complete',
        description: 'Your resume has been analyzed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis Failed',
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

  const handleResumeGenerated = (data: any, text: string) => {
    setResumeData(data);
    setGeneratedResume(text);
    
    // Calculate the tab index for generated resume
    // It should be the 3rd tab (index 2)
    setActiveTabIndex(2);
    
    toast({
      title: "Resume Generated Successfully",
      description: "Your ATS-optimized resume is ready to view and download",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle tab change
  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
  };

  // Calculate tab indices dynamically
  const getTabIndices = () => {
    let indices = {
      upload: 0,
      create: 1,
      generated: null,
      extracted: null,
      analysis: null
    };
    
    let currentIndex = 2;
    
    if (generatedResume) {
      indices.generated = currentIndex++;
    }
    
    if (extractedText) {
      indices.extracted = currentIndex++;
    }
    
    if (analysisResults) {
      indices.analysis = currentIndex;
    }
    
    return indices;
  };
  
  const tabIndices = getTabIndices();

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Resume Builder & Analyzer</Heading>
          <Text>Create a professional ATS-optimized resume or get feedback on your existing one.</Text>
        </Box>

        <Tabs 
          variant="enclosed" 
          index={activeTabIndex} 
          onChange={handleTabChange}
          colorScheme="blue"
          isLazy
        >
          <TabList>
            <Tab data-testid="upload-resume-tab">Upload Existing Resume</Tab>
            <Tab data-testid="create-from-scratch-tab">Create From Scratch</Tab>
            {generatedResume && <Tab>Generated Resume</Tab>}
            {extractedText && <Tab>Extracted Text</Tab>}
            {analysisResults && <Tab>Analysis Results</Tab>}
          </TabList>

          <TabPanels>
            {/* Upload Resume Tab */}
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

            {/* Create From Scratch Tab */}
            <TabPanel>
              <ResumeForm onResumeGenerated={handleResumeGenerated} />
            </TabPanel>
            
            {/* Generated Resume Tab */}
            {generatedResume && (
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Heading size="md">Your ATS-Optimized Resume</Heading>
                  <Box 
                    p={6} 
                    borderWidth="1px" 
                    borderRadius="md" 
                    bg="white"
                    fontFamily="mono"
                    whiteSpace="pre-wrap"
                    maxHeight="600px"
                    overflowY="auto"
                    boxShadow="sm"
                  >
                    {generatedResume}
                  </Box>
                  
                  <HStack spacing={4} justify="center">
                    <Button 
                      colorScheme="blue" 
                      onClick={() => {
                        // Download as text file
                        const element = document.createElement("a");
                        const file = new Blob([generatedResume], {type: 'text/plain'});
                        element.href = URL.createObjectURL(file);
                        element.download = "ATS-Optimized-Resume.txt";
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                    >
                      Download Resume
                    </Button>
                    <Button
                      colorScheme="teal" 
                      variant="outline" 
                      onClick={() => {
                        // In a real implementation, this would save to the user's account
                        if (!isAuthenticated) {
                          onOpen();
                          return;
                        }
                        toast({
                          title: "Resume saved",
                          description: "Your resume has been saved to your account",
                          status: "success",
                          duration: 3000,
                          isClosable: true,
                        });
                      }}
                    >
                      Save Resume
                    </Button>
                  </HStack>
                </VStack>
              </TabPanel>
            )}
            
            {/* Extracted Text Tab */}
            {extractedText && (
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">Extracted Text from Resume</Heading>
                  <Box 
                    p={6} 
                    borderWidth="1px" 
                    borderRadius="md" 
                    bg="white"
                    fontFamily="mono"
                    whiteSpace="pre-wrap"
                    maxHeight="600px"
                    overflowY="auto"
                    boxShadow="sm"
                  >
                    {extractedText}
                  </Box>
                </VStack>
              </TabPanel>
            )}
            
            {/* Analysis Results Tab */}
            {analysisResults && (
              <TabPanel>
                <Box mt={4}>
                  <Heading size="md" mb={4}>Analysis Results</Heading>
                  <Box 
                    p={6} 
                    borderWidth="1px" 
                    borderRadius="md" 
                    bg="white"
                    boxShadow="sm"
                  >
                    {/* Display score */}
                    <Text fontSize="xl" fontWeight="bold" mb={4}>
                      Score: {analysisResults.score}/100
                    </Text>
                    
                    {/* Display strengths */}
                    <Box mb={6}>
                      <Heading size="sm" mb={2} color="green.500">Strengths</Heading>
                      <VStack align="stretch" spacing={2}>
                        {analysisResults.feedback.strengths.map((strength: string, index: number) => (
                          <Text key={index}>• {strength}</Text>
                        ))}
                      </VStack>
                    </Box>
                    
                    {/* Display improvements */}
                    <Box mb={6}>
                      <Heading size="sm" mb={2} color="orange.500">Areas for Improvement</Heading>
                      <VStack align="stretch" spacing={2}>
                        {analysisResults.feedback.improvements.map((improvement: string, index: number) => (
                          <Text key={index}>• {improvement}</Text>
                        ))}
                      </VStack>
                    </Box>
                    
                    {/* Raw analysis */}
                    {analysisResults.rawAnalysis && (
                      <Box mt={4} pt={4} borderTopWidth="1px">
                        <Heading size="sm" mb={2}>Full Analysis</Heading>
                        <Text whiteSpace="pre-wrap" fontSize="sm">
                          {analysisResults.rawAnalysis}
                        </Text>
                      </Box>
                    )}
                  </Box>
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