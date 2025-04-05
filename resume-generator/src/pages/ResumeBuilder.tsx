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
  const { isOpen: isAuthModalOpen, onOpen: onAuthModalOpen, onClose: onAuthModalClose } = useDisclosure();

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
      onAuthModalOpen();
      return;
    }

    setIsAnalyzing(true);
    setCurrentAnalysisType(analysisType);

    try {
      console.log(`Starting resume analysis: ${analysisType}`);
      const result = await analyzeResume(resumeFile, analysisType);
      console.log('Analysis completed:', result);

      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      const formattedResults = formatAnalysisResults(result.analysis, analysisType);
      console.log('Formatted results:', formattedResults);
      
      setAnalysisResults(formattedResults);
      setExtractedText(result.extractedText || '');

      let analysisTabIndex = getTabIndices().analysis;
      if (analysisTabIndex !== null) {
        setActiveTabIndex(analysisTabIndex);
      } else {
        setActiveTabIndex(activeTabIndex + 1); 
      }

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
        description: error instanceof Error ? error.message : 'There was an error analyzing your resume',
        status: 'error',
        duration: 5000,
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
    let indices: { upload: number; create: number; generated: number | null; extracted: number | null; analysis: number | null } = {
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

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = useColorModeValue('brand.500', 'brand.300');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  const stepBgGradient = useColorModeValue(
    'linear(to-r, brand.50, blue.50)',
    'linear(to-r, gray.700, blue.900)'
  );

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box
          px={6}
          py={5}
          bg={cardBg}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={cardBorderColor}
          boxShadow="md"
          position="relative"
          overflow="hidden"
        >
          <Box 
            position="absolute" 
            top={0} 
            right={0} 
            bgGradient="linear(to-r, brand.500, purple.500)" 
            opacity={0.1}
            width="300px"
            height="300px"
            borderRadius="full"
            filter="blur(60px)"
            transform="translate(100px, -150px)"
          />
          
          <Heading size="lg" mb={6} fontWeight="bold">Resume Builder</Heading>
          <Text mb={6} maxW="800px" color={secondaryTextColor}>
            Create a professional resume tailored for ATS systems. Start by uploading your existing resume for analysis, or create a new one from scratch.
          </Text>

          <Tabs 
            variant="soft-rounded" 
            index={activeTabIndex} 
            onChange={handleTabChange}
            colorScheme="brand"
            isLazy
          >
            <TabList mb={6} display="flex" flexWrap="wrap">
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
                      borderRadius="xl"
                      overflow="hidden"
                      boxShadow="sm"
                      h="full"
                      transition="all 0.3s"
                      _hover={{ boxShadow: "md" }}
                      position="relative"
                    >
                      <CardBody p={0}>
                        <Box 
                          h="120px" 
                          bgGradient="linear(to-r, brand.400, brand.600)"
                          position="relative"
                          overflow="hidden"
                        >
                          <Box
                            position="absolute"
                            top="20%"
                            left="5%"
                            width="200px"
                            height="200px"
                            borderRadius="full"
                            bg="rgba(255, 255, 255, 0.1)"
                            filter="blur(30px)"
                          />
                          
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
                              
                              <HStack spacing={4} justify="center" wrap="wrap">
                                <Button
                                  colorScheme="brand" 
                                  onClick={() => analyzeResumeWithType('ai-check')} 
                                  isLoading={isAnalyzing && currentAnalysisType === 'ai-check'}
                                  loadingText="Analyzing"
                                  leftIcon={<Icon as={FiCheckCircle} />}
                                  boxShadow="sm"
                                  _hover={{
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'md',
                                  }}
                                  transition="all 0.2s"
                                >
                                  AI Check
                                </Button>
                                <Button
                                  colorScheme="teal" 
                                  onClick={() => analyzeResumeWithType('ats-check')} 
                                  isLoading={isAnalyzing && currentAnalysisType === 'ats-check'}
                                  loadingText="Analyzing"
                                  leftIcon={<Icon as={FiFileText} />}
                                  boxShadow="sm"
                                  _hover={{
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'md',
                                  }}
                                  transition="all 0.2s"
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
                      borderRadius="xl"
                      overflow="hidden"
                      boxShadow="sm"
                      h="full"
                      transition="all 0.3s"
                      _hover={{ boxShadow: "md" }}
                      onClick={() => handleTabChange(1)}
                      cursor="pointer"
                      position="relative"
                    >
                      <CardBody p={0}>
                        <Box 
                          h="120px" 
                          bgGradient="linear(to-r, teal.400, teal.600)"
                          position="relative"
                          overflow="hidden"
                        >
                          <Box
                            position="absolute"
                            top="20%"
                            left="5%"
                            width="200px"
                            height="200px"
                            borderRadius="full"
                            bg="rgba(255, 255, 255, 0.1)"
                            filter="blur(30px)"
                          />
                          
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
                              boxShadow="sm"
                              _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'md',
                              }}
                              transition="all 0.2s"
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
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow="md"
                  position="relative"
                >
                  <Box
                    position="absolute"
                    top={0}
                    right={0}
                    bgGradient="linear(to-r, brand.50, teal.50)"
                    width="300px"
                    height="300px"
                    borderRadius="full"
                    filter="blur(60px)"
                    transform="translate(100px, -150px)"
                    zIndex={0}
                  />
                  <CardBody position="relative" zIndex={1}>
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
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="md"
                    position="relative"
                  >
                    <CardBody>
                      <VStack spacing={6} align="stretch">
                        <Flex justify="space-between" align="center">
                          <Heading size="md">Your ATS-Optimized Resume</Heading>
                          <Badge colorScheme="green" px={2} py={1} borderRadius="md">AI Generated</Badge>
                        </Flex>
                        <Box 
                          p={6} 
                          borderWidth="1px" 
                          borderRadius="lg" 
                          bg={useColorModeValue("gray.50", "gray.800")}
                          fontFamily="mono"
                          whiteSpace="pre-wrap"
                          maxHeight="600px"
                          overflowY="auto"
                          boxShadow="sm"
                        >
                          {generatedResume}
                        </Box>
                        
                        <HStack spacing={4} justify="center" wrap="wrap">
                          <Button 
                            colorScheme="brand" 
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
                            boxShadow="sm"
                            _hover={{
                              transform: 'translateY(-2px)',
                              boxShadow: 'md',
                            }}
                            transition="all 0.2s"
                          >
                            Download Resume
                          </Button>
                          <Button
                            colorScheme="teal" 
                            variant="outline" 
                            onClick={() => {
                              if (!isAuthenticated) {
                                onAuthModalOpen();
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
                            boxShadow="sm"
                            _hover={{
                              transform: 'translateY(-2px)',
                              boxShadow: 'md',
                            }}
                            transition="all 0.2s"
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
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="md"
                  >
                    <CardBody>
                      <VStack spacing={6} align="stretch">
                        <Flex justify="space-between" align="center">
                          <Heading size="md">Extracted Text from Resume</Heading>
                          <Badge colorScheme="blue" px={2} py={1} borderRadius="md">Extracted</Badge>
                        </Flex>
                        <Box 
                          p={6} 
                          borderWidth="1px" 
                          borderRadius="lg" 
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
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="md"
                    position="relative"
                  >
                    <Box
                      position="absolute"
                      top={0}
                      right={0}
                      bgGradient="linear(to-r, blue.50, purple.50)"
                      width="300px"
                      height="300px"
                      borderRadius="full"
                      filter="blur(60px)"
                      transform="translate(100px, -150px)"
                      opacity={0.5}
                      zIndex={0}
                    />
                    <CardBody position="relative" zIndex={1}>
                      <VStack spacing={6} align="stretch">
                        <Heading size="md">Resume Analysis Results</Heading>
                        <Box 
                          p={6} 
                          borderWidth="1px" 
                          borderRadius="lg" 
                          bg="white"
                          boxShadow="sm"
                        >
                          <Box mb={8}>
                            <Flex align="center" mb={3}>
                              <Heading size="md" mr={4}>Resume Score</Heading>
                              <Badge 
                                fontSize="xl" 
                                px={3} 
                                py={1} 
                                borderRadius="lg"
                                bgGradient={
                                  analysisResults.score > 80 
                                    ? "linear(to-r, green.400, green.600)" 
                                    : analysisResults.score > 60 
                                      ? "linear(to-r, yellow.400, yellow.600)" 
                                      : "linear(to-r, red.400, red.600)"
                                }
                                color="white"
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
                              hasStripe
                              isAnimated
                            />
                          </Box>
                          
                          {analysisResults.feedback && analysisResults.feedback.strengths && analysisResults.feedback.strengths.length > 0 && (
                            <Box mb={8} bg="green.50" p={5} borderRadius="lg" borderLeft="4px solid" borderLeftColor="green.500">
                              <Heading size="sm" mb={3} color="green.700">Strengths</Heading>
                              <VStack align="stretch" spacing={3}>
                                {analysisResults.feedback.strengths.map((strength: string, index: number) => (
                                  <Flex key={index} align="start">
                                    <Icon as={FiCheckCircle} color="green.500" mt={1} mr={3} />
                                    <Text>{strength}</Text>
                                  </Flex>
                                ))}
                              </VStack>
                            </Box>
                          )}
                          
                          {analysisResults.feedback && analysisResults.feedback.improvements && analysisResults.feedback.improvements.length > 0 && (
                            <Box mb={8} bg="orange.50" p={5} borderRadius="lg" borderLeft="4px solid" borderLeftColor="orange.500">
                              <Heading size="sm" mb={3} color="orange.700">Areas for Improvement</Heading>
                              <VStack align="stretch" spacing={3}>
                                {analysisResults.feedback.improvements.map((improvement: string, index: number) => (
                                  <Flex key={index} align="start">
                                    <Icon as={FiCheckCircle} color="orange.500" mt={1} mr={3} />
                                    <Text>{improvement}</Text>
                                  </Flex>
                                ))}
                              </VStack>
                            </Box>
                          )}

                          {analysisResults.recommendations && analysisResults.recommendations.length > 0 && (
                            <Box mb={8} bg="blue.50" p={5} borderRadius="lg" borderLeft="4px solid" borderLeftColor="blue.500">
                              <Heading size="sm" mb={3} color="blue.700">Recommendations</Heading>
                              <VStack align="stretch" spacing={3}>
                                {analysisResults.recommendations.map((recommendation: string, index: number) => (
                                  <Flex key={index} align="start">
                                    <Icon as={FiCheckCircle} color="blue.500" mt={1} mr={3} />
                                    <Text>{recommendation}</Text>
                                  </Flex>
                                ))}
                              </VStack>
                            </Box>
                          )}
                          
                          {analysisResults.formattingFeedback && (
                            <Box mb={8} bg="purple.50" p={5} borderRadius="lg" borderLeft="4px solid" borderLeftColor="purple.500">
                              <Heading size="sm" mb={3} color="purple.700">Formatting Feedback</Heading>
                              <Text>{analysisResults.formattingFeedback}</Text>
                            </Box>
                          )}

                          {analysisResults.overallAssessment && (
                            <Box mb={8} bg="gray.50" p={5} borderRadius="lg" borderLeft="4px solid" borderLeftColor="gray.500">
                              <Heading size="sm" mb={3} color="gray.700">Overall Assessment</Heading>
                              <Text>{analysisResults.overallAssessment}</Text>
                            </Box>
                          )}
                          
                          {analysisResults.rawAnalysis && (
                            <Box mt={8} pt={6} borderTopWidth="1px">
                              <Heading size="sm" mb={4}>Detailed Analysis</Heading>
                              <Text whiteSpace="pre-wrap" fontSize="sm" color="gray.700">
                                {analysisResults.rawAnalysis}
                              </Text>
                            </Box>
                          )}
                        </Box>
                        
                        <HStack justify="center" spacing={4}>
                          <Button
                            leftIcon={<Icon as={FiEdit} />}
                            colorScheme="brand"
                            onClick={() => handleTabChange(1)}
                            boxShadow="sm"
                            _hover={{
                              transform: 'translateY(-2px)',
                              boxShadow: 'md',
                            }}
                            transition="all 0.2s"
                          >
                            Create Improved Resume
                          </Button>
                          <Button
                            variant="outline"
                            colorScheme="teal"
                            onClick={() => analyzeResumeWithType('ats-check')}
                            boxShadow="sm"
                            _hover={{
                              transform: 'translateY(-2px)',
                              boxShadow: 'md',
                            }}
                            transition="all 0.2s"
                          >
                            Get ATS Check
                          </Button>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={onAuthModalClose} />
    </Container>
  );
};

export default ResumeBuilder;
