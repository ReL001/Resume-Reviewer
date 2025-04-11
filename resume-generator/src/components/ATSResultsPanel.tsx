import React from 'react';
import {
  Box,
  Text,
  VStack,
  Heading,
  Progress,
  Badge,
  Flex,
  Icon,
  useColorModeValue,
  Divider,
  Grid,
  GridItem,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiX,
  FiCheck,
  FiSearch,
  FiFileText,
  FiInfo,
  FiList,
} from 'react-icons/fi';

interface ATSResultsPanelProps {
  analysisResults: any;
}

const ATSResultsPanel: React.FC<ATSResultsPanelProps> = ({ analysisResults }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Determine score color based on ATS score
  const getScoreColor = () => {
    const score = analysisResults.score || 0;
    if (score >= 80) return "green";
    if (score >= 60) return "yellow";
    return "red";
  };

  // Get corresponding gradient for the score badge
  const getScoreGradient = () => {
    const score = analysisResults.score || 0;
    if (score >= 80) return "linear(to-r, green.400, green.600)";
    if (score >= 60) return "linear(to-r, yellow.400, yellow.600)";
    return "linear(to-r, red.400, red.600)";
  };

  return (
    <VStack spacing={6} align="stretch" w="full">
      {/* ATS Score Section */}
      <Box p={6} bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} boxShadow="sm">
        <VStack spacing={4} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="md">ATS Compatibility Score</Heading>
            <Badge 
              fontSize="xl" 
              px={3} 
              py={1} 
              borderRadius="lg"
              bgGradient={getScoreGradient()}
              color="white"
            >
              {analysisResults.score}/100
            </Badge>
          </Flex>
          
          <Progress 
            value={analysisResults.score || 0} 
            size="lg" 
            borderRadius="md"
            colorScheme={getScoreColor()}
            hasStripe
            isAnimated
          />
          
          <Text mt={2} color={analysisResults.score >= 80 ? "green.500" : analysisResults.score >= 60 ? "yellow.600" : "red.500"} fontWeight="medium">
            {analysisResults.score >= 80 ? "Excellent" : analysisResults.score >= 60 ? "Good" : "Needs Improvement"}
          </Text>
        </VStack>
      </Box>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
        {/* Keyword Matches */}
        <GridItem>
          <Box 
            p={6} 
            bg={cardBg} 
            borderRadius="lg" 
            borderWidth="1px" 
            borderColor={borderColor}
            boxShadow="sm" 
            h="full"
          >
            <VStack spacing={4} align="stretch">
              <Flex alignItems="center">
                <Icon as={FiCheck} color="green.500" mr={2} />
                <Heading size="sm">Detected Keywords</Heading>
              </Flex>
              
              <Divider />

              {analysisResults.keywordMatches && analysisResults.keywordMatches.length > 0 ? (
                <List spacing={2}>
                  {analysisResults.keywordMatches.map((keyword: string, index: number) => (
                    <ListItem key={index} display="flex" alignItems="center">
                      <ListIcon as={FiCheckCircle} color="green.500" />
                      <Text>{keyword}</Text>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Text color="gray.500">No keywords detected in your resume.</Text>
              )}
            </VStack>
          </Box>
        </GridItem>

        {/* Missing Keywords */}
        <GridItem>
          <Box 
            p={6} 
            bg={cardBg} 
            borderRadius="lg" 
            borderWidth="1px" 
            borderColor={borderColor}
            boxShadow="sm" 
            h="full"
          >
            <VStack spacing={4} align="stretch">
              <Flex alignItems="center">
                <Icon as={FiX} color="red.500" mr={2} />
                <Heading size="sm">Suggested Keywords</Heading>
              </Flex>
              
              <Divider />

              {analysisResults.missingKeywords && analysisResults.missingKeywords.length > 0 ? (
                <List spacing={2}>
                  {analysisResults.missingKeywords.map((keyword: string, index: number) => (
                    <ListItem key={index} display="flex" alignItems="center">
                      <ListIcon as={FiAlertTriangle} color="orange.500" />
                      <Text>{keyword}</Text>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Text color="green.500">No additional keywords suggested.</Text>
              )}
            </VStack>
          </Box>
        </GridItem>
      </Grid>

      {/* Format Issues */}
      {analysisResults.formatIssues && analysisResults.formatIssues.length > 0 && (
        <Box 
          p={6} 
          bg="orange.50" 
          borderRadius="lg" 
          borderWidth="1px" 
          borderColor="orange.200"
          boxShadow="sm"
        >
          <VStack spacing={4} align="stretch">
            <Flex alignItems="center">
              <Icon as={FiFileText} color="orange.600" mr={2} />
              <Heading size="sm">Format Issues</Heading>
            </Flex>
            
            <List spacing={3}>
              {analysisResults.formatIssues.map((issue: string, index: number) => (
                <ListItem key={index} display="flex" alignItems="center">
                  <ListIcon as={FiAlertTriangle} color="orange.500" />
                  <Text>{issue}</Text>
                </ListItem>
              ))}
            </List>
          </VStack>
        </Box>
      )}

      {/* ATS Improvements */}
      {analysisResults.atsImprovements && analysisResults.atsImprovements.length > 0 && (
        <Box 
          p={6} 
          bg="blue.50" 
          borderRadius="lg" 
          borderWidth="1px" 
          borderColor="blue.200"
          boxShadow="sm"
        >
          <VStack spacing={4} align="stretch">
            <Flex alignItems="center">
              <Icon as={FiInfo} color="blue.600" mr={2} />
              <Heading size="sm">ATS Optimization Suggestions</Heading>
            </Flex>
            
            <List spacing={3}>
              {analysisResults.atsImprovements.map((improvement: string, index: number) => (
                <ListItem key={index} display="flex" alignItems="center">
                  <ListIcon as={FiList} color="blue.500" />
                  <Text>{improvement}</Text>
                </ListItem>
              ))}
            </List>
          </VStack>
        </Box>
      )}
      
      {/* Overall Assessment */}
      {analysisResults.overallAssessment && (
        <Box 
          p={6} 
          bg={cardBg}
          borderRadius="lg" 
          borderWidth="1px" 
          borderColor={borderColor}
          boxShadow="sm"
        >
          <VStack spacing={4} align="stretch">
            <Flex alignItems="center">
              <Icon as={FiSearch} color="purple.500" mr={2} />
              <Heading size="sm">Overall ATS Assessment</Heading>
            </Flex>
            
            <Divider />
            
            <Text>{analysisResults.overallAssessment}</Text>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};

export default ATSResultsPanel;