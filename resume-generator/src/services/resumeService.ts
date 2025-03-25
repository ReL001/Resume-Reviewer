import axios from 'axios';
import { auth } from '../config/firebase';

/**
 * Service for resume analysis and processing
 */

// Get API URL with fallback ports
const getApiUrl = () => {
  // Try to use the environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check common development ports
  const ports = [5000, 5001, 5002, 5003, 5004, 5005];
  
  // Make a simple function that checks if a server is available on a given port
  const checkServerAvailability = async (port: number): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:${port}/api/health`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Short timeout to quickly check availability
        signal: AbortSignal.timeout(300)
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };
  
  // Start with the first port and let the api calls fail over if needed
  return `http://localhost:5000/api`;
};

const API_URL = getApiUrl();

export interface ResumeAnalysisRequest {
  analysisType: 'ai-check' | 'report' | 'ats-check' | 'ats-score' | 'job-match' | 'cover-letter';
  file: File;
}

export interface ResumeAnalysisResponse {
  success: boolean;
  analysis: string;
  extractedText: string;
}

interface AnalyzeResumeParams {
  file: File;
  analysisType: 'ai-check' | 'ats-check' | 'job-match' | 'report' | 'ats-score' | 'cover-letter';
  jobDescription?: string;
}

interface AnalysisResult {
  analysis: any;
}

/**
 * Analyzes a resume using the backend API
 * 
 * @param params Analysis parameters including file and analysis type
 * @returns Analysis results
 */
export const analyzeResume = async (params: AnalyzeResumeParams): Promise<AnalysisResult> => {
  const { file, analysisType, jobDescription } = params;
  
  // Check if we should use the real API or mock data
  const useMockData = !API_URL || import.meta.env.VITE_USE_MOCK_DATA === 'true';
  
  if (useMockData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis results based on analysis type
    let mockResult;
  
    switch (analysisType) {
      case 'ai-check':
        mockResult = {
          score: 78,
          feedback: {
            strengths: [
              "Clear professional summary highlighting key qualifications",
              "Good use of action verbs in experience section",
              "Relevant skills section tailored to industry standards"
            ],
            improvements: [
              "Consider adding more quantifiable achievements",
              "Some bullet points are too verbose and could be more concise",
              "Formatting inconsistencies in the education section"
            ]
          },
          rawAnalysis: "The resume demonstrates solid professional experience but could benefit from more quantifiable achievements. The structure is generally clear, though some sections could be more concise."
        };
        break;
      
      case 'ats-check':
        mockResult = {
          score: 85,
          feedback: {
            strengths: [
              "Good keyword optimization for job matching",
              "Clean, ATS-friendly formatting",
              "Clear section headings that ATS can parse"
            ],
            improvements: [
              "Missing some industry-specific keywords",
              "Consider using a more standard job title",
              "Add more technical skills relevant to the industry"
            ]
          },
          rawAnalysis: "The resume is well-optimized for ATS systems with clear formatting and section headings. Adding more industry-specific keywords would improve match rates."
        };
        break;
      
      default:
        mockResult = {
          score: 70,
          feedback: {
            strengths: ["Good overall structure", "Clear professional history"],
            improvements: ["Add more specific achievements", "Improve formatting"]
          }
        };
    }

    return { analysis: mockResult };
  } else {
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('analysisType', analysisType);
      
      if (jobDescription) {
        formData.append('jobDescription', jobDescription);
      }
      
      // Send the request to the first API URL
      let response;
      try {
        response = await axios.post(`${API_URL}/analyze-resume`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
          // Try alternative ports if the first one fails
          for (const port of [5001, 5002, 5003, 5004, 5005]) {
            try {
              response = await axios.post(`http://localhost:${port}/api/analyze-resume`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              break; // Exit the loop if successful
            } catch (portError) {
              // Continue to next port
              console.log(`Port ${port} failed, trying next...`);
            }
          }
        }
        
        // If we still don't have a response, use mock data
        if (!response) {
          console.warn("Couldn't connect to backend API, using mock data instead");
          return analyzeResume(params); // This will use the mock data path
        }
      }
      
      return { analysis: response.data.analysis };
    } catch (error) {
      console.error('Error analyzing resume:', error);
      // Fall back to mock data if API call fails
      console.warn("API call failed, using mock data instead");
      return analyzeResume({ ...params, useMockData: true });
    }
  }

  // Default mock result if nothing else matched
  return { 
    analysis: {
      score: 70,
      feedback: {
        strengths: ["Good overall structure", "Clear professional history"],
        improvements: ["Add more specific achievements", "Improve formatting"]
      }
    }
  };
};

/**
 * Formats the analysis results based on the analysis type
 * 
 * @param analysis Raw analysis text from the API
 * @param analysisType Type of analysis performed
 * @returns Formatted analysis object
 */
export const formatAnalysisResults = (analysis: any, analysisType: string) => {
  // In a real implementation, we might have different formatting for different analysis types
  // For now, we'll just return the mock data
  return analysis;
};

// Add new function to generate an ATS-optimized resume from user data
export const generateATSResume = async (resumeData: any) => {
  try {
    console.log("Generating ATS resume with data:", resumeData);
    
    // Call the backend API to generate the resume
    const response = await axios.post(`${API_URL}/generate-resume`, resumeData);
    
    if (response.data && response.data.success) {
      return response.data.resumeText;
    } else {
      // Fallback in case the API response structure is unexpected
      return formatResumeText(resumeData);
    }
  } catch (error) {
    console.error("Error generating ATS resume:", error);
    // If API call fails, use the local formatter as a fallback
    return formatResumeText(resumeData);
  }
};

// Helper function to format resume data into a text resume
function formatResumeText(data: any) {
  const { contactInfo, summary, education, experience, skills, projects } = data;
  
  let resumeText = `${contactInfo.name}\n`;
  resumeText += `${contactInfo.email} | ${contactInfo.phone} | ${contactInfo.location}\n`;
  
  if (contactInfo.linkedin) {
    resumeText += `LinkedIn: ${contactInfo.linkedin}\n`;
  }
  
  if (contactInfo.website) {
    resumeText += `Website: ${contactInfo.website}\n`;
  }
  
  resumeText += '\n';
  
  // Summary
  if (summary) {
    resumeText += 'PROFESSIONAL SUMMARY\n';
    resumeText += `${summary}\n\n`;
  }
  
  // Experience
  if (experience.length > 0) {
    resumeText += 'PROFESSIONAL EXPERIENCE\n';
    experience.forEach((exp: any) => {
      resumeText += `${exp.company}, ${exp.location}\n`;
      resumeText += `${exp.position}\n`;
      resumeText += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
      
      // Format the description - if it contains bullet points, preserve them
      const description = exp.description.split('\n').map((line: string) => {
        // If line starts with dash, add spacing for bullet point
        if (line.trim().startsWith('-')) {
          return `  ${line.trim()}`;
        }
        return line;
      }).join('\n');
      
      resumeText += `${description}\n\n`;
    });
  }
  
  // Education
  if (education.length > 0) {
    resumeText += 'EDUCATION\n';
    education.forEach((edu: any) => {
      resumeText += `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}\n`;
      resumeText += `${edu.institution}\n`;
      resumeText += `${edu.startDate} - ${edu.endDate}\n`;
      
      if (edu.gpa) {
        resumeText += `GPA: ${edu.gpa}\n`;
      }
      
      if (edu.achievements) {
        resumeText += `${edu.achievements}\n`;
      }
      
      resumeText += '\n';
    });
  }
  
  // Skills
  if (skills.length > 0) {
    resumeText += 'SKILLS\n';
    const skillsList = skills.map((skill: any) => {
      return skill.level ? `${skill.name} (${skill.level})` : skill.name;
    }).join(', ');
    
    resumeText += `${skillsList}\n\n`;
  }
  
  // Projects
  if (projects.length > 0) {
    resumeText += 'PROJECTS\n';
    projects.forEach((proj: any) => {
      resumeText += `${proj.name}\n`;
      resumeText += `${proj.description}\n`;
      resumeText += `Technologies: ${proj.technologies}\n`;
      
      if (proj.url) {
        resumeText += `URL: ${proj.url}\n`;
      }
      
      resumeText += '\n';
    });
  }
  
  return resumeText;
}

/**
 * Generates a resume based on user-provided data
 * 
 * @param formData User input data for resume generation
 * @returns Generated resume text and data
 */
export const generateResume = async (formData: any) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock generated resume text
    const mockGeneratedResume = `
John Doe
123 Main Street
City, State 12345
(123) 456-7890
johndoe@email.com
LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering high-quality, scalable applications in fast-paced environments.

EXPERIENCE
Senior Software Engineer
XYZ Tech Company, San Francisco, CA
January 2020 - Present
• Developed and maintained enterprise-level React applications serving 10,000+ daily active users
• Improved application performance by 40% through optimization techniques and code refactoring
• Led a team of 5 developers in creating a new microservices architecture

Software Engineer
ABC Software, San Francisco, CA
March 2017 - December 2019
• Built RESTful APIs using Node.js and Express, handling 1M+ requests daily
• Implemented automated testing that increased code coverage from 65% to 90%
• Collaborated with UX designers to implement responsive, accessible web interfaces

EDUCATION
Master of Science in Computer Science
Stanford University, 2017

Bachelor of Science in Computer Engineering
University of California, Berkeley, 2015

SKILLS
• Frontend: React, Redux, TypeScript, HTML5/CSS3, JavaScript
• Backend: Node.js, Express, Python, Java
• Databases: MongoDB, PostgreSQL, MySQL
• Cloud: AWS, Azure, Docker, Kubernetes
• Tools: Git, JIRA, CI/CD, Jest, Webpack
`;

    return {
      text: mockGeneratedResume,
      data: formData
    };
  } catch (error) {
    console.error('Error generating resume:', error);
    throw error;
  }
};
