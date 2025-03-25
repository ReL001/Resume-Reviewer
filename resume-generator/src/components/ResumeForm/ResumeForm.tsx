import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
  VStack,
  HStack,
  IconButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { generateATSResume } from '../../services/resumeService';

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  url?: string;
}

interface ResumeFormProps {
  onResumeGenerated: (resumeData: any, resumeText: string) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ onResumeGenerated }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  
  // Contact Information
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  });

  // Professional Summary
  const [summary, setSummary] = useState('');

  // Education
  const [education, setEducation] = useState<Education[]>([
    {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: '',
    },
  ]);

  // Work Experience
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    },
  ]);

  // Skills
  const [skills, setSkills] = useState<Skill[]>([
    { id: Date.now().toString(), name: '', level: '' },
  ]);

  // Projects
  const [projects, setProjects] = useState<Project[]>([
    {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      url: '',
    },
  ]);

  // Handle Contact Info changes
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Education changes
  const handleEducationChange = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    setEducation((prevEducation) =>
      prevEducation.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  // Handle Experience changes
  const handleExperienceChange = (
    id: string,
    field: keyof Experience,
    value: string | boolean
  ) => {
    setExperiences((prevExperiences) =>
      prevExperiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  // Handle Skills changes
  const handleSkillChange = (id: string, field: keyof Skill, value: string) => {
    setSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    );
  };

  // Handle Projects changes
  const handleProjectChange = (
    id: string,
    field: keyof Project,
    value: string
  ) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      )
    );
  };

  // Add new items
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: '',
    };
    setEducation([...education, newEducation]);
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setExperiences([...experiences, newExperience]);
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: '',
    };
    setSkills([...skills, newSkill]);
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      url: '',
    };
    setProjects([...projects, newProject]);
  };

  // Remove items
  const removeEducation = (id: string) => {
    if (education.length > 1) {
      setEducation(education.filter((edu) => edu.id !== id));
    } else {
      toast({
        title: "Cannot remove",
        description: "You need at least one education entry",
        status: "warning",
        duration: 2000,
      });
    }
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((exp) => exp.id !== id));
    } else {
      toast({
        title: "Cannot remove",
        description: "You need at least one experience entry",
        status: "warning",
        duration: 2000,
      });
    }
  };

  const removeSkill = (id: string) => {
    if (skills.length > 1) {
      setSkills(skills.filter((skill) => skill.id !== id));
    } else {
      toast({
        title: "Cannot remove",
        description: "You need at least one skill",
        status: "warning",
        duration: 2000,
      });
    }
  };

  const removeProject = (id: string) => {
    if (projects.length > 1) {
      setProjects(projects.filter((project) => project.id !== id));
    } else {
      toast({
        title: "Cannot remove",
        description: "You need at least one project",
        status: "warning",
        duration: 2000,
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    // Basic validation for required fields
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required contact information",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    // Check if at least one experience has required fields
    const hasValidExperience = experiences.some(
      (exp) => exp.company && exp.position && exp.description
    );
    if (!hasValidExperience) {
      toast({
        title: "Missing information",
        description: "Please fill in at least one complete work experience",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    // Check if at least one education has required fields
    const hasValidEducation = education.some(
      (edu) => edu.institution && edu.degree
    );
    if (!hasValidEducation) {
      toast({
        title: "Missing information",
        description: "Please fill in at least one complete education entry",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    // Check if at least one skill is filled
    const hasSkills = skills.some((skill) => skill.name);
    if (!hasSkills) {
      toast({
        title: "Missing information",
        description: "Please add at least one skill",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  // Generate resume
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Create combined resume data
      const resumeData = {
        contactInfo,
        summary,
        education: education.filter(edu => edu.institution && edu.degree),
        experience: experiences.filter(exp => exp.company && exp.position),
        skills: skills.filter(skill => skill.name),
        projects: projects.filter(proj => proj.name && proj.description),
      };
      
      // Generate ATS-optimized resume using AI
      const resumeText = await generateATSResume(resumeData);
      
      if (!resumeText) {
        throw new Error("Failed to generate resume text");
      }
      
      // Return both structured data and optimized text
      onResumeGenerated(resumeData, resumeText);
      
      toast({
        title: "Resume generated",
        description: "Your ATS-optimized resume has been created",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error generating resume:", error);
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={8} align="stretch">
        {/* Contact Information */}
        <Box>
          <Heading size="md" mb={4}>
            Contact Information
          </Heading>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                name="name"
                value={contactInfo.name}
                onChange={handleContactChange}
                placeholder="John Doe"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={contactInfo.email}
                onChange={handleContactChange}
                placeholder="john.doe@example.com"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Phone</FormLabel>
              <Input
                name="phone"
                value={contactInfo.phone}
                onChange={handleContactChange}
                placeholder="(123) 456-7890"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={contactInfo.location}
                onChange={handleContactChange}
                placeholder="City, State"
              />
            </FormControl>
            <FormControl>
              <FormLabel>LinkedIn</FormLabel>
              <Input
                name="linkedin"
                value={contactInfo.linkedin || ''}
                onChange={handleContactChange}
                placeholder="linkedin.com/in/johndoe"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Website/Portfolio</FormLabel>
              <Input
                name="website"
                value={contactInfo.website || ''}
                onChange={handleContactChange}
                placeholder="johndoe.com"
              />
            </FormControl>
          </Stack>
        </Box>

        <Divider />

        {/* Professional Summary */}
        <Box>
          <Heading size="md" mb={4}>
            Professional Summary
          </Heading>
          <FormControl>
            <FormLabel>Summary</FormLabel>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief overview of your professional background, skills, and career goals"
              rows={4}
            />
          </FormControl>
        </Box>

        <Divider />

        {/* Work Experience */}
        <Accordion defaultIndex={[0]} allowMultiple>
          <AccordionItem border="none">
            <AccordionButton px={0}>
              <Box flex="1" textAlign="left">
                <Heading size="md">Work Experience</Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} px={0}>
              <VStack spacing={6} align="stretch">
                {experiences.map((exp, index) => (
                  <Box 
                    key={exp.id} 
                    p={4} 
                    borderWidth="1px" 
                    borderRadius="md" 
                    position="relative"
                  >
                    <HStack justify="space-between" mb={4}>
                      <Text fontWeight="bold">Experience {index + 1}</Text>
                      <IconButton
                        aria-label="Remove experience"
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => removeExperience(exp.id)}
                      />
                    </HStack>
                    <Stack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Company/Organization</FormLabel>
                        <Input
                          value={exp.company}
                          onChange={(e) =>
                            handleExperienceChange(exp.id, 'company', e.target.value)
                          }
                          placeholder="Company name"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Position</FormLabel>
                        <Input
                          value={exp.position}
                          onChange={(e) =>
                            handleExperienceChange(exp.id, 'position', e.target.value)
                          }
                          placeholder="Your job title"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Location</FormLabel>
                        <Input
                          value={exp.location}
                          onChange={(e) =>
                            handleExperienceChange(exp.id, 'location', e.target.value)
                          }
                          placeholder="City, State or Remote"
                        />
                      </FormControl>
                      <HStack>
                        <FormControl>
                          <FormLabel>Start Date</FormLabel>
                          <Input
                            value={exp.startDate}
                            onChange={(e) =>
                              handleExperienceChange(exp.id, 'startDate', e.target.value)
                            }
                            placeholder="MM/YYYY"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>End Date</FormLabel>
                          <Input
                            value={exp.current ? 'Present' : exp.endDate}
                            onChange={(e) =>
                              handleExperienceChange(exp.id, 'endDate', e.target.value)
                            }
                            placeholder="MM/YYYY or Present"
                            disabled={exp.current}
                          />
                        </FormControl>
                      </HStack>
                      <FormControl>
                        <HStack>
                          <input
                            type="checkbox"
                            id={`current-${exp.id}`}
                            checked={exp.current}
                            onChange={(e) =>
                              handleExperienceChange(exp.id, 'current', e.target.checked)
                            }
                          />
                          <FormLabel htmlFor={`current-${exp.id}`} mb={0}>
                            I currently work here
                          </FormLabel>
                        </HStack>
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          value={exp.description}
                          onChange={(e) =>
                            handleExperienceChange(exp.id, 'description', e.target.value)
                          }
                          placeholder="Describe your responsibilities, achievements, and impact. Use bullet points by starting lines with a dash (-)"
                          rows={6}
                        />
                      </FormControl>
                    </Stack>
                  </Box>
                ))}
                <Button
                  leftIcon={<FiPlus />}
                  onClick={addExperience}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  alignSelf="flex-start"
                >
                  Add Experience
                </Button>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Divider />

        {/* Education */}
        <Accordion defaultIndex={[0]} allowMultiple>
          <AccordionItem border="none">
            <AccordionButton px={0}>
              <Box flex="1" textAlign="left">
                <Heading size="md">Education</Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} px={0}>
              <VStack spacing={6} align="stretch">
                {education.map((edu, index) => (
                  <Box 
                    key={edu.id} 
                    p={4} 
                    borderWidth="1px" 
                    borderRadius="md" 
                    position="relative"
                  >
                    <HStack justify="space-between" mb={4}>
                      <Text fontWeight="bold">Education {index + 1}</Text>
                      <IconButton
                        aria-label="Remove education"
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => removeEducation(edu.id)}
                      />
                    </HStack>
                    <Stack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Institution</FormLabel>
                        <Input
                          value={edu.institution}
                          onChange={(e) =>
                            handleEducationChange(edu.id, 'institution', e.target.value)
                          }
                          placeholder="University or College Name"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Degree</FormLabel>
                        <Input
                          value={edu.degree}
                          onChange={(e) =>
                            handleEducationChange(edu.id, 'degree', e.target.value)
                          }
                          placeholder="Bachelor's, Master's, etc."
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Field of Study</FormLabel>
                        <Input
                          value={edu.field}
                          onChange={(e) =>
                            handleEducationChange(edu.id, 'field', e.target.value)
                          }
                          placeholder="Computer Science, Business, etc."
                        />
                      </FormControl>
                      <HStack>
                        <FormControl>
                          <FormLabel>Start Date</FormLabel>
                          <Input
                            value={edu.startDate}
                            onChange={(e) =>
                              handleEducationChange(edu.id, 'startDate', e.target.value)
                            }
                            placeholder="MM/YYYY"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>End Date (or Expected)</FormLabel>
                          <Input
                            value={edu.endDate}
                            onChange={(e) =>
                              handleEducationChange(edu.id, 'endDate', e.target.value)
                            }
                            placeholder="MM/YYYY"
                          />
                        </FormControl>
                      </HStack>
                      <FormControl>
                        <FormLabel>GPA (optional)</FormLabel>
                        <Input
                          value={edu.gpa || ''}
                          onChange={(e) =>
                            handleEducationChange(edu.id, 'gpa', e.target.value)
                          }
                          placeholder="3.8/4.0"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Achievements/Activities</FormLabel>
                        <Textarea
                          value={edu.achievements || ''}
                          onChange={(e) =>
                            handleEducationChange(edu.id, 'achievements', e.target.value)
                          }
                          placeholder="Honors, awards, relevant coursework, etc."
                          rows={3}
                        />
                      </FormControl>
                    </Stack>
                  </Box>
                ))}
                <Button
                  leftIcon={<FiPlus />}
                  onClick={addEducation}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  alignSelf="flex-start"
                >
                  Add Education
                </Button>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Divider />

        {/* Skills */}
        <Accordion defaultIndex={[0]} allowMultiple>
          <AccordionItem border="none">
            <AccordionButton px={0}>
              <Box flex="1" textAlign="left">
                <Heading size="md">Skills</Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} px={0}>
              <VStack spacing={4} align="stretch">
                {skills.map((skill, index) => (
                  <HStack key={skill.id}>
                    <FormControl isRequired>
                      <Input
                        value={skill.name}
                        onChange={(e) =>
                          handleSkillChange(skill.id, 'name', e.target.value)
                        }
                        placeholder={`Skill ${index + 1} (e.g., JavaScript, Project Management)`}
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        value={skill.level || ''}
                        onChange={(e) =>
                          handleSkillChange(skill.id, 'level', e.target.value)
                        }
                        placeholder="Proficiency/Years (optional)"
                      />
                    </FormControl>
                    <IconButton
                      aria-label="Remove skill"
                      icon={<FiTrash2 />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => removeSkill(skill.id)}
                    />
                  </HStack>
                ))}
                <Button
                  leftIcon={<FiPlus />}
                  onClick={addSkill}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  alignSelf="flex-start"
                >
                  Add Skill
                </Button>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Divider />

        {/* Projects */}
        <Accordion defaultIndex={[0]} allowMultiple>
          <AccordionItem border="none">
            <AccordionButton px={0}>
              <Box flex="1" textAlign="left">
                <Heading size="md">Projects</Heading>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} px={0}>
              <VStack spacing={6} align="stretch">
                {projects.map((project, index) => (
                  <Box 
                    key={project.id} 
                    p={4} 
                    borderWidth="1px" 
                    borderRadius="md" 
                    position="relative"
                  >
                    <HStack justify="space-between" mb={4}>
                      <Text fontWeight="bold">Project {index + 1}</Text>
                      <IconButton
                        aria-label="Remove project"
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => removeProject(project.id)}
                      />
                    </HStack>
                    <Stack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Project Name</FormLabel>
                        <Input
                          value={project.name}
                          onChange={(e) =>
                            handleProjectChange(project.id, 'name', e.target.value)
                          }
                          placeholder="Project title"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          value={project.description}
                          onChange={(e) =>
                            handleProjectChange(project.id, 'description', e.target.value)
                          }
                          placeholder="Brief description of the project, your role, and outcomes"
                          rows={3}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Technologies Used</FormLabel>
                        <Input
                          value={project.technologies}
                          onChange={(e) =>
                            handleProjectChange(project.id, 'technologies', e.target.value)
                          }
                          placeholder="React, Node.js, AWS, etc."
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Project URL (optional)</FormLabel>
                        <Input
                          value={project.url || ''}
                          onChange={(e) =>
                            handleProjectChange(project.id, 'url', e.target.value)
                          }
                          placeholder="https://project-url.com"
                        />
                      </FormControl>
                    </Stack>
                  </Box>
                ))}
                <Button
                  leftIcon={<FiPlus />}
                  onClick={addProject}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  alignSelf="flex-start"
                >
                  Add Project
                </Button>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Divider />

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={loading}
          loadingText="Generating Resume"
          size="lg"
          width="full"
        >
          Generate ATS-Optimized Resume
        </Button>
      </VStack>
    </Box>
  );
};

export default ResumeForm;
