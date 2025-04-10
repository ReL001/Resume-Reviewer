import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

/**
 * Service for resume analysis and processing
 */

// Get API URL with fallback ports
const getApiUrl = () => {
  // Try to use the environment variable first
  if (import.meta.env && import.meta.env.VITE_API_URL) {
    const baseUrl = import.meta.env.VITE_API_URL;
    
    // Clean up the URL to avoid duplicate /api segments
    return baseUrl.replace(/\/api\/?$/, '');
  }
  
  // Fallback to default endpoint without /api suffix
  return 'http://localhost:5000';
};

const API_URL = getApiUrl();

export interface ResumeAnalysisResponse {
  success: boolean;
  analysis: any;
  extractedText?: string;
  error?: string;
}

/**
 * Analyzes a resume using the backend API.
 * Can handle either a File object (for upload) or a resume data object (for JSON).
 * 
 * @param data The resume File object or the resume data object
 * @param type The type of analysis requested (e.g., 'ai-check')
 * @returns Analysis results
 */
export async function analyzeResume(data: File | any, type: string): Promise<ResumeAnalysisResponse> {
  try {
    const endpoint = `${API_URL}/api/analyze-resume`;
    console.log(`Attempting to send request to: ${endpoint}`);
    
    let response;

    if (data instanceof File) {
      // Handle File upload
      console.log(`Sending analysis request (File) to ${endpoint} with type: ${type}`);
      const formData = new FormData();
      formData.append('resume', data); // Use 'resume' as the field name expected by multer
      formData.append('analysisType', type);

      response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds timeout
      });
    } else {
      // Handle JSON data - ensure we're sending it in a way the backend can understand
      console.log(`Sending analysis request (JSON) to ${endpoint} with type: ${type}`);
      
      // Create a properly formatted request object
      let requestData;
      
      if (typeof data === 'string') {
        // If data is a string (like extracted text), don't stringify it again
        requestData = {
          resumeData: data,
          analysisType: type
        };
      } else {
        // For object data, stringify it
        requestData = {
          resumeData: JSON.stringify(data),
          analysisType: type
        };
      }
      
      console.log('Content type:', typeof requestData.resumeData);
      console.log('Data length:', requestData.resumeData.length);
      
      // Send the request
      response = await axios.post(endpoint, requestData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 seconds timeout
      });
    }

    console.log("Analysis response received:", response.data);
    
    return response.data;
  } catch (error: any) {
    console.error("Error analyzing resume:", error);
    
    // Create a standardized error response
    let errorMsg = "Failed to analyze resume";
    
    if (error.response) {
      // The request was made and the server responded with an error status
      console.error("Server error response:", error.response.data);
      
      // For 404 errors, provide specific information about the URL issue
      if (error.response.status === 404) {
        errorMsg = `Server returned an error (404): "${error.response.data}". Please try again or contact support.`;
      } else {
        errorMsg = error.response.data?.error || `Server returned an error (${error.response.status})`;
      }
      
      // For debugging - log more details about the error
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
      console.error("Request URL:", error.config?.url);
      console.error("Request method:", error.config?.method);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from server");
      errorMsg = "No response received from server. The server might be down or experiencing issues.";
    } else {
      // Something happened in setting up the request
      console.error("Request setup error:", error.message);
      errorMsg = error.message || "Request setup error";
    }
    
    throw new Error(errorMsg);
  }
}

/**
 * Formats the analysis results based on the analysis type
 * 
 * @param analysis Raw analysis data from the API
 * @param analysisType Type of analysis performed
 * @returns Formatted analysis object suitable for the frontend
 */
export const formatAnalysisResults = (analysis: any, analysisType: string): any => {
  console.log("Formatting analysis results for type:", analysisType);
  console.log("Analysis data:", typeof analysis, analysis);

  // Default structure for UI
  const defaultStructure = {
    score: 0,
    feedback: {
      strengths: [],
      improvements: []
    },
    rawAnalysis: ""
  };

  if (!analysis) {
    console.error("No analysis data provided");
    return {
      ...defaultStructure,
      feedback: {
        strengths: ["No data available"],
        improvements: ["Failed to analyze resume"]
      }
    };
  }

  if (analysisType === 'ai-check') {
    try {
      // Make sure we're working with an object
      const analysisObj = typeof analysis === 'string' ? JSON.parse(analysis) : analysis;
      
      return {
        score: analysisObj.score || 0,
        feedback: {
          strengths: analysisObj.strengths || [],
          improvements: analysisObj.weaknesses || []
        },
        recommendations: analysisObj.recommendations || [],
        formattingFeedback: analysisObj.formattingFeedback || "",
        overallAssessment: analysisObj.overallAssessment || "",
        rawAnalysis: typeof analysisObj === 'object' ? JSON.stringify(analysisObj, null, 2) : analysisObj
      };
    } catch (error) {
      console.error("Error formatting AI check results:", error);
      return {
        ...defaultStructure,
        rawAnalysis: typeof analysis === 'string' ? analysis : "Error parsing analysis"
      };
    }
  } else if (analysisType === 'ats-check') {
    try {
      // Parse ATS check results
      const analysisObj = typeof analysis === 'string' ? JSON.parse(analysis) : analysis;
      
      return {
        score: analysisObj.atsScore || 0,
        feedback: {
          strengths: analysisObj.keywordMatches || [],
          improvements: analysisObj.missingKeywords || []
        },
        formatIssues: analysisObj.formatIssues || [], 
        atsImprovements: analysisObj.atsImprovements || [],
        overallAssessment: analysisObj.overallATSAssessment || "",
        keywordMatches: analysisObj.keywordMatches || [],
        missingKeywords: analysisObj.missingKeywords || [],
        rawAnalysis: typeof analysisObj === 'object' ? JSON.stringify(analysisObj, null, 2) : analysisObj
      };
    } catch (error) {
      console.error("Error formatting ATS check results:", error);
      return {
        ...defaultStructure,
        rawAnalysis: typeof analysis === 'string' ? analysis : "Error parsing analysis"
      };
    }
  } else {
    // For other analysis types, maintain the existing behavior
    return {
      score: 70, // Default score for non-AI checks
      feedback: {
        strengths: ["Analysis complete"],
        improvements: ["See raw analysis for details"]
      },
      rawAnalysis: typeof analysis === 'string' ? analysis : JSON.stringify(analysis, null, 2)
    };
  }
};

// Add new function to generate an ATS-optimized resume from user data
export const generateATSResume = async (resumeData: any) => {
  try {
    console.log("Generating ATS resume with data:", resumeData);
    
    // Call the backend API to generate the resume
    const response = await axios.post(`${API_URL}/api/generate-resume`, resumeData);
    
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
 * Generates a resume based on user-provided data (mock implementation)
 */
export const generateResume = async (formData: any) => {
  try {
    // Try to use the real API
    const resumeText = await generateATSResume(formData);
    return {
      text: resumeText,
      data: formData
    };
  } catch (error) {
    console.error('Error generating resume:', error);
    throw error;
  }
};
