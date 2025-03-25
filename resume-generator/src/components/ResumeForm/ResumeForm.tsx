import React, { useState } from 'react';
import {
  VStack,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  SimpleGrid,
  useToast,
  Text,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  FormErrorMessage
} from '@chakra-ui/react';
import { generateResume } from '../../services/resumeService';
import { useAuth } from '../../contexts/AuthContext';

interface ResumeFormProps {
  onResumeGenerated: (data: any, text: string) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ onResumeGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
    },
    summary: '',
    workExperience: [{
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    }],
    education: [{
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
      gpa: '',
      description: '',
    }],
    skills: '',
    jobTitle: '',
    targetIndustry: '',
  });

  const toast = useToast();
  const { isAuthenticated } = useAuth();

  const handleChange = (section: string, field: string, value: string, index?: number) => {
    setFormData(prevState => {
      if (index !== undefined && Array.isArray(prevState[section])) {
        // For array fields like workExperience and education
        const newArray = [...prevState[section]];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prevState, [section]: newArray };
      } else if (section === 'personalInfo') {
        // For nested objects like personalInfo
        return { 
          ...prevState, 
          personalInfo: { ...prevState.personalInfo, [field]: value } 
        };
      } else {
        // For flat fields like summary, skills, etc.
        return { ...prevState, [field]: value };
      }
    });
  };

  const handleGenerateResume = async () => {
    try {
      setIsLoading(true);
      
      // Basic validation
      if (!formData.personalInfo.name || !formData.personalInfo.email) {
        toast({
          title: 'Missing information',
          description: 'Please provide at least your name and email',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      const result = await generateResume(formData);
      onResumeGenerated(formData, result.text);
      
      toast({
        title: 'Resume Generated',
        description: 'Your resume has been successfully generated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: 'Generation failed',
        description: 'There was an error generating your resume. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // This is a simplified version of what would be a more complex form
  return (
    <VStack spacing={8} align="stretch">
      <Box>
        <Heading size="md" mb={4}>Create Your Resume</Heading>
        <Text>Fill in your information to generate a professional, ATS-optimized resume.</Text>
      </Box>
      
      <Tabs isFitted colorScheme="blue" variant="enclosed">
        <TabList>
          <Tab>Personal Info</Tab>
          <Tab>Experience</Tab>
          <Tab>Education</Tab>
          <Tab>Skills & Target</Tab>
        </TabList>
        
        <TabPanels>
          {/* Personal Info Tab */}
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input 
                  placeholder="John Doe"
                  value={formData.personalInfo.name}
                  onChange={(e) => handleChange('personalInfo', 'name', e.target.value)}
                />
              </FormControl>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    type="email"
                    placeholder="johndoe@example.com"
                    value={formData.personalInfo.email}
                    onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Phone</FormLabel>
                  <Input 
                    placeholder="(123) 456-7890"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
                  />
                </FormControl>
              </SimpleGrid>
              
              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input 
                  placeholder="City, State"
                  value={formData.personalInfo.location}
                  onChange={(e) => handleChange('personalInfo', 'location', e.target.value)}
                />
              </FormControl>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel>LinkedIn Profile</FormLabel>
                  <Input 
                    placeholder="linkedin.com/in/johndoe"
                    value={formData.personalInfo.linkedin}
                    onChange={(e) => handleChange('personalInfo', 'linkedin', e.target.value)}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Portfolio/Website</FormLabel>
                  <Input 
                    placeholder="johndoe.com"
                    value={formData.personalInfo.portfolio}
                    onChange={(e) => handleChange('personalInfo', 'portfolio', e.target.value)}
                  />
                </FormControl>
              </SimpleGrid>
            </VStack>
          </TabPanel>
          
          {/* Other tabs would be implemented here */}
          <TabPanel>
            <Text>Work experience form would go here</Text>
          </TabPanel>
          
          <TabPanel>
            <Text>Education form would go here</Text>
          </TabPanel>
          
          <TabPanel>
            <Text>Skills form would go here</Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      <Button
        colorScheme="blue"
        size="lg"
        onClick={handleGenerateResume}
        isLoading={isLoading}
        loadingText="Generating Resume..."
        width={{ base: "100%", md: "auto" }}
        alignSelf="center"
        mt={4}
      >
        Generate Resume
      </Button>
    </VStack>
  );
};

export default ResumeForm;
