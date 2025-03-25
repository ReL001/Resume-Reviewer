import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  VStack,
  Text,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
} from '@chakra-ui/react';

const CoverLetterBuilder = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    recipient: '',
    skills: '',
    experience: '',
    jobDescription: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateCoverLetter = async () => {
    // Basic validation
    if (!formData.name || !formData.company || !formData.position) {
      toast({
        title: 'Missing information',
        description: 'Please fill in your name, the company name, and the position you are applying for.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock generated cover letter
      const generatedLetter = `
Dear ${formData.recipient || 'Hiring Manager'},

I am writing to express my interest in the ${formData.position} position at ${formData.company}. With my background in ${formData.experience || 'relevant fields'} and proficiency in ${formData.skills || 'relevant skills'}, I believe I would make a valuable addition to your team.

Throughout my career, I have developed strong skills in problem-solving, communication, and teamwork. I am particularly drawn to ${formData.company} because of its reputation for innovation and commitment to excellence.

The job description you provided aligns perfectly with my experience. I have successfully completed similar projects and would be excited to bring my expertise to your organization.

Thank you for considering my application. I look forward to the opportunity to discuss how my background and skills would be beneficial to ${formData.company}.

Sincerely,
${formData.name}
${formData.email}
${formData.phone}
`;

      setCoverLetter(generatedLetter);
      setActiveTab(1); // Switch to the generated cover letter tab

      toast({
        title: 'Cover Letter Generated',
        description: 'Your cover letter has been successfully generated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'There was an error generating your cover letter. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Cover Letter Builder</Heading>
          <Text>Create a professional cover letter tailored to your job application.</Text>
        </Box>

        <Tabs index={activeTab} onChange={handleTabChange} variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>Input Information</Tab>
            {coverLetter && <Tab>Generated Cover Letter</Tab>}
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Heading size="md">Personal Information</Heading>
                <FormControl isRequired>
                  <FormLabel>Your Full Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                </FormControl>

                <HStack spacing={4}>
                  <FormControl>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(123) 456-7890"
                    />
                  </FormControl>
                </HStack>

                <Heading size="md" mt={4}>Job Information</Heading>
                <FormControl isRequired>
                  <FormLabel>Company Name</FormLabel>
                  <Input
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Company Inc."
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Position/Job Title</FormLabel>
                  <Input
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Software Engineer"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Recipient's Name (if known)</FormLabel>
                  <Input
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleInputChange}
                    placeholder="Hiring Manager"
                  />
                </FormControl>

                <Heading size="md" mt={4}>Additional Information</Heading>
                <FormControl>
                  <FormLabel>Key Skills (comma separated)</FormLabel>
                  <Input
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="JavaScript, React, Node.js"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Relevant Experience (brief summary)</FormLabel>
                  <Textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="5+ years of experience in web development..."
                    rows={3}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Job Description (paste from job posting)</FormLabel>
                  <Textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                    placeholder="Paste the job description here..."
                    rows={5}
                  />
                </FormControl>

                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={generateCoverLetter}
                  isLoading={isGenerating}
                  loadingText="Generating..."
                  alignSelf="flex-start"
                  mt={4}
                >
                  Generate Cover Letter
                </Button>
              </VStack>
            </TabPanel>

            {coverLetter && (
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Heading size="md">Your Generated Cover Letter</Heading>
                  <Box
                    p={6}
                    borderWidth="1px"
                    borderRadius="md"
                    bg="white"
                    whiteSpace="pre-wrap"
                    minHeight="400px"
                    fontFamily="serif"
                  >
                    {coverLetter}
                  </Box>

                  <HStack spacing={4}>
                    <Button
                      colorScheme="blue"
                      onClick={() => {
                        // Download as text file
                        const element = document.createElement("a");
                        const file = new Blob([coverLetter], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = `Cover_Letter_${formData.company}.txt`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                    >
                      Download as Text
                    </Button>
                    <Button
                      colorScheme="teal"
                      onClick={() => {
                        // In a real app, this would save to the user's account
                        toast({
                          title: 'Cover Letter saved',
                          description: 'Your cover letter has been saved to your account',
                          status: 'success',
                          duration: 3000,
                          isClosable: true,
                        });
                      }}
                    >
                      Save to My Account
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab(0)}
                    >
                      Edit Information
                    </Button>
                  </HStack>
                </VStack>
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default CoverLetterBuilder;