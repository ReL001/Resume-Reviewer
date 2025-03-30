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
  Center,
  Flex,
  Badge,
  Icon,
  useColorModeValue,
  Divider,
  Card,
  CardBody,
  Grid,
  GridItem,
  Progress,
  Image
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ResumeUploader from '../components/ResumeUploader';
import ResumeAnalysis from '../components/ResumeAnalysis';
import ResumeForm from '../components/ResumeForm/ResumeForm';
import { analyzeResume, formatAnalysisResults } from '../services/resumeService';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/Auth/AuthModal';
import { FiUpload, FiEdit, FiFileText, FiCheckCircle } from 'react-icons/fi';

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

  useEffect(() => {
    if (location.pathname === '/resume-builder/create') {
      setActiveTabIndex(1);
    } else {
      setActiveTabIndex(initialTabIndex);
    }
  }, [initialTabIndex, location.pathname]);

  useEffect(() => {
    if (location.state?.file && !resumeFile) {
      processUploadedFile(location.state.file);
    }
  }, [location.state, resumeFile]);

  const processUploadedFile = async (file: File) => {
    try {
      setResumeFile(file);
      setExtractedText('Text would be extracted from your resume here...');
    } catch (error) {
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
      onOpen();
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

      let analysisTabIndex = 2;
      if (generatedResume) analysisTabIndex++;
      if (extractedText) analysisTabIndex++;

      setActiveTabIndex(analysisTabIndex);

      toast({
        title: 'Analysis Complete',
        description: 'Your resume has been analyzed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
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
    setActiveTabIndex(2);

    toast({
      title: "Resume Generated Successfully",
      description: "Your ATS-optimized resume is ready to view and download",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
  };

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

  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box px={4} py={4} bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={cardBorderColor}>
          {/* Stepper component removed
          <Stepper size="sm" index={activeStep} colorScheme="blue" mb={8}>
            {steps.map((step, index) => (
              <Step key={index} onClick={() => index <= Math.max(1, activeTabIndex) && handleTabChange(index)}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>
                <Box flexShrink={0}>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
          */}

          <Tabs 
            variant="enclosed" 
            index={activeTabIndex} 
            onChange={handleTabChange}
            colorScheme="blue"
            isLazy
          >
            <TabList display="none">
              <Tab data-testid="upload-resume-tab">Upload Existing Resume</Tab>
              <Tab data-testid="create-from-scratch-tab">Create From Scratch</Tab>
              {generatedResume && <Tab>Generated Resume</Tab>}
              {extractedText && <Tab>Extracted Text</Tab>}
              {analysisResults && <Tab>Analysis Results</Tab>}
            </TabList>

            <TabPanels>
              <TabPanel p={0}>
                <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
                  <GridItem>
                    <Card 
                      variant="outline" 
                      bg={cardBg} 
                      borderColor={cardBorderColor} 
                      borderRadius="lg"
                      overflow="hidden"
                      boxShadow="sm"
                      h="full"
                      transition="all 0.3s"
                      _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
                    >
                      <CardBody p={0}>
                        <Box 
                          h="120px" 
                          bg="blue.500" 
                          bgGradient="linear(to-r, blue.400, purple.500)"
                        >
                          <Center h="full">
                            <Icon as={FiUpload} w={12} h={12} color="white" />
                          </Center>
                        </Box>
                        <VStack p={6} spacing={4} align="stretch">
                          <Heading size="md" textAlign="center">Upload Your Resume</Heading>
                          <Text textAlign="center" color={secondaryTextColor}>
                            Upload your existing resume to analyze and improve it
                          </Text>
                          <ResumeUploader onUploadComplete={handleUploadComplete} />
                          
                          {resumeFile && (
                            <VStack spacing={4} mt={4}>
                              <Badge colorScheme="green" p={2} borderRadius="md" alignSelf="center">
                                Resume uploaded successfully!
                              </Badge>
                              
                              <Text fontWeight="bold">What would you like to do next?</Text>
                              
                              <HStack spacing={4} justify="center">
                                <Button
                                  colorScheme="blue" 
                                  onClick={() => analyzeResumeWithType('ai-check')} 
                                  isLoading={isAnalyzing && currentAnalysisType === 'ai-check'}
                                  loadingText="Analyzing"
                                  leftIcon={<Icon as={FiCheckCircle} />}
                                >
                                  AI Check
                                </Button>
                                <Button
                                  colorScheme="teal" 
                                  onClick={() => analyzeResumeWithType('ats-check')} 
                                  isLoading={isAnalyzing && currentAnalysisType === 'ats-check'}
                                  loadingText="Analyzing"
                                  leftIcon={<Icon as={FiFileText} />}
                                >
                                  ATS Check
                                </Button>
                              </HStack>
                            </VStack>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>
                  
                  <GridItem>
                    <Card 
                      variant="outline" 
                      bg={cardBg} 
                      borderColor={cardBorderColor} 
                      borderRadius="lg"
                      overflow="hidden"
                      boxShadow="sm"
                      h="full"
                      transition="all 0.3s"
                      _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
                      onClick={() => handleTabChange(1)}
                      cursor="pointer"
                    >
                      <CardBody p={0}>
                        <Box 
                          h="120px" 
                          bg="teal.500" 
                          bgGradient="linear(to-r, teal.400, green.500)"
                        >
                          <Center h="full">
                            <Icon as={FiEdit} w={12} h={12} color="white" />
                          </Center>
                        </Box>
                        <VStack p={6} spacing={4} align="stretch">
                          <Heading size="md" textAlign="center">Create From Scratch</Heading>
                          <Text textAlign="center" color={secondaryTextColor}>
                            Build a professional resume using our AI-powered tools
                          </Text>
                          <Center>
                            <Button 
                              variant="outline" 
                              colorScheme="teal" 
                              size="lg" 
                              rightIcon={<Icon as={FiEdit} />}
                            >
                              Start Creating
                            </Button>
                          </Center>
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>
                </Grid>
                
                {resumeFile && (
                  <Box mt={8}>
                    <Divider my={6} />
                    <ResumeAnalysis
                      onAnalysisSelect={analyzeResumeWithType} 
                      isAnalyzing={isAnalyzing} 
                    />
                  </Box>
                )}
              </TabPanel>

              <TabPanel p={0}>
                <Card 
                  variant="outline" 
                  bg={cardBg} 
                  borderColor={cardBorderColor} 
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="sm"
                >
                  <CardBody>
                    <ResumeForm onResumeGenerated={handleResumeGenerated} />
                  </CardBody>
                </Card>
              </TabPanel>
              
              {generatedResume && (
                <TabPanel p={0}>
                  <Card 
                    variant="outline" 
                    bg={cardBg} 
                    borderColor={cardBorderColor} 
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="sm"
                  >
                    <CardBody>
                      <VStack spacing={6} align="stretch">
                        <Heading size="md">Your ATS-Optimized Resume</Heading>
                        <Box 
                          p={6} 
                          borderWidth="1px" 
                          borderRadius="md" 
                          bg={useColorModeValue("gray.50", "gray.800")}
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
                            leftIcon={<Icon as={FiFileText} />}
                            onClick={() => {
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
                    </CardBody>
                  </Card>
                </TabPanel>
              )}
              
              {extractedText && (
                <TabPanel p={0}>
                  <Card 
                    variant="outline" 
                    bg={cardBg} 
                    borderColor={cardBorderColor} 
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="sm"
                  >
                    <CardBody>
                      <VStack spacing={6} align="stretch">
                        <Heading size="md">Extracted Text from Resume</Heading>
                        <Box 
                          p={6} 
                          borderWidth="1px" 
                          borderRadius="md" 
                          bg={useColorModeValue("gray.50", "gray.800")}
                          fontFamily="mono"
                          whiteSpace="pre-wrap"
                          maxHeight="600px"
                          overflowY="auto"
                          boxShadow="sm"
                        >
                          {extractedText}
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                </TabPanel>
              )}
              
              {analysisResults && (
                <TabPanel p={0}>
                  <Card 
                    variant="outline" 
                    bg={cardBg} 
                    borderColor={cardBorderColor} 
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="sm"
                  >
                    <CardBody>
                      <VStack spacing={6} align="stretch">
                        <Heading size="md">Analysis Results</Heading>
                        <Box 
                          p={6} 
                          borderWidth="1px" 
                          borderRadius="md" 
                          bg="white"
                          boxShadow="sm"
                        >
                          <Box mb={6}>
                            <Flex align="center" mb={2}>
                              <Heading size="md" mr={2}>Resume Score:</Heading>
                              <Badge 
                                fontSize="xl" 
                                px={3} 
                                py={1} 
                                borderRadius="md"
                                colorScheme={analysisResults.score > 80 ? "green" : analysisResults.score > 60 ? "yellow" : "red"}
                              >
                                {analysisResults.score}/100
                              </Badge>
                            </Flex>
                            <Progress 
                              value={analysisResults.score} 
                              size="lg" 
                              borderRadius="md"
                              colorScheme={analysisResults.score > 80 ? "green" : analysisResults.score > 60 ? "yellow" : "red"}
                              mb={2}
                            />
                          </Box>
                          
                          <Box mb={6} bg="green.50" p={4} borderRadius="md" borderLeft="4px solid" borderLeftColor="green.500">
                            <Heading size="sm" mb={2} color="green.700">Strengths</Heading>
                            <VStack align="stretch" spacing={2}>
                              {analysisResults.feedback.strengths.map((strength: string, index: number) => (
                                <Flex key={index}>
                                  <Icon as={FiCheckCircle} color="green.500" mt={1} mr={2} />
                                  <Text>{strength}</Text>
                                </Flex>
                              ))}
                            </VStack>
                          </Box>
                          
                          <Box mb={6} bg="orange.50" p={4} borderRadius="md" borderLeft="4px solid" borderLeftColor="orange.500">
                            <Heading size="sm" mb={2} color="orange.700">Areas for Improvement</Heading>
                            <VStack align="stretch" spacing={2}>
                              {analysisResults.feedback.improvements.map((improvement: string, index: number) => (
                                <Flex key={index}>
                                  <Icon as={FiCheckCircle} color="orange.500" mt={1} mr={2} />
                                  <Text>{improvement}</Text>
                                </Flex>
                              ))}
                            </VStack>
                          </Box>
                          
                          {analysisResults.rawAnalysis && (
                            <Box mt={4} pt={4} borderTopWidth="1px">
                              <Heading size="sm" mb={2}>Full Analysis</Heading>
                              <Text whiteSpace="pre-wrap" fontSize="sm">
                                {analysisResults.rawAnalysis}
                              </Text>
                            </Box>
                          )}
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </Box>
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
